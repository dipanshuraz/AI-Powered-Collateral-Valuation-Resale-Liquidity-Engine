import { z } from "zod";

export const propertyTypeSchema = z.enum([
  "residential",
  "commercial",
  "industrial",
]);

export const propertySubTypeSchema = z.enum([
  "apartment",
  "villa",
  "plot",
  "shop",
  "warehouse",
  "other",
]);

export const ageBucketSchema = z.enum(["new", "mid", "old"]);

export const estimateRequestSchema = z.object({
  address: z.string().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
  city_tier: z.coerce.number().int().min(1).max(3).optional(),
  property_type: propertyTypeSchema,
  property_sub_type: propertySubTypeSchema,
  size_sqft: z.coerce.number().positive(),
  age_bucket: ageBucketSchema,
  floor: z.coerce.number().int().optional(),
  has_lift: z.boolean().optional(),
  legal: z
    .object({
      tenure: z.enum(["freehold", "leasehold"]).optional(),
      title_clarity: z.enum(["clear", "uncertain"]).optional(),
    })
    .optional(),
  occupancy: z.enum(["self_occupied", "rented", "vacant"]).optional(),
  rental_yield_percent: z.coerce.number().min(0).max(30).optional(),
  comp_radius_km: z.coerce.number().min(0.5).max(50).default(5),
  include_ai_summary: z.boolean().optional().default(false),
  /** Optional live comps from MagicBricks `propertySearch` (server-side; may need MAGICBRICKS_COOKIE). */
  magicbricks: z
    .object({
      enabled: z.boolean().optional(),
      city_id: z.string().optional(),
      locality_id: z.string().optional(),
      page: z.coerce.number().int().min(1).max(20).optional(),
      /** Full `propertySearch.html?...` URL from the site (alternative to city_id/locality_id). */
      search_url: z.string().url().optional(),
    })
    .optional(),
  /**
   * Optional JSON search URLs from 99acres / Housing.com / NoBroker (copy from DevTools).
   * Server fetches and heuristically parses listing arrays + lat/lon/price/area.
   */
  listing_feeds: z
    .array(
      z.object({
        provider: z.enum(["99acres", "housing", "nobroker"]),
        enabled: z.boolean().optional(),
        search_url: z.string().url().optional(),
      })
    )
    .optional(),
  /** Free-text collateral dossier — improves flags/drivers heuristics only. */
  collateral_context: z
    .object({
      location_notes: z.string().max(8000).optional(),
      legal_rera_notes: z.string().max(8000).optional(),
      documents_summary: z.string().max(8000).optional(),
    })
    .optional(),
});

export type EstimateRequest = z.infer<typeof estimateRequestSchema>;

export const estimateResponseSchema = z.object({
  market_value_range: z.tuple([z.number(), z.number()]),
  distress_value_range: z.tuple([z.number(), z.number()]),
  resale_potential_index: z.number().min(0).max(100),
  estimated_time_to_sell_days: z.tuple([z.number(), z.number()]),
  confidence_score: z.number().min(0).max(1),
  key_drivers: z.array(z.string()),
  risk_flags: z.array(z.string()),
  comps_used_count: z.number(),
  comp_radius_km: z.number(),
  data_sources: z.array(z.string()),
  assumptions_version: z.string(),
  resolved_location: z
    .object({
      lat: z.number(),
      lon: z.number(),
      display_name: z.string().optional(),
      matched_city_id: z.string().nullable(),
      circle_rate_source: z.enum(["city_table", "tier_fallback", "none"]),
    })
    .optional(),
  ai_summary: z.string().optional(),
  magicbricks_error: z.string().optional(),
  /** Per-provider errors when a listing feed URL was enabled but fetch/parse failed. */
  portal_feed_errors: z.record(z.string()).optional(),
  landmark_signals: z.array(z.string()).optional(),
  comps_breakdown: z
    .object({
      seed_in_radius: z.number(),
      magicbricks_in_radius: z.number(),
      magicbricks_raw_fetched: z.number().optional(),
      acres99_in_radius: z.number().optional(),
      housing_in_radius: z.number().optional(),
      nobroker_in_radius: z.number().optional(),
      portals_raw_fetched: z.record(z.number()).optional(),
    })
    .optional(),
});

export type EstimateResponse = z.infer<typeof estimateResponseSchema>;
