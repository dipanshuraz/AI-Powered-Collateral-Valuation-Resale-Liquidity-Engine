import type { EstimateRequest, EstimateResponse } from "@/lib/schemas";
import { queryCompsInRadius, type CompListing } from "@/lib/comps/query";
import {
  getCircleRatesFile,
  matchCityFromText,
  getTierFallback,
} from "@/lib/data/circle-rates";
import { geocodeAddress } from "@/lib/geo/geocode";
import {
  fetchMagicBricksFromSearchUrl,
  fetchMagicBricksListings,
} from "@/lib/magicbricks/fetch-property-search";
import { amenityScoreFromLandmarks } from "@/lib/magicbricks/landmarks";
import { fetchPortalSearchUrl } from "@/lib/portals/fetch-portal-search-url";
import {
  infrastructureProximityIndex,
  neighbourhoodQualityScore,
} from "@/lib/engine/user-place-scores";

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function medianSorted(a: number[]) {
  if (a.length === 0) return null;
  const s = [...a].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[m - 1]! + s[m]!) / 2 : s[m]!;
}

function scanContextNotes(text: string | undefined): string[] {
  if (!text?.trim()) return [];
  const t = text.toLowerCase();
  const tags: string[] = [];
  if (/(metro|subway|line\s*2|line\s*1)/i.test(t)) tags.push("user_noted_transit_access");
  if (/(airport|highway|expressway|ring\s*road)/i.test(t))
    tags.push("user_noted_connectivity");
  if (/(rera|title|encumbrance|lien)/i.test(t)) tags.push("user_noted_legal_keywords");
  return tags;
}

export async function runEstimate(
  input: EstimateRequest
): Promise<EstimateResponse> {
  const sources: string[] = ["circle_rate_table", "rule_engine"];

  let lat = input.lat;
  let lon = input.lon;
  let displayName: string | undefined;
  let cityHint: string | undefined;

  if ((lat === undefined || lon === undefined) && input.address?.trim()) {
    const g = await geocodeAddress(input.address);
    if (g) {
      lat = g.lat;
      lon = g.lon;
      displayName = g.display_name;
      cityHint = g.city_hint;
      sources.push("nominatim_geocode");
    }
  }

  if (lat === undefined || lon === undefined) {
    throw new Error(
      input.address?.trim()
        ? "Geocoding failed or timed out. Provide lat and lon, or try a fuller address."
        : "Provide both lat and lon, or an address for geocoding."
    );
  }

  const file = getCircleRatesFile();
  const searchBlob = [displayName, cityHint, input.address]
    .filter(Boolean)
    .join(" ");

  const cityMatch = searchBlob ? matchCityFromText(searchBlob) : null;

  let circlePsfFloor: number;
  let tier: 1 | 2 | 3;
  let matchedCityId: string | null = null;
  let circleSource: "city_table" | "tier_fallback" | "none" = "none";

  if (cityMatch) {
    circlePsfFloor = cityMatch.row.circle_rate_inr_per_sqft_floor;
    tier = clamp(cityMatch.row.tier, 1, 3) as 1 | 2 | 3;
    matchedCityId = cityMatch.row.id;
    circleSource = "city_table";
  } else if (input.city_tier) {
    tier = clamp(input.city_tier, 1, 3) as 1 | 2 | 3;
    circlePsfFloor = getTierFallback(tier).circle_rate_inr_per_sqft_floor;
    circleSource = "tier_fallback";
  } else {
    tier = 2;
    circlePsfFloor = getTierFallback(2).circle_rate_inr_per_sqft_floor;
    circleSource = "tier_fallback";
  }

  const tierPrem = tier === 1 ? 1.22 : tier === 2 ? 1.12 : 1.06;

  const typeMult =
    input.property_type === "residential"
      ? 1.0
      : input.property_type === "commercial"
        ? 1.12
        : 0.94;

  const subMult: Record<string, number> = {
    apartment: 1.05,
    villa: 1.02,
    plot: 1.0,
    shop: 1.1,
    warehouse: 0.92,
    other: 0.98,
  };
  const fung = subMult[input.property_sub_type] ?? 1;

  const ageMult =
    input.age_bucket === "new" ? 1.04 : input.age_bucket === "mid" ? 1.0 : 0.9;

  let legalMult = 1;
  if (input.legal?.tenure === "leasehold") legalMult *= 0.97;
  if (input.legal?.title_clarity === "uncertain") legalMult *= 0.93;

  let floorMult = 1;
  if (
    input.floor !== undefined &&
    input.floor > 3 &&
    input.has_lift === false
  ) {
    floorMult = 0.96;
  }

  const occMult =
    input.occupancy === "vacant"
      ? 0.98
      : input.occupancy === "rented"
        ? 1.01
        : 1.0;

  const modelPsf =
    circlePsfFloor *
    tierPrem *
    typeMult *
    fung *
    ageMult *
    legalMult *
    floorMult *
    occMult;

  const modelTotal = modelPsf * input.size_sqft;

  const compRadius = input.comp_radius_km;
  let mbExtra: CompListing[] = [];
  let mbError: string | undefined;
  let mbRawFetched = 0;

  const mb = input.magicbricks;
  if (mb?.enabled) {
    if (mb.search_url?.trim()) {
      const r = await fetchMagicBricksFromSearchUrl(mb.search_url.trim());
      mbExtra = r.listings;
      mbError = r.error;
      mbRawFetched = r.rawCount;
    } else if (mb.city_id?.trim()) {
      const r = await fetchMagicBricksListings({
        cityId: mb.city_id.trim(),
        localityId: mb.locality_id?.trim(),
        page: mb.page,
      });
      mbExtra = r.listings;
      mbError = r.error;
      mbRawFetched = r.rawCount;
    }
    if (mbExtra.length) sources.push("magicbricks_property_search");
  }

  const portalExtra: CompListing[] = [];
  const portalRaw: Record<string, number> = {};
  const portalErrors: Record<string, string> = {};

  for (const feed of input.listing_feeds ?? []) {
    if (!feed.enabled || !feed.search_url?.trim()) continue;
    const r = await fetchPortalSearchUrl(feed.provider, feed.search_url.trim());
    portalExtra.push(...r.listings);
    portalRaw[feed.provider] = r.rawCount;
    if (r.error) portalErrors[feed.provider] = r.error;
    if (r.listings.length) sources.push(`listing_feed_${feed.provider}`);
  }

  const extraListings = [...mbExtra, ...portalExtra];

  const seedOnly = queryCompsInRadius(lat, lon, compRadius, []);
  const comps = queryCompsInRadius(lat, lon, compRadius, extraListings);
  if (seedOnly.count > 0) sources.push("comps_seed_radius");

  const isSeed = (x: CompListing) => !x.source || x.source === "seed";
  const seedInRadius = comps.within_radius.filter(isSeed).length;
  const mbInRadius = comps.within_radius.filter(
    (x) => x.source === "magicbricks"
  ).length;
  const acres99InRadius = comps.within_radius.filter(
    (x) => x.source === "99acres"
  ).length;
  const housingInRadius = comps.within_radius.filter(
    (x) => x.source === "housing"
  ).length;
  const nobrokerInRadius = comps.within_radius.filter(
    (x) => x.source === "nobroker"
  ).length;
  const otherPortalInRadius =
    acres99InRadius + housingInRadius + nobrokerInRadius;

  const amenity = amenityScoreFromLandmarks(comps.within_radius);

  const infraDefault = {
    metro: 3,
    rail: 3,
    highway: 3,
    commercial_hub: 3,
    school: 3,
    hospital: 3,
  };
  const infraIn = input.infrastructure_proximity ?? infraDefault;
  const infraIdx = infrastructureProximityIndex(infraIn);

  const neighDefault = {
    land_use: "mixed_use" as const,
    planning: "mixed" as const,
  };
  const neighIn = input.neighbourhood ?? neighDefault;
  const neighScore = neighbourhoodQualityScore(neighIn);

  const contextBlob = [
    input.collateral_context?.location_notes,
    input.collateral_context?.legal_rera_notes,
    input.collateral_context?.documents_summary,
  ]
    .filter(Boolean)
    .join("\n");
  const contextTags = scanContextNotes(contextBlob);

  let blendedMid = modelTotal;
  if (comps.median_price_per_sqft != null) {
    const compTotalMid = comps.median_price_per_sqft * input.size_sqft;
    if (comps.count >= 3) {
      blendedMid = 0.38 * modelTotal + 0.62 * compTotalMid;
    } else {
      blendedMid = 0.55 * modelTotal + 0.45 * compTotalMid;
    }
  }

  const amenityBump = 1 + Math.min(0.025, amenity.score * 0.03);
  blendedMid *= amenityBump;

  const infraNeighBump =
    1 +
    ((infraIdx - 50) / 100) * 0.09 +
    ((neighScore - 58) / 100) * 0.07;
  blendedMid *= clamp(infraNeighBump, 0.93, 1.1);

  let confidence = 0.52;
  if (circleSource === "city_table") confidence += 0.14;
  if (circleSource === "tier_fallback") confidence -= 0.08;
  if (comps.count >= 3) confidence += 0.12;
  else if (comps.count > 0) confidence += 0.06;
  if (displayName) confidence += 0.04;
  if (mbInRadius >= 2) confidence += 0.03;
  if (otherPortalInRadius >= 2) confidence += 0.02;
  if (mb?.enabled && mbError) confidence = clamp(confidence - 0.06, 0.2, 0.9);
  const portalErrCt = Object.keys(portalErrors).length;
  if (portalErrCt > 0)
    confidence = clamp(confidence - Math.min(0.09, portalErrCt * 0.03), 0.2, 0.9);
  confidence = clamp(
    confidence + (infraIdx / 100) * 0.035 + (neighScore / 100) * 0.025,
    0.2,
    0.92
  );
  const um = input.collateral_uploads_meta;
  if (um) {
    const docCt =
      um.paper_count + um.internal_photo_count + um.external_photo_count;
    if (docCt > 0) {
      confidence = clamp(
        confidence + Math.min(0.05, docCt * 0.012),
        0.2,
        0.92
      );
    }
  }
  confidence = clamp(confidence, 0.28, 0.9);

  const spread = clamp(0.11 + (1 - confidence) * 0.12, 0.07, 0.2);
  const marketMin = Math.round(blendedMid * (1 - spread));
  const marketMax = Math.round(blendedMid * (1 + spread));

  let liquidityDiscount = 0.18;
  if (tier === 3) liquidityDiscount += 0.04;
  if (input.age_bucket === "old") liquidityDiscount += 0.05;
  if (input.legal?.title_clarity === "uncertain") liquidityDiscount += 0.06;
  if (input.property_sub_type === "warehouse" || input.property_sub_type === "plot")
    liquidityDiscount += 0.03;
  if (comps.count < 2) liquidityDiscount += 0.04;
  liquidityDiscount -= amenity.score * 0.04;
  liquidityDiscount -= (infraIdx / 100) * 0.035 + (neighScore / 100) * 0.025;

  liquidityDiscount = clamp(liquidityDiscount, 0.12, 0.32);

  const distressMin = Math.round(marketMin * (1 - liquidityDiscount));
  const distressMax = Math.round(marketMax * (1 - liquidityDiscount));

  let resale = 48;
  resale += tier === 1 ? 18 : tier === 2 ? 10 : 4;
  if (input.property_sub_type === "apartment") resale += 10;
  if (comps.count >= 5) resale += 8;
  resale += Math.round(amenity.score * 10);
  if (input.rental_yield_percent && input.rental_yield_percent >= 2.5)
    resale += 6;
  if (input.age_bucket === "old") resale -= 12;
  if (input.legal?.title_clarity === "uncertain") resale -= 14;
  if (input.property_sub_type === "warehouse") resale -= 10;

  const tierLiqBonus = cityMatch
    ? getTierFallback(clamp(cityMatch.row.tier, 1, 3) as 1 | 2 | 3)
        .liquidity_bonus
    : getTierFallback(tier).liquidity_bonus;
  resale += tierLiqBonus;

  resale += Math.round((infraIdx - 50) / 6);
  resale += Math.round((neighScore - 58) / 8);

  resale = clamp(Math.round(resale), 12, 96);

  const tLow = clamp(Math.round(220 - resale * 1.85), 30, 400);
  const tHigh = clamp(Math.round(320 - resale * 1.4), 45, 540);

  const drivers: string[] = [];
  if (tier === 1) drivers.push("tier_1_micro_market_proxy");
  if (input.property_sub_type === "apartment")
    drivers.push("standard_apartment_fungibility");
  if (comps.count >= 3) drivers.push("listing_comps_within_radius");
  if (mbInRadius >= 1) drivers.push("magicbricks_listings_in_radius");
  if (otherPortalInRadius >= 1)
    drivers.push("portal_feed_listings_in_radius");
  if (amenity.score >= 0.35)
    drivers.push("landmark_amenity_proxy_from_comps");
  drivers.push(...contextTags);
  if (input.rental_yield_percent && input.rental_yield_percent >= 2.5)
    drivers.push("rental_yield_support");
  if (input.infrastructure_proximity)
    drivers.push("user_infrastructure_proximity");
  if (input.neighbourhood) drivers.push("user_neighbourhood_quality");
  if (um && um.paper_count + um.internal_photo_count + um.external_photo_count > 0)
    drivers.push("collateral_uploads_declared");

  const flags: string[] = [];
  if (circleSource === "tier_fallback")
    flags.push("outside_named_circle_rate_row_used_tier_fallback");
  if (comps.count === 0) flags.push("no_comps_in_radius");
  if (comps.count > 0 && comps.count < 3)
    flags.push("thin_comparable_listings");
  if (mb?.enabled && mbError)
    flags.push("magicbricks_fetch_failed_check_cookie_or_url");
  if (mb?.enabled && !mbError && mbRawFetched > 0 && mbInRadius === 0)
    flags.push("magicbricks_listings_outside_radius");
  if (portalErrCt > 0) flags.push("some_portal_feeds_failed_check_url_cookie");
  if (input.age_bucket === "old") flags.push("older_asset_depreciation");
  if (input.legal?.title_clarity === "uncertain")
    flags.push("title_clarity_uncertain");

  if (input.property_type === "residential" && input.size_sqft > 8500) {
    flags.push("size_sanity_extreme_for_residential");
    confidence = clamp(confidence - 0.08, 0.2, 0.9);
  }

  const ppsfList = comps.within_radius.map((x) => x.price_inr / x.area_sqft);
  const medPpsf = medianSorted(ppsfList);
  if (medPpsf != null && modelPsf > medPpsf * 1.45) {
    flags.push("model_rate_above_local_listing_median");
  }

  const out: EstimateResponse = {
    market_value_range: [marketMin, marketMax],
    distress_value_range: [distressMin, distressMax],
    resale_potential_index: resale,
    estimated_time_to_sell_days: [Math.min(tLow, tHigh), Math.max(tLow, tHigh)],
    confidence_score: Math.round(confidence * 100) / 100,
    key_drivers: drivers.length ? drivers : ["rule_based_baseline"],
    risk_flags: flags.length ? flags : ["none_noted"],
    comps_used_count: comps.count,
    comp_radius_km: compRadius,
    data_sources: sources,
    assumptions_version: file.assumptions_version,
    infrastructure_proximity_index: infraIdx,
    neighbourhood_quality_score: neighScore,
    resolved_location: {
      lat,
      lon,
      display_name: displayName,
      matched_city_id: matchedCityId,
      circle_rate_source: circleSource,
    },
    landmark_signals: amenity.labels.length ? amenity.labels : undefined,
    comps_breakdown: {
      seed_in_radius: seedInRadius,
      magicbricks_in_radius: mbInRadius,
      magicbricks_raw_fetched: mb?.enabled ? mbRawFetched : undefined,
      acres99_in_radius: acres99InRadius || undefined,
      housing_in_radius: housingInRadius || undefined,
      nobroker_in_radius: nobrokerInRadius || undefined,
      portals_raw_fetched:
        Object.keys(portalRaw).length > 0 ? portalRaw : undefined,
    },
  };

  if (mb?.enabled && mbError) out.magicbricks_error = mbError;
  if (Object.keys(portalErrors).length > 0)
    out.portal_feed_errors = portalErrors;

  return out;
}
