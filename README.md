# Tenzor — Collateral Valuation & Resale Liquidity Engine

**At a glance**

| | |
|--|--|
| **What** | Demo **collateral intelligence**: market & distress **ranges**, resale **index**, time-to-sell **range**, **confidence**, **drivers**, **risk flags** (hackathon Problem 4a style). |
| **Stack** | **Next.js 15** (App Router), TypeScript, Tailwind, Zod |
| **Entry** | Landing **`/`** → full wizard **`/estimate`** (4 steps + results) · `POST /api/estimate` |
| **Pricing** | **Not** LLM-generated: rules + `data/circle_rates.json` + comps in **Haversine radius** |
| **AI** | **Optional** — explains server JSON only (`lib/ai/explain.ts`); set `OPENAI_API_KEY` |
| **Docs** | **[`docs/PROBLEM-4A-SPECIFICATION-AND-PLAN.md`](docs/PROBLEM-4A-SPECIFICATION-AND-PLAN.md)** (PDF problem → detailed spec & plan) · [`docs/PROJECT-OVERVIEW.md`](docs/PROJECT-OVERVIEW.md) · [`docs/PRD.md`](docs/PRD.md) · [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |

---

## Features (current build)

- **Circle-rate floor** — illustrative city rows in `data/circle_rates.json`; tier fallback if city not matched.
- **Seed comps** — `data/comps_seed.json` (e.g. Pune, NCR, Bengaluru); merged with any live listings.
- **Geocoding** — OpenStreetMap **Nominatim** when `address` is sent without `lat`/`lon`.
- **Listing portals (optional, demo)** — server-side fetch + parse; **respect each site’s Terms of Use**:
  - **MagicBricks** — `magicbricks` (city/locality ids or `search_url`); `MAGICBRICKS_COOKIE` often required.
  - **99acres / Housing.com / NoBroker** — `listing_feeds[]` with `search_url`; cookies: `ACRES99_COOKIE`, `HOUSING_COOKIE`, `NOBROKER_COOKIE`, or `LISTING_PORTALS_COOKIE`.
- **Landmarks (MagicBricks)** — `landmarkDetails` → coarse amenity signal on comps in radius.
- **Collateral context** — optional free text (`location_notes`, `legal_rera_notes`, `documents_summary`) for light keyword drivers only.
- **UI** — minimalist form; **Pune-oriented defaults** (Baner lat/lon, 8 km radius) for quick testing.

This is a **demo**, not a licensed appraisal or credit decision system.

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → **Start estimate** → [http://localhost:3000/estimate](http://localhost:3000/estimate) for the end-to-end flow.

## API

`POST /api/estimate` — body validated by Zod (`lib/schemas.ts`). Example:

```json
{
  "address": "Baner, Pune, Maharashtra",
  "lat": 18.5596,
  "lon": 73.7868,
  "property_type": "residential",
  "property_sub_type": "apartment",
  "size_sqft": 1200,
  "age_bucket": "mid",
  "comp_radius_km": 8
}
```

Optional blocks: `magicbricks`, `listing_feeds`, `collateral_context`, `include_ai_summary`. Response includes `assumptions_version`, `data_sources`, optional `comps_breakdown`, `landmark_signals`, `portal_feed_errors`, `magicbricks_error`, `ai_summary`.

## Environment

Copy [`.env.example`](.env.example) to `.env.local`.

| Variable | Use |
|----------|-----|
| `OPENAI_API_KEY` | Optional narrative summary of the JSON |
| `OPENAI_MODEL` | Optional; defaults in `lib/ai/explain.ts` |
| `MAGICBRICKS_COOKIE` | Session cookie for MagicBricks JSON |
| `ACRES99_COOKIE`, `HOUSING_COOKIE`, `NOBROKER_COOKIE` | Per-portal session |
| `LISTING_PORTALS_COOKIE` | Single cookie fallback for portal GETs |

## Deploy (Vercel)

1. Push to Git hosting → import on [Vercel](https://vercel.com).
2. Set env vars as needed (AI + portal cookies are optional).
3. Deploy — **Node** runtime for `/api/estimate`.

## Repo layout (high level)

```
app/                 # UI + route handlers
  page.tsx           # Landing
  estimate/page.tsx  # Wizard (provider + steps + results)
  api/estimate/      # POST /api/estimate
components/
  layout/AppShell.tsx
  estimate/          # Wizard, steps, results panel
contexts/
  EstimateFormContext.tsx
lib/
  flow/              # Form types, defaults, build-estimate-body
  engine/run-estimate.ts   # Valuation + liquidity orchestration
  schemas.ts               # Zod
  comps/query.ts           # Haversine + median ₹/sqft
  geo/                     # Nominatim, haversine
  magicbricks/             # MB fetch + landmark heuristics
  portals/                 # Other portals + JSON normalization
  ai/explain.ts            # Optional LLM
data/
  circle_rates.json
  comps_seed.json
docs/
  PROJECT-OVERVIEW.md      # One-page snapshot
  PRD.md
  ARCHITECTURE.md
```

## Assumptions

Engine stamps **`assumptions_version`** from `data/circle_rates.json` for traceability.

## Extending

- Add rows to `data/comps_seed.json` or circle-rate table for new cities.
- For production listings, prefer **licensed** data or **documented** exports; portal automation may conflict with **ToS**.
