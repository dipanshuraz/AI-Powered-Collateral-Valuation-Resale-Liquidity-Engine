from __future__ import annotations

import logging
import os
from typing import Dict, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, model_validator

from src.pipeline import predict_property

load_dotenv()

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

app = FastAPI(
    title="Real Estate Collateral Valuation & Liquidity Engine",
    version="2.0.0",
    description="Collateral valuation system trained on real Pune property data.",
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PropertyRequest(BaseModel):
    bhk: int = Field(..., ge=1, le=10, example=3)
    sqft: float = Field(..., gt=200, example=1200)
    bathrooms: int = Field(..., ge=1, le=10, example=2)
    lat: Optional[float] = Field(None, ge=18.0, le=19.5, example=18.5530)
    lon: Optional[float] = Field(None, ge=73.0, le=74.5, example=73.9514)
    address: Optional[str] = Field(None, example="Kharadi Pune")
    price_per_sq_ft: float = Field(..., gt=1000, example=11602)
    has_lift: int = Field(..., ge=0, le=1, example=1)
    has_parking: int = Field(..., ge=0, le=1, example=1)
    has_gym: int = Field(..., ge=0, le=1, example=0)
    has_security: int = Field(..., ge=0, le=1, example=1)
    has_power_backup: int = Field(..., ge=0, le=1, example=0)
    has_swimming_pool: int = Field(..., ge=0, le=1, example=0)

    @model_validator(mode="after")
    def validate_location_input(self) -> "PropertyRequest":
        has_latlon = self.lat is not None and self.lon is not None
        has_address = bool(self.address and self.address.strip())

        if not has_latlon and not has_address:
            raise ValueError("Provide either both lat/lon or an address.")
        if (self.lat is None) ^ (self.lon is None):
            raise ValueError("lat and lon must be provided together.")
        return self


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/evaluate")
def evaluate(request: PropertyRequest) -> Dict[str, object]:
    try:
        return predict_property(request.model_dump())
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=500,
            detail="Model artifacts are missing. Run `python -m src.train_system` first.",
        ) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)
