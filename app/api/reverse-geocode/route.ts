import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side Nominatim reverse lookup (browser must not call Nominatim directly:
 * User-Agent policy + rate limits). Light use only.
 */
export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");
  if (lat == null || lon == null) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
  }

  const la = Number(lat);
  const lo = Number(lon);
  if (
    !Number.isFinite(la) ||
    !Number.isFinite(lo) ||
    la < -90 ||
    la > 90 ||
    lo < -180 ||
    lo > 180
  ) {
    return NextResponse.json({ error: "invalid coordinates" }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(la));
  url.searchParams.set("lon", String(lo));
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "0");

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "TenzorCollateralEngine/0.1 (demo; reverse-geocode)",
        "Accept-Language": "en",
      },
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "geocoder unavailable" }, { status: 502 });
    }

    const data = (await res.json()) as { display_name?: string };
    const display_name = data.display_name;
    if (!display_name) {
      return NextResponse.json({ error: "no result" }, { status: 404 });
    }

    return NextResponse.json({ display_name });
  } catch {
    return NextResponse.json({ error: "geocoder failed" }, { status: 502 });
  } finally {
    clearTimeout(t);
  }
}
