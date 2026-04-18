# AI Engine Backend

## Overview
This is the backend AI engine for property collateral valuation.

It provides:
- Property price prediction (XGBoost)
- Liquidity estimation
- Location intelligence (Geo APIs)
- SHAP explainability
- LLM-based explanation

---

## Setup

cd backend/ai-engine

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app:app --reload

---

## API Endpoint

POST /evaluate

Base URL:
http://127.0.0.1:8000

---

## Sample Request

{
  "address": "Kharadi Pune",
  "bhk": 3,
  "sqft": 1200,
  "bathrooms": 2,
  "price_per_sq_ft": 11000,
  "has_lift": 1,
  "has_parking": 1,
  "has_gym": 0,
  "has_security": 1,
  "has_power_backup": 0,
  "has_swimming_pool": 0
}

---

## Output

- price_range
- distress_value_range
- resale_index
- location_intelligence
- risk_flags
- value_drivers
- shap_explanation
- llm_explanation