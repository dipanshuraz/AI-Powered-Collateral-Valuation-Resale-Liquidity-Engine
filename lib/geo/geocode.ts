export type GeocodeResult = {
  lat: number;
  lon: number;
  display_name: string;
  city_hint?: string;
};

function pickCityHint(displayName: string): string | undefined {
  const lower = displayName.toLowerCase();
  const parts = lower.split(",").map((s) => s.trim());
  return parts[0] || undefined;
}

export async function geocodeAddress(
  address: string
): Promise<GeocodeResult | null> {
  const q = encodeURIComponent(address.trim());
  if (!q) return null;

  const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "EstimateEngine/0.1 (demo; contact: local)",
      },
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
    }>;

    if (!data?.length) return null;

    const hit = data[0];
    const lat = parseFloat(hit.lat);
    const lon = parseFloat(hit.lon);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;

    return {
      lat,
      lon,
      display_name: hit.display_name,
      city_hint: pickCityHint(hit.display_name),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}
