import type { CompListing } from "@/lib/comps/query";
import type { MbResultItem, MbSearchResponse } from "@/lib/magicbricks/types";

const BASE =
  "https://www.magicbricks.com/mbsrp/propertySearch.html";

export type FetchMbParams = {
  cityId: string;
  localityId?: string;
  page?: number;
};

function parseLatLon(item: MbResultItem): { lat: number; lon: number } | null {
  if (
    typeof item.pmtLat === "number" &&
    typeof item.pmtLong === "number" &&
    !Number.isNaN(item.pmtLat) &&
    !Number.isNaN(item.pmtLong)
  ) {
    return { lat: item.pmtLat, lon: item.pmtLong };
  }
  const g = item.ltcoordGeo?.trim();
  if (!g) return null;
  const [a, b] = g.split(",").map((x) => parseFloat(x.trim()));
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return { lat: a, lon: b };
}

function toListing(item: MbResultItem): CompListing | null {
  const ll = parseLatLon(item);
  if (!ll) return null;
  const area = parseFloat(String(item.carpetArea ?? "").replace(/,/g, ""));
  const price = item.price;
  if (!price || !area || area <= 0) return null;
  const id = `mb-${item.id ?? `${ll.lat},${ll.lon}`}`;
  return {
    id,
    lat: ll.lat,
    lon: ll.lon,
    city: item.ctName ?? "—",
    price_inr: price,
    area_sqft: area,
    property_sub_type: "apartment",
    source: "magicbricks" as const,
    landmark_details: item.landmarkDetails,
    locality_name: item.lmtDName,
    project_name: item.prjname,
  };
}

/**
 * Fetches listing JSON from MagicBricks `propertySearch` (same-origin style request).
 * Often requires a **browser session cookie** — set `MAGICBRICKS_COOKIE` in env for server.
 * May fail (403, HTML, ToS). Demo use only; respect MagicBricks terms.
 */
export async function fetchMagicBricksListings(
  params: FetchMbParams
): Promise<{ listings: CompListing[]; rawCount: number; error?: string }> {
  const page = params.page ?? 1;
  const q = new URLSearchParams({
    editSearch: "Y",
    category: "S",
    propertyType: "10002,10003,10021,10022,10001,10017",
    bedrooms: "11701,11702",
    city: params.cityId,
    page: String(page),
    groupstart: "0",
    offset: "0",
    maxOffset: "500",
    sortBy: "premiumRecent",
    postedSince: "-1",
    pType: "10002,10003,10021,10022,10001,10017",
    isNRI: "N",
    multiLang: "en",
  });
  if (params.localityId) q.set("localityName", params.localityId);

  const url = `${BASE}?${q.toString()}`;
  const cookie = process.env.MAGICBRICKS_COOKIE?.trim();

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "user-agent":
          "Mozilla/5.0 (compatible; EstimateEngine/1.0; +local)",
        referer: `https://www.magicbricks.com/property-for-sale/residential-real-estate?cityName=${params.cityId}`,
        ...(cookie ? { cookie } : {}),
      },
      cache: "no-store",
    });

    const text = await res.text();
    if (!res.ok) {
      return {
        listings: [],
        rawCount: 0,
        error: `HTTP ${res.status}`,
      };
    }

    let data: MbSearchResponse;
    try {
      data = JSON.parse(text) as MbSearchResponse;
    } catch {
      return {
        listings: [],
        rawCount: 0,
        error: "Response was not JSON (need session cookie or blocked).",
      };
    }

    const list = data.resultList;
    if (!Array.isArray(list)) {
      return { listings: [], rawCount: 0, error: "No resultList in response." };
    }

    const out: CompListing[] = [];
    for (const item of list) {
      const row = toListing(item);
      if (row) out.push(row);
    }

    return { listings: out, rawCount: list.length };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return { listings: [], rawCount: 0, error: msg };
  } finally {
    clearTimeout(t);
  }
}

/** Same parser as above but for a full search URL (copied from browser). */
export async function fetchMagicBricksFromSearchUrl(
  searchUrl: string
): Promise<{ listings: CompListing[]; rawCount: number; error?: string }> {
  const cookie = process.env.MAGICBRICKS_COOKIE?.trim();
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(searchUrl, {
      method: "GET",
      signal: controller.signal,
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "user-agent":
          "Mozilla/5.0 (compatible; EstimateEngine/1.0; +local)",
        referer: "https://www.magicbricks.com/",
        ...(cookie ? { cookie } : {}),
      },
      cache: "no-store",
    });

    const text = await res.text();
    if (!res.ok) {
      return { listings: [], rawCount: 0, error: `HTTP ${res.status}` };
    }

    let data: MbSearchResponse;
    try {
      data = JSON.parse(text) as MbSearchResponse;
    } catch {
      return {
        listings: [],
        rawCount: 0,
        error: "Response was not JSON (session cookie may be required).",
      };
    }

    const list = data.resultList;
    if (!Array.isArray(list)) {
      return { listings: [], rawCount: 0, error: "No resultList in response." };
    }

    const out: CompListing[] = [];
    for (const item of list) {
      const row = toListing(item);
      if (row) out.push(row);
    }
    return { listings: out, rawCount: list.length };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return { listings: [], rawCount: 0, error: msg };
  } finally {
    clearTimeout(t);
  }
}
