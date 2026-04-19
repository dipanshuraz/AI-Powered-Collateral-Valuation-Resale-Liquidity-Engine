/** Short help text for result row tooltips (aligned with ResultsExplainer). */
export const RESULT_METRIC_HELP = {
  market_value:
    "A band for an orderly sale under the model: anchored on illustrative circle-rate logic, blended with comparable ₹/sqft where listings exist in your radius, then adjusted for property attributes. The spread reflects model uncertainty — not a listing price or a bank’s approved value.",
  distress_value:
    "A lower band that applies a liquidity discount to the market band — useful for stress scenarios (quick exit). It does not predict an actual auction or buyer bid.",
  resale_index:
    "A 0–100 score summarizing how easily the model expects the asset to resell in context — not a credit score, ESG score, or regulatory metric.",
  time_to_sell:
    "An illustrative calendar window from rule-based liquidity (comps density, resale index, property type). Directional planning only; real time-on-market depends on pricing, marketing, and macro conditions.",
  confidence:
    "An internal 0–1 score for how much evidence this run had: location matched to a city row, enough comps in radius, fewer portal failures. Low confidence often means thin data, not a “bad asset.”",
  comps:
    "Number of comparable listings inside your comp radius. Fewer comps usually mean wider bands and lower confidence. Seed data and optional portal listings are combined where enabled.",
  infra_index:
    "A 0–100 composite from your infrastructure proximity ratings (metro, rail, highway, hub, school, hospital). Higher means better declared access on average.",
  neighbourhood_score:
    "A 0–100 composite from land use (residential vs mixed-use vs industrial) and planning (planned vs unplanned).",
  landmark_signals:
    "Coarse amenity hints when portal comp payloads include landmark metadata; they nudge the model slightly and are not a full GIS study.",
  magicbricks_error:
    "MagicBricks listing fetch or parse failed (e.g. missing cookie, HTML instead of JSON, rate limit). The estimate may still use seed comps and circle-rate logic.",
  portal_error:
    "A portal feed URL was enabled but fetch or parse failed. The engine falls back to other data sources when possible.",
} as const;
