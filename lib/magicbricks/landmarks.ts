/**
 * MagicBricks landmark rows look like "19210|Yashwant Nagar Bus Stop".
 * Leading numeric bucket is used as a coarse POI category (not official API docs — heuristic).
 */
const CODE_HINT: Record<string, string> = {
  "19210": "transit",
  "19201": "retail_commercial",
  "19202": "education",
  "19203": "healthcare",
  "19206": "leisure_other",
};

export function parseLandmarkCodes(details: string[] | undefined): {
  categories: Set<string>;
  count: number;
} {
  const categories = new Set<string>();
  if (!details?.length) return { categories, count: 0 };
  for (const row of details) {
    const code = row.split("|")[0]?.trim();
    if (!code) continue;
    categories.add(CODE_HINT[code] ?? `bucket_${code}`);
  }
  return { categories, count: details.length };
}

/** Aggregate amenity proxy from comps in radius (0–1 scale). */
export function amenityScoreFromLandmarks(
  comps: { landmark_details?: string[] }[]
): { score: number; labels: string[] } {
  if (!comps.length) return { score: 0, labels: [] };
  const merged = new Set<string>();
  let totalPins = 0;
  for (const c of comps) {
    const { categories, count } = parseLandmarkCodes(c.landmark_details);
    totalPins += count;
    categories.forEach((x) => merged.add(x));
  }
  const diversity = merged.size;
  const density = Math.min(1, totalPins / (comps.length * 8));
  const score = clamp01(diversity / 6 + density * 0.4);
  return { score, labels: Array.from(merged).slice(0, 8) };
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}
