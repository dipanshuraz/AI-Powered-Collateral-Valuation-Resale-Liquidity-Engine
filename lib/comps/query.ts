import compsSeed from "@/data/comps_seed.json";
import { haversineKm } from "@/lib/geo/haversine";

export type CompListing = {
  id: string;
  lat: number;
  lon: number;
  city: string;
  price_inr: number;
  area_sqft: number;
  property_sub_type: string;
  posted_at?: string;
  source?: "seed" | "magicbricks" | "99acres" | "housing" | "nobroker";
  landmark_details?: string[];
  locality_name?: string;
  project_name?: string;
};

export type CompStats = {
  within_radius: CompListing[];
  median_price_per_sqft: number | null;
  count: number;
};

const listings = (compsSeed as { listings: CompListing[] }).listings;

export function queryCompsInRadius(
  lat: number,
  lon: number,
  radiusKm: number,
  extra: CompListing[] = []
): CompStats {
  const pool = [...listings, ...extra];
  const within: CompListing[] = [];
  const seen = new Set<string>();
  for (const L of pool) {
    const key = `${L.id}|${L.lat}|${L.lon}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const d = haversineKm(lat, lon, L.lat, L.lon);
    if (d <= radiusKm) within.push(L);
  }

  if (within.length === 0) {
    return { within_radius: [], median_price_per_sqft: null, count: 0 };
  }

  const ppsf = within.map((x) => x.price_inr / x.area_sqft).sort((a, b) => a - b);
  const mid = Math.floor(ppsf.length / 2);
  const median =
    ppsf.length % 2 === 0
      ? (ppsf[mid - 1]! + ppsf[mid]!) / 2
      : ppsf[mid]!;

  return {
    within_radius: within,
    median_price_per_sqft: median,
    count: within.length,
  };
}
