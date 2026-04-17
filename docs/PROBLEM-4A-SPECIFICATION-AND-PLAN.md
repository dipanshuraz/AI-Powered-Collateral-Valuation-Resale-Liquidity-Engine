# Problem 4a — Full Specification & Delivery Plan

**Source:** Problem Statement 4 — *Estimation Portal*, option **(a)** — **Collateral Valuation & Resale Liquidity Engine**. This repo implements a **transparent rule engine** (tables, comps, documented adjustments).  
**Purpose of this document:** Single detailed reference: problem framing, required outputs, feature framework, modeling rules, inputs/outputs, fraud/safeguards, evaluation rubric, constraints, and how this maps to the **Tenzor** demo implementation — plus **gaps and backlog**.

**Related project docs:** [`PROJECT-OVERVIEW.md`](./PROJECT-OVERVIEW.md) · [`PRD.md`](./PRD.md) · [`ARCHITECTURE.md`](./ARCHITECTURE.md)

---

## Part A — Problem framing (from PDF)

### A.1 Why this matters for lenders

Secured lending against property depends on two questions:

1. **What is the asset worth today?**
2. **How easily can it be liquidated if required?**

**Typical pain in current practice**

| Current approach | Consequence |
|------------------|-------------|
| Manual site inspections | Slow, costly, inconsistent |
| Broker opinions | Subjective, variable |
| Circle rates alone | Often **lag** real market levels |

**Consequences called out in the brief**

- Large **valuation variance**
- **Mispriced risk** and overly **conservative** lending
- **Slower** credit decisions and longer turnaround

### A.2 Core problem statement (verbatim intent)

> Design a **data-led** valuation and liquidity engine that can **consistently estimate** both **asset value** and **resale risk** for property-backed lending.

### A.3 What you are *actually* building (PDF emphasis)

This is **not** “just a pricing model.”

The brief asks for a **market-aware collateral intelligence layer** that combines:

| Pillar | Meaning |
|--------|---------|
| **Intrinsic value** | What the asset **should** sell for in normal conditions |
| **Liquidity** | How **fast** and **reliably** it can be sold |

**Lender reality:** exit **certainty** often matters as much as headline **valuation**.

### A.4 “Bloomberg Terminal” framing (PDF)

End-state vision: a **credit-focused real estate intelligence** view where lenders see **price**, **risk**, and **liquidity** **together**, not in isolated silos — analogous to a “**Bloomberg Terminal for Real Estate Collateral**.”

**Possible product evolution (PDF)**

- Core **underwriting** engine for **LAP** (loan against property) and similar products
- **Real-time valuation API** for fintechs
- India-focused **collateral intelligence** layer

---

## Part B — Required outputs (contract)

The system **must** produce the following. **Ranges** are explicitly required where noted.

| # | Output | Type / notes |
|---|--------|----------------|
| 1 | **Estimated Market Value** | **₹ range** `[min, max]` — not a single point |
| 2 | **Distress Sale Value** | **₹ range** |
| 3 | **Resale Potential Index** | **Integer 0–100** |
| 4 | **Estimated Time to Liquidate** | **Days range** `[min, max]` — not a single number |
| 5 | **Confidence Score** | **Float 0–1** (inclusive) |
| 6 | **Key value drivers** | List (structured codes or short labels) |
| 7 | **Risk flags** | List |

### B.1 Sample JSON (from PDF)

```json
{
  "market_value_range": [9500000, 11500000],
  "distress_value_range": [7500000, 9000000],
  "resale_potential_index": 72,
  "estimated_time_to_sell_days": [45, 90],
  "confidence_score": 0.68,
  "key_drivers": [
    "proximity_to_metro",
    "standard_2bhk_configuration",
    "mid_age_building"
  ],
  "risk_flags": [
    "high_micro_market_competition",
    "moderate_building_age"
  ]
}
```

**Implementation note:** Field names may vary slightly in a given codebase; the **semantic contract** above must be preserved.

---

## Part C — Feature engineering framework (PDF)

The brief organizes signals into **five** areas. Below: **PDF intent**, **data ideas**, and **planning notes** (what to implement vs stub).

### C.1 Location intelligence (primary driver)

**Core inputs**

| Input | Role |
|-------|------|
| Detailed location | **Address** and/or **lat-long** |
| Photos (exterior/interior) | **Optional**; “good to have” |

**Derived signals (PDF)**

| Signal | Role in engine |
|--------|----------------|
| **Circle rate benchmark** | Statutory **floor**; anchor for defensible bands |
| **Market activity proxies** | Nearby **listings**, **broker density**, **transaction** indicators (when available) |
| **Infrastructure proximity index** | Distance to **metro/rail**, **highways**, **commercial hubs**, **schools**, **hospitals** — drives **price** and **resale velocity** |
| **Neighbourhood quality score** | E.g. residential vs mixed-use; planned vs unplanned |

**Planning — phased**

| Phase | Action |
|-------|--------|
| **P0 (demo)** | Geocode → city/zone match → **circle-rate row** + **tier**; optional **listing comps** in radius (median ₹/sqft); **landmark/POI proxy** where portal exposes it (e.g. MagicBricks `landmarkDetails`) |
| **P1** | Integrate **OSM / Places** for metro/highway/school/hospital distances → explicit **infra score** |
| **P2** | **Neighbourhood classification** (census/land-use or manual zoning table by locality) |
| **P3** | **Vision** on photos (condition, luxury) — only with labeled data + governance |

### C.2 Property characteristics

**Core inputs**

| Field | PDF detail |
|-------|------------|
| Property **type** | Residential / Commercial / Industrial |
| **Sub-type** | Apartment, villa, plot, shop, warehouse, … |
| **Size** | Carpet / built-up / land parcel size |
| **Vintage** | New (&lt;5y), Mid (5–15y), Old (&gt;15y) |
| **Floor & accessibility** | Floor level; lifts; ground-floor access |

**Effects PDF calls out**

- Depreciation  
- Buyer demand  
- Usable life  

**Planning**

| Phase | Action |
|-------|--------|
| **P0** | Map sub-type to **fungibility** multipliers (standard 2BHK-style vs niche); age bucket → depreciation; floor+lift penalty if applicable |
| **P1** | BHK explicitly in schema if not present; plausibility rules (BHK vs sqft) |

### C.3 Legal & ownership

**Inputs**

- **Freehold vs leasehold**
- **Clear title vs potential legal complexity** (proxy indicators only in v1)

**Impact (PDF)**

- Direct effect on **resale liquidity**
- Drives **conservative LTV** in underwriting narratives

**Planning**

| Phase | Action |
|-------|--------|
| **P0** | User-declared enums; multipliers on liquidity + distress discount; **flags** when “uncertain” |
| **P1** | No automated legal opinion — optional **document upload** pipeline for human review |

### C.4 Income & usage signals

**Inputs**

- **Occupancy:** self-occupied / rented / vacant  
- **Rental yield proxy** (if applicable)

**Insight (PDF)**

- Healthy **rental yield** → more **investor** interest → often better **resale certainty**

**Planning**

| Phase | Action |
|-------|--------|
| **P0** | Occupancy multiplier; optional yield % → small bump to resale index / liquidity |
| **P1** | Rent roll validation (stretch) |

### C.5 Market dynamics layer

**Derived features (PDF)**

| Feature | Notes |
|---------|--------|
| **Supply–demand balance** | Listing **density** vs **absorption** indicators (where available) |
| **Local price momentum** | Optional |
| **Asset fungibility** | Standard mass-market configs → **higher** liquidity; custom/niche → **lower** |

**Planning**

| Phase | Action |
|-------|--------|
| **P0** | **Listing count / median ₹/sqft** in radius as activity proxy; flags for **thin** market |
| **P1** | Time-on-market or absorption if data exists |
| **P2** | Momentum from **repeated** scraped or licensed series (compliance required) |

---

## Part D — Valuation & liquidity modeling (PDF)

### D.1 Market value estimation

**Market value** is a function of:

- Circle rate benchmark  
- Location premium  
- Property type and size  
- Age and depreciation  
- Infrastructure score  
- Rental yield (if applicable)  

**Output rule:** **value range**, not a point estimate.

**Distress relationship (see D.2):** distress is derived from market value and liquidity, not independent black-box magic.

### D.2 Distress sale value

**Formula intent (PDF)**

> **Distress Value = Market Value × (1 − Liquidity Discount)**  
> (equivalently: apply a **liquidity discount** to market value to produce a lower band)

**Liquidity discount depends on**

- Asset type  
- Location demand  
- Legal clarity  

**Planning**

| Phase | Action |
|-------|--------|
| **P0** | Explicit **discount** computed from tier, age, legal, asset niche, comp thickness; apply to range endpoints consistently |
| **P1** | Separate **distress** range width vs market range if data supports |

### D.3 Resale Potential Index (0–100)

**Consolidated liquidity signal.** PDF lists factors:

| Factor | Direction |
|--------|-----------|
| Prime location | ↑ |
| Standard configuration | ↑ |
| High-demand micro-market | ↑ |
| Older construction | ↓ |
| Legal complexity | ↓ |
| Niche asset profile | ↓ |

**Interpretation bands (PDF)**

| Range | Meaning |
|-------|---------|
| **80–100** | Highly liquid |
| **50–80** | Moderate liquidity |
| **&lt;50** | Illiquid / specialised |

### D.4 Time-to-liquidate

**Intent**

> Time to Sell = **f**( Resale Index, Property Type, Market Activity Indicators )

**Output rule:** **range** of days, not a single number.

---

## Part E — Inputs (mandatory vs optional)

### E.1 Mandatory

| Field |
|-------|
| Address **or** lat-long |
| Property type and sub-type |
| Size |
| Age (vintage bucket) |

### E.2 Optional

| Field |
|-------|
| Rental details |
| Legal status indicators |
| Property images (**bonus**) |

---

## Part F — Fraud & risk considerations (PDF)

**Common manipulation vectors**

- Overstated **property size**  
- **Incorrect location** tagging  
- **Property type** misclassification  

**Expected safeguards**

| Safeguard | Intent |
|-----------|--------|
| Size **sanity** vs **locality norms** | Catch outliers |
| **Location–property mismatch** flags | Address vs geocode inconsistency |
| **Configuration plausibility** | e.g. BHK vs sqft bands |

**Planning**

| Phase | Action |
|-------|--------|
| **P0** | Rule-based thresholds + **flags**; never claim fraud-proof |
| **P1** | Cross-check with listing comps median sqft for micro-market |

---

## Part G — Evaluation criteria (PDF rubric)

| Dimension | Weight | What judges likely look for |
|-----------|--------|-----------------------------|
| **Valuation logic** | **25%** | Clear circle-rate / premium / depreciation / comp blend; **ranges** |
| **Liquidity modeling** | **25%** | Coherent index, distress discount, time-to-sell **range** |
| **Feature depth** | **20%** | Location + property + legal + market layers **represented** |
| **Practical deployability** | **15%** | Runnable, env-based, honest data limits |
| **Explainability** | **15%** | Drivers/flags + clear rationale; **not** a single opaque number |

**Strong solution (PDF quote)**

> Not: “Here is one number with no traceable logic.”  
> Instead: “We designed a **structured** valuation and liquidity **framework** where **location** sets the base, **property attributes** adjust value, **market forces** define exit risk, and outputs are **transparent** and **range-based**.”

---

## Part H — Constraints (PDF)

| Constraint | Implication |
|------------|-------------|
| **No proprietary transaction datasets** assumed | Cannot rely on undisclosed bank/NBFC deal databases |
| **Allowed** | **Circle rates**; **public listings** (optional); **reasoned synthetic** assumptions |

**Planning:** Document every **synthetic** or **proxy** assumption in README/spec; stamp **`assumptions_version`** on outputs.

---

## Part I — Delivery plan (phased)

### I.1 P0 — Demo / hackathon minimum (aligned with PDF)

| Item | Deliverable |
|------|-------------|
| Outputs | All 7 output groups (ranges where required) |
| Core engine | Circle-rate floor + adjustments + comp blend + liquidity discount + resale index + time range + confidence |
| Inputs | Mandatory + key optional fields |
| Explainability | `key_drivers`, `risk_flags`, `data_sources` |
| Deploy | Single app (e.g. Next.js) + `/api/estimate` |
| Data | Illustrative circle rates + **seed comps** + optional **public listing** JSON (portal URLs + cookies, ToS-aware) |

### I.2 P1 — Deeper features (PDF depth)

- Explicit **infra score** (OSM / distance to metro, hospital, highway)  
- **Neighbourhood** tier table  
- Stronger **fraud** rules (BHK vs sqft, geocode vs city)  
- **Momentum** stub only if repeatable time series exists  

### I.3 P2 — Future extensions (optional, with governance)

- Statistical calibration on **curated** comps only if ranges + explainability are preserved.
- Any narrative features must remain **grounded** in engine output (no invented ₹).

---

## Part J — Mapping: PDF requirements → Tenzor implementation

This table relates the **PDF** to the **current repo** (see [`ARCHITECTURE.md`](./ARCHITECTURE.md)). Status is indicative.

| PDF area | Implemented in Tenzor? | Notes |
|----------|-------------------------|--------|
| Market / distress **ranges** | Yes | `run-estimate.ts` |
| Resale index 0–100 | Yes | |
| Time to liquidate **range** | Yes | |
| Confidence 0–1 | Yes | |
| Drivers & flags | Yes | Codes + optional user context keywords |
| Circle rate benchmark | Yes | `data/circle_rates.json` |
| Location (address / lat-lon) | Yes | Nominatim + manual coords |
| Market activity proxy | Partial | Listing comps in radius (seed + optional portals) |
| Infra proximity index | Partial / stub | MagicBricks `landmarkDetails` heuristic; no full OSM matrix yet |
| Neighbourhood quality score | Not fully | Could add tier + manual table |
| Property type / sub-type / size / age | Yes | |
| Floor / lift | Yes | Optional |
| Legal freehold/leasehold, title clarity | Yes | Optional |
| Occupancy / rental yield | Yes | Optional |
| Supply/demand / momentum | Partial | Density via comp count; momentum optional future |
| Fungibility (standard vs niche) | Partial | Sub-type multipliers |
| Photos | Not used | Bonus in PDF — future vision pipeline |
| Fraud safeguards | Partial | Size extreme flag; model vs median flag; keyword context |
| Narrative add-ons | Not in core app | Engine outputs are self-explanatory via drivers/flags |
| No proprietary transactions | Respected | Seed + public listing JSON only |

**Gaps to highlight in demos**

- **Infra** and **neighbourhood quality** are not yet full GIS-grade.  
- **Photos** not in scope for v1.  
- **Momentum** and **absorption** need sustained data feeds + compliance.

---

## Part K — Document control

| Version | Change |
|---------|--------|
| 1.0 | Initial detailed spec + plan from Problem 4a PDF; aligned with Tenzor docs |

**Maintainer note:** When the product changes, update **Part J** and bump version.

---

*End of document.*
