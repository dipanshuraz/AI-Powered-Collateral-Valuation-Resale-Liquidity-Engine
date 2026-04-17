/** Client-side form state for the estimate wizard (strings for inputs). */
export type EstimateFormState = {
  address: string;
  lat: string;
  lon: string;
  cityTier: string;
  compRadius: string;
  propertyType: string;
  subType: string;
  sizeSqft: string;
  ageBucket: string;
  floor: string;
  hasLift: boolean;
  titleClarity: string;
  tenure: string;
  occupancy: string;
  yieldPct: string;
  mbEnabled: boolean;
  mbCityId: string;
  mbLocalityId: string;
  mbSearchUrl: string;
  feed99Enabled: boolean;
  feed99Url: string;
  housingFeedEnabled: boolean;
  housingFeedUrl: string;
  nobrokerFeedEnabled: boolean;
  nobrokerFeedUrl: string;
  locationNotes: string;
  legalNotes: string;
  docsSummary: string;
  /** PNG data URL from optional review-step signature pad (client-only; not sent to API). */
  acknowledgmentSignatureDataUrl: string;
};

export type EstimateResponsePayload = {
  market_value_range: [number, number];
  distress_value_range: [number, number];
  resale_potential_index: number;
  estimated_time_to_sell_days: [number, number];
  confidence_score: number;
  key_drivers: string[];
  risk_flags: string[];
  comps_used_count: number;
  comp_radius_km: number;
  data_sources: string[];
  assumptions_version: string;
  resolved_location?: Record<string, unknown>;
  magicbricks_error?: string;
  landmark_signals?: string[];
  comps_breakdown?: {
    seed_in_radius: number;
    magicbricks_in_radius: number;
    magicbricks_raw_fetched?: number;
    acres99_in_radius?: number;
    housing_in_radius?: number;
    nobroker_in_radius?: number;
    portals_raw_fetched?: Record<string, number>;
  };
  portal_feed_errors?: Record<string, string>;
};
