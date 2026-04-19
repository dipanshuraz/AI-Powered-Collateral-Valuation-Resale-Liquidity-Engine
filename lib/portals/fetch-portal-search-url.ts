import type { PortalListingSource } from "@/lib/portals/listing-source";
import { cookieForPortal } from "@/lib/portals/listing-source";
import { extractListingsFromJsonPayload } from "@/lib/portals/normalize-json-listing";
import type { CompListing } from "@/lib/comps/query";

export type PortalFetchResult = {
  listings: CompListing[];
  rawCount: number;
  error?: string;
  parseStrategy?: string;
};

/**
 * GET a search URL (from DevTools → copy as cURL) for 99acres / Housing / NoBroker.
 * Responses vary; we JSON-parse and heuristically extract listing arrays.
 * Cookie: provider-specific env or LISTING_PORTALS_COOKIE.
 */
export async function fetchPortalSearchUrl(
  provider: Exclude<PortalListingSource, "seed" | "magicbricks">,
  searchUrl: string
): Promise<PortalFetchResult> {
  const cookie = cookieForPortal(provider);
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000);

  try {
    const u = new URL(searchUrl);
    const referer = `${u.origin}/`;

    const res = await fetch(searchUrl, {
      method: "GET",
      signal: controller.signal,
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "user-agent":
          "Mozilla/5.0 (compatible; EstimateEngine/1.0; +local)",
        referer,
        ...(cookie ? { cookie } : {}),
      },
      cache: "no-store",
    });

    const text = await res.text();
    if (!res.ok) {
      return { listings: [], rawCount: 0, error: `HTTP ${res.status}` };
    }

    let payload: unknown;
    try {
      payload = JSON.parse(text);
    } catch {
      return {
        listings: [],
        rawCount: 0,
        error: "Not JSON (HTML or blocked — set portal cookie in env).",
      };
    }

    const { listings, strategy } = extractListingsFromJsonPayload(
      payload,
      provider
    );
    const rawCount =
      typeof payload === "object" &&
      payload &&
      "resultList" in (payload as object) &&
      Array.isArray((payload as { resultList?: unknown[] }).resultList)
        ? (payload as { resultList: unknown[] }).resultList.length
        : listings.length;

    return {
      listings,
      rawCount: Math.max(rawCount, listings.length),
      parseStrategy: strategy,
      error:
        listings.length === 0
          ? "No listings parsed (check JSON shape, cookies, or fields)."
          : undefined,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return { listings: [], rawCount: 0, error: msg };
  } finally {
    clearTimeout(t);
  }
}
