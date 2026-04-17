import type { CompListing } from "@/lib/comps/query";
import type { PortalListingSource } from "@/lib/portals/listing-source";

function num(x: unknown): number | null {
  if (typeof x === "number" && !Number.isNaN(x)) return x;
  if (typeof x === "string") {
    const n = parseFloat(x.replace(/,/g, "").replace(/[^\d.-]/g, ""));
    if (!Number.isNaN(n)) return n;
  }
  return null;
}

function pickPrice(o: Record<string, unknown>): number | null {
  const keys = [
    "price",
    "amount",
    "totalPrice",
    "listingPrice",
    "property_price",
    "minPrice",
    "value",
    "expectedPrice",
    "listPrice",
  ];
  for (const k of keys) {
    const v = num(o[k]);
    if (v != null && v > 10000) return v;
  }
  return null;
}

function pickAreaSqft(o: Record<string, unknown>): number | null {
  const keys = [
    "carpetArea",
    "carpet_area",
    "builtUpArea",
    "built_up_area",
    "superBuiltUpArea",
    "super_area",
    "area",
    "sqft",
    "size_sqft",
    "areaSqft",
    "squareFeet",
  ];
  for (const k of keys) {
    const v = num(o[k]);
    if (v != null && v > 50 && v < 1000000) return v;
  }
  return null;
}

function pickLatLon(o: Record<string, unknown>): { lat: number; lon: number } | null {
  const flatLat = num(o.latitude ?? o.lat ?? o.pmtLat);
  const flatLon = num(o.longitude ?? o.lng ?? o.lon ?? o.pmtLong);
  if (flatLat != null && flatLon != null) return { lat: flatLat, lon: flatLon };

  const geo = o.geo ?? o.location ?? o.coordinates ?? o.map;
  if (geo && typeof geo === "object") {
    const g = geo as Record<string, unknown>;
    const la = num(g.latitude ?? g.lat ?? g.Latitude);
    const lo = num(g.longitude ?? g.lng ?? g.lon ?? g.Longitude);
    if (la != null && lo != null) return { lat: la, lon: lo };
  }

  const s =
    typeof o.ltcoordGeo === "string"
      ? o.ltcoordGeo
      : typeof o.geoLocation === "string"
        ? o.geoLocation
        : typeof o.latLong === "string"
          ? o.latLong
          : null;
  if (s?.includes(",")) {
    const [a, b] = s.split(",").map((x) => parseFloat(x.trim()));
    if (!Number.isNaN(a) && !Number.isNaN(b)) return { lat: a, lon: b };
  }

  return null;
}

function pickCity(o: Record<string, unknown>): string {
  const v =
    o.ctName ?? o.cityName ?? o.city ?? o.localityName ?? o.locality ?? o.name;
  return typeof v === "string" ? v : "—";
}

/**
 * Best-effort map of one JSON object → CompListing (for 99acres / Housing / NoBroker / unknown APIs).
 */
export function normalizeJsonObjectToListing(
  o: Record<string, unknown>,
  provider: PortalListingSource,
  index: number
): CompListing | null {
  const ll = pickLatLon(o);
  if (!ll) return null;
  const price = pickPrice(o);
  const area = pickAreaSqft(o);
  if (price == null || area == null || area <= 0) return null;

  const idRaw =
    o.id ?? o.listingId ?? o.propertyId ?? o.propId ?? o.uuid ?? index;
  const id = `${provider}-${String(idRaw)}`;

  return {
    id,
    lat: ll.lat,
    lon: ll.lon,
    city: pickCity(o),
    price_inr: price,
    area_sqft: area,
    property_sub_type: "apartment",
    source:
      provider === "seed"
        ? "seed"
        : (provider as CompListing["source"]),
  };
}

function isListingLike(o: unknown): o is Record<string, unknown> {
  if (!o || typeof o !== "object") return false;
  const r = o as Record<string, unknown>;
  return (
    pickPrice(r) != null &&
    pickLatLon(r) != null &&
    pickAreaSqft(r) != null
  );
}

/** Recursively find arrays that look like listing collections. */
export function findListingObjectArrays(
  node: unknown,
  depth = 0,
  out: Record<string, unknown>[][] = []
): Record<string, unknown>[][] {
  if (depth > 10 || node == null) return out;
  if (Array.isArray(node)) {
    if (
      node.length >= 1 &&
      node.every((x) => x && typeof x === "object") &&
      node.some((x) => isListingLike(x))
    ) {
      out.push(node as Record<string, unknown>[]);
    }
    return out;
  }
  if (typeof node === "object") {
    for (const v of Object.values(node as object)) {
      findListingObjectArrays(v, depth + 1, out);
    }
  }
  return out;
}

/** Prefer known top-level keys before deep search. */
const PREFERRED_ARRAY_PATHS = [
  ["resultList"],
  ["data", "properties"],
  ["data", "list"],
  ["response", "data"],
  ["props", "pageProps", "listings"],
  ["searchResult", "properties"],
];

export function extractListingsFromJsonPayload(
  payload: unknown,
  provider: PortalListingSource
): { listings: CompListing[]; strategy: string } {
  if (!payload || typeof payload !== "object") {
    return { listings: [], strategy: "empty" };
  }

  const root = payload as Record<string, unknown>;

  for (const path of PREFERRED_ARRAY_PATHS) {
    let cur: unknown = root;
    for (const p of path) {
      if (cur && typeof cur === "object" && p in (cur as object))
        cur = (cur as Record<string, unknown>)[p];
      else {
        cur = null;
        break;
      }
    }
    if (Array.isArray(cur) && cur.length && cur.some((x) => isListingLike(x))) {
      const listings = (cur as Record<string, unknown>[])
        .map((row, i) => normalizeJsonObjectToListing(row, provider, i))
        .filter((x): x is CompListing => x != null);
      return { listings, strategy: `path:${path.join(".")}` };
    }
  }

  const arrays = findListingObjectArrays(payload);
  const best = arrays.sort((a, b) => b.length - a.length)[0];
  if (!best?.length) return { listings: [], strategy: "deep_search_miss" };

  const listings = best
    .map((row, i) => normalizeJsonObjectToListing(row, provider, i))
    .filter((x): x is CompListing => x != null);
  return { listings, strategy: "deep_search" };
}
