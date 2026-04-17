# PRD — AI-Powered Collateral Valuation & Resale Liquidity Engine

**Read first:** [`PROBLEM-4A-SPECIFICATION-AND-PLAN.md`](./PROBLEM-4A-SPECIFICATION-AND-PLAN.md) (full PDF-derived spec) · [`PROJECT-OVERVIEW.md`](./PROJECT-OVERVIEW.md) · [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [README](../README.md)

| Field | Value |
|-------|--------|
| **Product** | Demo web app — hackathon Problem **4a** (collateral estimation / portal) |
| **Stack** | Next.js 15, TypeScript, Tailwind, Zod |
| **Status** | Implemented baseline + optional portals + optional AI summary |

---

## 1. Vision

A **data-led** collateral layer: **market and distress ranges**, **resale potential (0–100)**, **time-to-liquidate range**, **confidence**, and **explainable drivers and risk flags**, with optional **geo-radius listing comps** from seed data and/or **listing portal JSON** (demo).

---

## 2. Goals (aligned with rubric)

| ID | Goal | Status |
|----|------|--------|
| G1 | Target JSON outputs (ranges, index, days, confidence, drivers, flags) | Yes |
| G2 | No proprietary transaction DB; circle rates + public/synthetic assumptions | Yes |
| G3 | Deploy easily (Vercel + env) | Yes |
| G4 | Explainable outputs + optional LLM narrative **grounded** in JSON | Yes |
| G5 | Comps within **radius** (km) | Yes |
| G6 | AI **bounded** — explanation only, not primary pricer | Yes |

---

## 3. Non-Goals

- Legal title / lien verification; regulatory sign-off.
- Nationwide complete circle-rate coverage (subset + tier fallback + documented).
- Guaranteed NBFC policy fit.
- Production **unauthenticated** scraping at scale — **ToS** and **legal** review required first.

---

## 4. Personas

1. **Analyst (demo):** needs quick ranges, liquidity, flags.  
2. **Judge / reviewer:** needs deployability, assumptions, honest limitations.

---

## 5. Functional requirements (implemented)

### 5.1 Inputs

**Mandatory (API):** address **or** lat/lon; `property_type`, `property_sub_type`, `size_sqft`, `age_bucket`.

**Optional:** `floor`, `has_lift`, `legal`, `occupancy`, `rental_yield_percent`, `city_tier`, `comp_radius_km`.

**Optional — listing feeds**

- `magicbricks`: `enabled`, `city_id`, `locality_id`, `search_url` (MagicBricks `propertySearch`).
- `listing_feeds`: `{ provider: 99acres | housing | nobroker, enabled, search_url }[]` — paste DevTools JSON URL.

**Optional — collateral dossier (text only)**

- `collateral_context`: `location_notes`, `legal_rera_notes`, `documents_summary` — keyword-style drivers, **not** a second pricing model.

**Optional — AI**

- `include_ai_summary` — requires `OPENAI_API_KEY` on server.

### 5.2 Outputs

Core: `market_value_range`, `distress_value_range`, `resale_potential_index`, `estimated_time_to_sell_days`, `confidence_score`, `key_drivers`, `risk_flags`.

Extended: `data_sources`, `assumptions_version`, `resolved_location`, `comps_breakdown`, `landmark_signals`, `magicbricks_error`, `portal_feed_errors`, `ai_summary`.

### 5.3 Valuation & liquidity

- Circle-rate floor + adjustments + blend with median **₹/sqft** from comps in radius (see `lib/engine/run-estimate.ts`).
- Liquidity: distress discount, resale index, time-to-sell range; landmark amenity proxy when MagicBricks comps carry `landmarkDetails`.

### 5.4 Fraud / sanity (lightweight)

- Extreme residential size flag; model vs listing median mismatch flag; context keyword tags — **not** fraud-proof.

### 5.5 AI

- Post-calculation narrative only (`lib/ai/explain.ts`).
- **Forbidden:** LLM invents new numeric ranges not produced by engine.

### 5.6 Portals

- **Demo / optional**; cookies may be required; **respect each portal’s Terms of Use**.
- Degrade gracefully: seed comps + flags if feeds fail.

---

## 6. UI (current)

- **Minimal** single-column layout: `app/page.tsx`.
- Defaults for **Pune** testing (address / lat / lon / radius).
- **More** section: MagicBricks, 99acres / Housing / NoBroker URLs, collateral text, AI checkbox.

---

## 7. Non-functional

| Area | Target |
|------|--------|
| Latency | Estimate completes without long blocking (portal GETs ~≤12s each) |
| Security | API keys server-only (`OPENAI_*`, `*_COOKIE`) |
| Transparency | Footer disclaimer; `assumptions_version` in response |

---

## 8. Success criteria (hackathon rubric mapping)

| Dimension | Evidence |
|-----------|----------|
| Valuation logic | Circle rate + adjustments + comp blend in code |
| Liquidity | Index, distress, time range in `run-estimate.ts` |
| Feature depth | Radius comps, landmarks, portal sources, context notes |
| Deployability | Vercel + README + `.env.example` |
| Explainability | Drivers/flags + optional JSON-grounded AI summary |

---

## 9. Compliance & ethics

- Outputs are **estimates**, not appraisals.
- Disclose illustrative circle rates, seed comps, and portal demo limitations.
- Portal automation: legal/ToS risk for production — **documented**.

---

## 10. Open / future

- Stronger LLM output validation (numeric grounding).
- Template-based summary when no OpenAI key.
- Per-portal response adapters as real JSON samples are captured.
- Optional CSV upload for comps (stretch).

---

## 11. Out of scope recap

Items we **do not** promise: legal opinions, nationwide official circle-rate coverage, live portal compliance without review, guaranteed liquidation timelines.

**Doc index:** [PROBLEM-4A-SPECIFICATION-AND-PLAN](./PROBLEM-4A-SPECIFICATION-AND-PLAN.md) · [PROJECT-OVERVIEW](./PROJECT-OVERVIEW.md) · [ARCHITECTURE](./ARCHITECTURE.md) · [README](../README.md)
