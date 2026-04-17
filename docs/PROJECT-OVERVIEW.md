# Project overview (one glance)

**Tenzor** is a **demo** web app for **Problem 4a**: collateral **valuation & resale liquidity** — range-based **market** and **distress** values, **resale index (0–100)**, **time-to-liquidate (days)**, **confidence**, **drivers**, and **risk flags**. It is **not** a licensed appraisal.

| What | Summary |
|------|---------|
| **Stack** | Next.js 15 (App Router), TypeScript, Tailwind, Zod |
| **Core API** | `POST /api/estimate` — server-only rule-based valuation |
| **Pricing engine** | Circle-rate floor (`data/circle_rates.json`) + rules + blend with **comps in km radius** (Haversine) |
| **Comps** | Seed file `data/comps_seed.json` + optional **live JSON** from listing portals (URLs + cookies; demo / ToS aware) |
| **UI** | Landing **`/`** + wizard **`/estimate`** (steps: Location → Property → Details → Review → Results); Pune-friendly defaults |
| **Docs** | **[`PROBLEM-4A-SPECIFICATION-AND-PLAN.md`](./PROBLEM-4A-SPECIFICATION-AND-PLAN.md)** (PDF → full spec & plan) · [`PRD.md`](./PRD.md) · [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [root `README.md`](../README.md) |

## Flow (30 seconds)

1. User sends **address or lat/lon**, property facts, optional **collateral context** text.
2. Server resolves coordinates (Nominatim if needed), matches **circle rate** (named city or tier fallback).
3. Builds **model band**, merges **listing comps** inside **radius** (median ₹/sqft), applies **liquidity** + **landmark** heuristics where applicable.
4. Returns structured JSON (ranges, RPI, drivers, flags).

## Key paths

| Path | Role |
|------|------|
| `app/page.tsx` | Landing |
| `app/estimate/page.tsx` | Full E2E wizard |
| `components/estimate/*` | Steps + results + progress |
| `contexts/EstimateFormContext.tsx` | Wizard state |
| `lib/flow/build-estimate-body.ts` | Form → API body |
| `app/api/estimate/route.ts` | HTTP API |
| `lib/engine/run-estimate.ts` | Orchestration + valuation + liquidity |
| `lib/schemas.ts` | Request/response Zod schemas |
| `lib/comps/query.ts` | Radius query + merge |
| `lib/magicbricks/` | MagicBricks `propertySearch` fetch + landmark parsing |
| `lib/portals/` | 99acres / Housing / NoBroker URL fetch + JSON heuristics |
| `data/circle_rates.json` | Illustrative circle-rate rows |
| `data/comps_seed.json` | Seed comps (e.g. Pune + NCR + Bengaluru) |

## Environment (see root `.env.example`)

| Variable | Purpose |
|----------|---------|
| `MAGICBRICKS_COOKIE` | Optional session for MagicBricks JSON |
| `ACRES99_COOKIE` / `HOUSING_COOKIE` / `NOBROKER_COOKIE` | Optional per-portal session |
| `LISTING_PORTALS_COOKIE` | Shared fallback cookie for portal GETs |

---

*Last aligned with repo layout: use git history for exact drift after changes.*
