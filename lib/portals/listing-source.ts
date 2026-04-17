/** Normalized listing origin for comps merge. */
export type PortalListingSource =
  | "seed"
  | "magicbricks"
  | "99acres"
  | "housing"
  | "nobroker";

export const PORTAL_COOKIE_ENV: Record<
  Exclude<PortalListingSource, "seed" | "magicbricks">,
  string[]
> = {
  "99acres": ["ACRES99_COOKIE", "LISTING_PORTALS_COOKIE"],
  housing: ["HOUSING_COOKIE", "LISTING_PORTALS_COOKIE"],
  nobroker: ["NOBROKER_COOKIE", "LISTING_PORTALS_COOKIE"],
};

export function cookieForPortal(
  provider: Exclude<PortalListingSource, "seed" | "magicbricks">
): string | undefined {
  const keys = PORTAL_COOKIE_ENV[provider];
  for (const k of keys) {
    const v = process.env[k]?.trim();
    if (v) return v;
  }
  return undefined;
}
