from __future__ import annotations

import os
from typing import Dict, List

from pydantic import BaseModel


class PropertyNarrative(BaseModel):
    risk_summary: str
    investment_potential: str
    liquidity_insight: str
    final_recommendation: str


def build_prompt(
    price_range: List[float],
    distress_range: List[float],
    resale_index: int,
    dist_metro: int,
    dist_hospital: int,
    dist_school: int,
    location_score: int,
    top_positive_features: List[str],
    top_negative_features: List[str],
    risk_flags: List[str],
) -> str:
    return f"""
Analyze this property:

Price range: {price_range}
Distress value range: {distress_range}
Resale index: {resale_index}

Nearby infrastructure:
- Metro distance: {dist_metro} meters
- Hospital distance: {dist_hospital} meters
- School distance: {dist_school} meters
- Location score: {location_score}

Top positive factors: {top_positive_features}
Top negative factors: {top_negative_features}

Risk flags: {risk_flags}

Provide JSON with:
1. risk_summary
2. investment_potential
3. liquidity_insight
4. final_recommendation
""".strip()


def fallback_explanation(
    price_range: List[float],
    distress_range: List[float],
    resale_index: int,
    dist_metro: int,
    dist_hospital: int,
    dist_school: int,
    location_score: int,
    top_positive_features: List[str],
    top_negative_features: List[str],
    risk_flags: List[str],
) -> Dict[str, str]:
    positives = ", ".join(top_positive_features[:3]) if top_positive_features else "balanced core features"
    negatives = ", ".join(top_negative_features[:3]) if top_negative_features else "no major negative SHAP contributors"
    flags = ", ".join(risk_flags) if risk_flags else "no critical deterministic flags"

    if resale_index >= 75:
        liquidity_view = "Liquidity looks strong and the property should be easier to exit than the average listing."
        recommendation = "Suitable for collateral use with a relatively favorable resale profile."
    elif resale_index >= 50:
        liquidity_view = "Liquidity looks moderate, so disposal should be feasible but still pricing-sensitive."
        recommendation = "Usable as collateral, but the lender should remain disciplined on valuation buffers."
    else:
        liquidity_view = "Liquidity looks weak, so exit timing may stretch and recovery risk is higher."
        recommendation = "Use caution as collateral unless additional margin of safety is applied."

    return {
        "risk_summary": (
            f"Key risks are driven by {negatives}. Deterministic flags observed: {flags}. "
            f"Estimated distress realization is between INR {distress_range[0]:,.0f} and INR {distress_range[1]:,.0f}."
        ),
        "investment_potential": (
            f"Value upside is primarily supported by {positives}. "
            f"Nearby infrastructure is metro {dist_metro}m, hospital {dist_hospital}m, school {dist_school}m, "
            f"with a location score of {location_score}/100. "
            f"The estimated market band is INR {price_range[0]:,.0f} to INR {price_range[1]:,.0f}."
        ),
        "liquidity_insight": f"{liquidity_view} Nearby infrastructure contributes a location score of {location_score}/100.",
        "final_recommendation": recommendation,
    }


def generate_explanation(
    price_range: List[float],
    distress_range: List[float],
    resale_index: int,
    dist_metro: int,
    dist_hospital: int,
    dist_school: int,
    location_score: int,
    top_positive_features: List[str],
    top_negative_features: List[str],
    risk_flags: List[str],
) -> Dict[str, str]:
    provider = os.getenv("LLM_PROVIDER", "mock").lower()
    api_key = os.getenv("OPENAI_API_KEY")

    if provider == "openai" and api_key:
        try:
            from openai import OpenAI

            client = OpenAI(api_key=api_key)
            prompt = build_prompt(
                price_range=price_range,
                distress_range=distress_range,
                resale_index=resale_index,
                dist_metro=dist_metro,
                dist_hospital=dist_hospital,
                dist_school=dist_school,
                location_score=location_score,
                top_positive_features=top_positive_features,
                top_negative_features=top_negative_features,
                risk_flags=risk_flags,
            )
            response = client.responses.parse(
                model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                input=[
                    {"role": "system", "content": "You are a real-estate collateral analyst. Return JSON only."},
                    {"role": "user", "content": prompt},
                ],
                text_format=PropertyNarrative,
            )
            return response.output_parsed.model_dump()
        except Exception:
            pass

    return fallback_explanation(
        price_range=price_range,
        distress_range=distress_range,
        resale_index=resale_index,
        dist_metro=dist_metro,
        dist_hospital=dist_hospital,
        dist_school=dist_school,
        location_score=location_score,
        top_positive_features=top_positive_features,
        top_negative_features=top_negative_features,
        risk_flags=risk_flags,
    )
