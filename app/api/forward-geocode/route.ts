import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side Nominatim forward search (addresses, PIN codes, place names).
 * India-biased via countrycodes=in for typical collateral use; pincode works nationwide.
 */
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("q");
  const q = raw?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ error: "Enter at least 2 characters" }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "in");
  url.searchParams.set("addressdetails", "0");

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "EstimateEngine/0.1 (demo; forward-geocode)",
        "Accept-Language": "en",
      },
      signal: controller.signal,
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Geocoder unavailable" }, { status: 502 });
    }

    const text = await res.text();
    let parsed: unknown;
    try {
      parsed = text.trim() ? JSON.parse(text) : [];
    } catch {
      return NextResponse.json({ error: "Geocoder unavailable" }, { status: 502 });
    }

    const rows = Array.isArray(parsed) ? parsed : [];
    const first = rows[0] as { lat?: string; lon?: string; display_name?: string } | undefined;
    if (!first?.lat || !first?.lon) {
      return NextResponse.json(
        { error: "No match — try a fuller address or a 6-digit PIN code with state" },
        { status: 404 }
      );
    }

    const lat = String(first.lat);
    const lon = String(first.lon);
    return NextResponse.json({
      lat,
      lon,
      display_name: first.display_name ?? q,
    });
  } catch {
    return NextResponse.json({ error: "Geocoder failed" }, { status: 502 });
  } finally {
    clearTimeout(t);
  }
}
