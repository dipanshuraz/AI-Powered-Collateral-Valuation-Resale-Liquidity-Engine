import circleRates from "@/data/circle_rates.json";

export type CircleCityRow = {
  id: string;
  match: string[];
  tier: number;
  circle_rate_inr_per_sqft_floor: number;
  notes?: string;
};

export type CircleRatesFile = {
  assumptions_version: string;
  cities: CircleCityRow[];
  tier_fallback: Record<
    string,
    { circle_rate_inr_per_sqft_floor: number; liquidity_bonus: number }
  >;
};

const file = circleRates as CircleRatesFile;

export function getCircleRatesFile(): CircleRatesFile {
  return file;
}

export function matchCityFromText(
  text: string
): { row: CircleCityRow; source: "city_table" } | null {
  const t = text.toLowerCase();
  for (const row of file.cities) {
    for (const m of row.match) {
      if (t.includes(m)) return { row, source: "city_table" };
    }
  }
  return null;
}

export function getTierFallback(tier: 1 | 2 | 3) {
  const key = String(tier) as "1" | "2" | "3";
  return file.tier_fallback[key] ?? file.tier_fallback["3"];
}
