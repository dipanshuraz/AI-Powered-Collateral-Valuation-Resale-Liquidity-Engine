# Tenzor — Collateral Valuation & Resale Liquidity Engine

**At a glance**

| | |
|--|--|
| **What** | Demo **collateral intelligence**: market & distress **ranges**, resale **index**, time-to-sell **range**, **confidence**, **drivers**, **risk flags** (hackathon Problem 4a style). |
| **Stack** | **Next.js 15** (App Router), TypeScript, Tailwind, Zod |
| **Entry** | Landing **`/`** → full wizard **`/estimate`** (4 steps + results) · `POST /api/estimate` |
| **Pricing** | Deterministic rules + `data/circle_rates.json` + comps in **Haversine radius** |
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
- **UI** — minimalist form; **free map** on Location step (**Leaflet** + OpenStreetMap, optional Esri aerial layer) with pin + server **Nominatim** reverse geocode; **Pune-oriented defaults** (Baner lat/lon, 8 km radius) for quick testing.

This is a **demo**, not a licensed appraisal or credit decision system.

---

## How to run the application

### Prerequisites

- **Node.js** — Use a current LTS release (for example **20.x** or **22.x**). Next.js 15 expects a reasonably modern Node; if you see cryptic build errors, upgrade Node first.
- **npm** — Comes with Node (this repo uses `npm`; `pnpm` / `yarn` work if you prefer, but commands below use `npm`).

### 1. Get the code and install dependencies

From the project root (the folder that contains `package.json`):

```bash
cd tenzor
npm install
```

This installs Next.js, React, Tailwind, Ark UI, Leaflet, Zod, `sharp` (for image handling), and TypeScript tooling.

### 2. Environment variables (optional)

The app runs **without** any `.env` file for the default flow (seed comps, circle rates, map, `POST /api/estimate`).

Optional **listing portal** cookies are only needed if you enable MagicBricks / 99acres / Housing / NoBroker fetches in the wizard and want authenticated JSON responses:

```bash
cp .env.example .env.local
```

Edit `.env.local` and uncomment or set variables as needed (see **Environment** below). `.env.local` is git-ignored and loaded automatically by Next.js in development and production.

### 3. Development server (hot reload)

```bash
npm run dev
```

- By default the app listens on **http://localhost:3000**
- If port **3000 is already in use**, Next.js will try the next free port (3001, 3002, …) and print the real URL in the terminal — always use the URL shown there.
- To **force a port** (for example 3001):

  ```bash
  PORT=3001 npm run dev
  ```

  On Windows (cmd): `set PORT=3001 && npm run dev`

**What to open**

| URL | Purpose |
|-----|---------|
| [http://localhost:3000/](http://localhost:3000/) | Landing page |
| [http://localhost:3000/estimate](http://localhost:3000/estimate) | Full estimate wizard (location → property → details → review → results) |

Use **Start estimate** / **Begin full flow** on the home page to go to `/estimate`.

### 4. Production build and run

Use this to verify what you would deploy (Vercel runs an equivalent pipeline) or to run locally without dev tooling:

```bash
npm run build
npm run start
```

- `npm run build` — Typecheck, lint, and create an optimized production bundle under `.next/`
- `npm run start` — Serves that build; default URL is still **http://localhost:3000**

Custom port for production:

```bash
PORT=3001 npm run start
```

**If `next start` fails with `EADDRINUSE`**, another process is using that port. Stop that process or choose a different `PORT`.

### 5. Other useful commands

| Command | Purpose |
|---------|---------|
| `npm run lint` | ESLint (Next.js config) |
| `npm run typecheck` | `tsc --noEmit` only |

### 6. Troubleshooting

- **Blank page or “Internal Server Error”** — Check the **terminal where `next dev` or `next start` is running** for the stack trace. After a code change, run `npm run build` to catch type and build errors.
- **Port already in use** — Use `PORT=3001` (or another free port) as above, or free the process on 3000 (e.g. `lsof -i :3000` on macOS/Linux).
- **Map / Leaflet issues** — The location step uses a client-only map. Hard-refresh the page if you see stale map errors during development.

### Quick reference (copy-paste)

```bash
git clone <your-repo-url> && cd tenzor   # if applicable
npm install
npm run dev
# Open http://localhost:3000 (or the URL printed in the terminal)
```

Production check locally:

```bash
npm install
npm run build
npm run start
```

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

Optional blocks: `magicbricks`, `listing_feeds`, `collateral_context`. Response includes `assumptions_version`, `data_sources`, optional `comps_breakdown`, `landmark_signals`, `portal_feed_errors`, `magicbricks_error`.

## Environment

Optional portal cookies — copy [`.env.example`](.env.example) to `.env.local` (see **How to run the application**). Not required for the default demo (seed comps only).

| Variable | Use |
|----------|-----|
| `MAGICBRICKS_COOKIE` | Session cookie for MagicBricks JSON |
| `ACRES99_COOKIE`, `HOUSING_COOKIE`, `NOBROKER_COOKIE` | Per-portal session |
| `LISTING_PORTALS_COOKIE` | Single cookie fallback for portal GETs |

## Deploy (Vercel)

1. Push to Git hosting → import on [Vercel](https://vercel.com).
2. Set env vars as needed (portal cookies are optional).
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
