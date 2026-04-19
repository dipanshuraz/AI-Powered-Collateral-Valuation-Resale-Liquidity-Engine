import type { EstimateRequest } from "@/lib/schemas";

/** Map six 1–5 proximity ratings to a 0–100 index (5 = best access). */
export function infrastructureProximityIndex(
  p: NonNullable<EstimateRequest["infrastructure_proximity"]>
): number {
  const vals = [
    p.metro,
    p.rail,
    p.highway,
    p.commercial_hub,
    p.school,
    p.hospital,
  ];
  const avg = vals.reduce((a, b) => a + b, 0) / 6;
  return Math.round(((avg - 1) / 4) * 100);
}

/** Neighbourhood quality 0–100 from land use + planning (PDF framing). */
export function neighbourhoodQualityScore(
  n: NonNullable<EstimateRequest["neighbourhood"]>
): number {
  const landUse: Record<
    NonNullable<EstimateRequest["neighbourhood"]>["land_use"],
    number
  > = {
    residential: 88,
    mixed_use: 58,
    commercial_industrial: 38,
  };
  const planning: Record<
    NonNullable<EstimateRequest["neighbourhood"]>["planning"],
    number
  > = {
    planned: 88,
    mixed: 58,
    unplanned: 38,
  };
  return Math.round((landUse[n.land_use] + planning[n.planning]) / 2);
}
