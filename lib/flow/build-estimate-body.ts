import type { CollateralUploads, EstimateFormState } from "@/lib/flow/types";

function parseInfra1to5(s: string): number {
  const n = Number(s);
  if (Number.isNaN(n) || n < 1 || n > 5) return 3;
  return Math.round(n);
}

/** Build `POST /api/estimate` JSON body from wizard form state. */
export function buildEstimateBody(
  s: EstimateFormState,
  uploads?: CollateralUploads
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    property_type: s.propertyType,
    property_sub_type: s.subType,
    size_sqft: Number(s.sizeSqft),
    age_bucket: s.ageBucket,
    comp_radius_km: Number(s.compRadius) || 8,
    infrastructure_proximity: {
      metro: parseInfra1to5(s.infraMetro),
      rail: parseInfra1to5(s.infraRail),
      highway: parseInfra1to5(s.infraHighway),
      commercial_hub: parseInfra1to5(s.infraCommercialHub),
      school: parseInfra1to5(s.infraSchool),
      hospital: parseInfra1to5(s.infraHospital),
    },
    neighbourhood: {
      land_use: s.neighbourhoodLandUse,
      planning: s.neighbourhoodPlanning,
    },
  };

  if (uploads) {
    body.collateral_uploads_meta = {
      paper_count: uploads.papers.length,
      internal_photo_count: uploads.photosInternal.length,
      external_photo_count: uploads.photosExternal.length,
    };
  }

  if (s.address.trim()) body.address = s.address.trim();
  const lt = s.lat.trim() ? Number(s.lat) : undefined;
  const ln = s.lon.trim() ? Number(s.lon) : undefined;
  if (lt !== undefined && !Number.isNaN(lt)) body.lat = lt;
  if (ln !== undefined && !Number.isNaN(ln)) body.lon = ln;

  if (s.cityTier.trim()) {
    const t = Number(s.cityTier);
    if (!Number.isNaN(t)) body.city_tier = t;
  }

  if (s.floor.trim()) {
    const f = Number(s.floor);
    if (!Number.isNaN(f)) body.floor = f;
  }
  body.has_lift = s.hasLift;
  body.legal = { tenure: s.tenure, title_clarity: s.titleClarity };
  body.occupancy = s.occupancy;
  if (s.yieldPct.trim()) {
    const y = Number(s.yieldPct);
    if (!Number.isNaN(y)) body.rental_yield_percent = y;
  }

  if (s.mbEnabled) {
    const mb: Record<string, unknown> = { enabled: true };
    if (s.mbSearchUrl.trim()) mb.search_url = s.mbSearchUrl.trim();
    else if (s.mbCityId.trim()) {
      mb.city_id = s.mbCityId.trim();
      if (s.mbLocalityId.trim()) mb.locality_id = s.mbLocalityId.trim();
    }
    body.magicbricks = mb;
  }

  const ctx: Record<string, string> = {};
  if (s.locationNotes.trim()) ctx.location_notes = s.locationNotes.trim();
  if (s.legalNotes.trim()) ctx.legal_rera_notes = s.legalNotes.trim();
  if (s.docsSummary.trim()) ctx.documents_summary = s.docsSummary.trim();
  if (Object.keys(ctx).length) body.collateral_context = ctx;

  const feeds: {
    provider: "99acres" | "housing" | "nobroker";
    enabled: boolean;
    search_url?: string;
  }[] = [];
  if (s.feed99Enabled && s.feed99Url.trim()) {
    feeds.push({
      provider: "99acres",
      enabled: true,
      search_url: s.feed99Url.trim(),
    });
  }
  if (s.housingFeedEnabled && s.housingFeedUrl.trim()) {
    feeds.push({
      provider: "housing",
      enabled: true,
      search_url: s.housingFeedUrl.trim(),
    });
  }
  if (s.nobrokerFeedEnabled && s.nobrokerFeedUrl.trim()) {
    feeds.push({
      provider: "nobroker",
      enabled: true,
      search_url: s.nobrokerFeedUrl.trim(),
    });
  }
  if (feeds.length) body.listing_feeds = feeds;

  return body;
}
