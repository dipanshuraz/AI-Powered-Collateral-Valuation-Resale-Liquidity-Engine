# TODO — Problem 4a PDF vs current build

Working checklist from **Problem Statement 4 — option (a)** (`Problem Statement - Ai powered estimation chatbot-1-13.pdf`) and internal mapping in [`PROBLEM-4A-SPECIFICATION-AND-PLAN.md`](./PROBLEM-4A-SPECIFICATION-AND-PLAN.md). Use this to prioritize backlog items **one at a time**.

**Legend:** ✅ done · 🟡 partial · ⬜ missing

---

## A. Product framing (PDF narrative)

| # | Item | Status | Notes |
|---|------|--------|--------|
| A1 | **“Portal / Chatbot”** experience (parent problem title) | ⬜ | PDF allows option (a) without chatbot; a **conversational or guided** UI is still on-brand for the parent “chatbot” wording. |
| A2 | **“Bloomberg Terminal for collateral”** — unified price + risk + liquidity view | 🟡 | Wizard + results exist; not a dense multi-panel **terminal** layout. |
| A3 | Positioning as **LAP / underwriting / API** evolution story | 🟡 | README/docs touch this; no separate product story page. |

---

## B. Required API outputs (7 groups)

| # | Output | Status | Gap / next step |
|---|--------|--------|-------------------|
| B1 | Market value **₹ range** | ✅ | — |
| B2 | Distress sale value **₹ range** | ✅ | — |
| B3 | Resale potential index **0–100** | ✅ | — |
| B4 | Time to liquidate **days range** | ✅ | — |
| B5 | Confidence **0–1** | ✅ | — |
| B6 | **Key value drivers** (list) | 🟡 | Returned by API; **removed from main results UI** — restore a readable section or PDF-style summary if judges expect “explainability” in the demo. |
| B7 | **Risk flags** (list) | 🟡 | Same as B6. |

---

## C. Location intelligence

| # | Item | Status | Notes |
|---|------|--------|--------|
| C1 | Address **and/or** lat-long | ✅ | Map + Nominatim + manual fields. |
| C2 | **Photos** (exterior / interior) optional | ⬜ | PDF “bonus”; not in form or engine. |
| C3 | **Circle rate benchmark** | ✅ | `data/circle_rates.json`. |
| C4 | **Market activity proxies** — listings | 🟡 | Seed + optional portal feeds. |
| C5 | **Broker density** | ⬜ | Not modeled (PDF mentions as signal). |
| C6 | **Transaction** indicators | ⬜ | No proprietary transactions per constraint; optional public signals not fully there. |
| C7 | **Infrastructure proximity index** (metro, highway, schools, hospitals, hubs) | 🟡 | MagicBricks `landmarkDetails` heuristic only; **no OSM / distance matrix**. |
| C8 | **Neighbourhood quality score** (planned vs mixed-use, etc.) | 🟡 | Tier/city fallbacks; **no full neighbourhood table**. |

---

## D. Property characteristics

| # | Item | Status | Notes |
|---|------|--------|--------|
| D1 | Property type residential / commercial / industrial | ✅ | |
| D2 | Sub-types (apartment, villa, plot, shop, warehouse) | ✅ | |
| D3 | **Carpet vs built-up** vs single “size” | ⬜ | Only **sqft** today; PDF distinguishes carpet/built-up/land. |
| D4 | Vintage bands | ✅ | new / mid / old. |
| D5 | Floor + lift / accessibility | 🟡 | In **Advanced** step; optional. |

---

## E. Legal, income, market dynamics

| # | Item | Status | Notes |
|---|------|--------|--------|
| E1 | Freehold vs leasehold, title clarity | ✅ | Optional fields. |
| E2 | Occupancy, rental yield | ✅ | Optional. |
| E3 | **Supply–demand / absorption** | 🟡 | Comp count density; **no absorption time series**. |
| E4 | **Local price momentum** | ⬜ | Stub/future unless repeatable feeds. |
| E5 | **Asset fungibility** (standard vs niche) | 🟡 | Sub-type multipliers; could deepen. |

---

## F. Fraud & safeguards (PDF)

| # | Item | Status | Notes |
|---|------|--------|--------|
| F1 | **Overstated size** — sanity vs locality | 🟡 | `size_sanity_extreme_for_residential` and related; can add **BHK vs sqft** plausibility. |
| F2 | **Incorrect location tagging** | 🟡 | Geocode vs city; strengthen **location–property mismatch** flags. |
| F3 | **Property type misclassification** | 🟡 | **Configuration plausibility** checks can expand. |

---

## G. Non-functional / submission

| # | Item | Status | Notes |
|---|------|--------|--------|
| G1 | **Evaluation rubric** alignment (logic 25%, liquidity 25%, depth 20%, deploy 15%, explain 15%) | 🟡 | Explainability suffers if drivers/flags hidden from UI. |
| G2 | **Constraints** — no proprietary tx DB; circle rates + public listings + synthetic documented | ✅ | `assumptions_version`, seed comps. |
| G3 | **Deploy** — single app + API | ✅ | Next.js + `POST /api/estimate`. |

---

## Suggested order (one-by-one)

Pick from the top of each block when you want the biggest PDF alignment wins:

1. **B6/B7** — Show **key drivers** and **risk flags** again in results (or a dedicated “Explainability” card).  
2. **C7** — Improve **infra score** (e.g. OSM Overpass for nearest metro/hospital distance) or expand landmark logic.  
3. **C2** — Optional **photo upload** slot (even if engine ignores in v1).  
4. **D3** — **Area type** (carpet / built-up / plot area) + validation.  
5. **C5/C6** — Proxy for **broker density** or richer **listing** stats if data allows.  
6. **C8** — **Neighbourhood quality** table by city/micro-market.  
7. **E3/E4** — **Momentum** or **absorption** only with defensible data.  
8. **F1–F3** — Stronger **fraud** rules and clearer flags.  
9. **A1** — Lightweight **chatbot** or guided Q&A on top of the same API (optional).

---

*Update this file as items ship; keep [`PROBLEM-4A-SPECIFICATION-AND-PLAN.md`](./PROBLEM-4A-SPECIFICATION-AND-PLAN.md) Part J in sync.*
