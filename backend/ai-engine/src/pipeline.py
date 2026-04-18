from __future__ import annotations

import logging
from functools import lru_cache
from typing import Dict, List

import joblib
import numpy as np
import pandas as pd
from xgboost import DMatrix

from src.llm_layer import generate_explanation
from src.location_intelligence import location_intelligence
from src.train_system import FEATURE_COLUMNS, METADATA_PATH, PRICE_MODEL_PATH, LIQUIDITY_MODEL_PATH

logger = logging.getLogger(__name__)

try:
    import shap  # type: ignore
except Exception:  # pragma: no cover - optional dependency on Windows/Python builds
    shap = None


@lru_cache(maxsize=1)
def load_price_artifact() -> Dict[str, object]:
    return joblib.load(PRICE_MODEL_PATH)


@lru_cache(maxsize=1)
def load_liquidity_artifact() -> Dict[str, object]:
    return joblib.load(LIQUIDITY_MODEL_PATH)


@lru_cache(maxsize=1)
def load_metadata() -> Dict[str, object]:
    return joblib.load(METADATA_PATH)


def build_input_frame(input_data: Dict[str, object]) -> pd.DataFrame:
    df = pd.DataFrame([input_data])
    return df[FEATURE_COLUMNS].copy()


def transform_features(artifact: Dict[str, object], df: pd.DataFrame) -> np.ndarray:
    imputer = artifact["imputer"]
    return imputer.transform(df[artifact["feature_columns"]])


def predict_with_artifact(artifact: Dict[str, object], df: pd.DataFrame) -> float:
    transformed = transform_features(artifact, df)
    prediction = artifact["model"].predict(transformed)[0]
    return float(prediction)


def adjust_resale_index(raw_liquidity: float, location_score: int) -> float:
    resale_index = float(np.clip(raw_liquidity, 0, 100))
    resale_index = resale_index + (location_score * 0.2)
    return float(np.clip(resale_index, 0, 100))


def compute_price_range(predicted_price: float) -> List[float]:
    return [round(predicted_price * 0.9, 2), round(predicted_price * 1.1, 2)]


def compute_distress_value_range(predicted_price: float) -> List[float]:
    return [round(predicted_price * 0.7, 2), round(predicted_price * 0.85, 2)]


def compute_liquidation_time_days(resale_index: float) -> int:
    if resale_index > 80:
        return 30
    if resale_index > 60:
        return 45
    if resale_index > 40:
        return 60
    return 90


def compute_confidence_score(predicted_price: float, mae: float) -> float:
    confidence = 1 - (mae / max(predicted_price, 1))
    return float(np.clip(confidence, 0.0, 1.0))


def _native_tree_shap_values(model, transformed_sample: np.ndarray, feature_names: List[str]) -> np.ndarray:
    booster = model.get_booster()
    contribs = booster.predict(DMatrix(transformed_sample, feature_names=feature_names), pred_contribs=True)
    return np.asarray(contribs[0][:-1], dtype=float)


def compute_shap_explanation(df: pd.DataFrame) -> Dict[str, object]:
    artifact = load_price_artifact()
    transformed = transform_features(artifact, df)
    feature_names = artifact["feature_columns"]
    model = artifact["model"]

    if shap is not None:
        explainer = shap.TreeExplainer(model)
        explanation = explainer(transformed)
        raw_values = np.asarray(explanation.values[0], dtype=float)
        backend = "shap.TreeExplainer"
    else:
        raw_values = _native_tree_shap_values(model, transformed, feature_names)
        backend = "xgboost.pred_contribs (native TreeSHAP fallback)"

    feature_importance = {feature: round(float(value), 4) for feature, value in zip(feature_names, raw_values)}
    ordered = sorted(feature_importance.items(), key=lambda item: abs(item[1]), reverse=True)
    top_positive = [feature for feature, value in ordered if value > 0][:5]
    top_negative = [feature for feature, value in ordered if value < 0][:5]

    return {
        "backend": backend,
        "feature_importance": feature_importance,
        "top_positive_features": top_positive,
        "top_negative_features": top_negative,
    }


def generate_risk_flags(input_data: Dict[str, object], resale_index: float, confidence_score: float) -> List[str]:
    flags: List[str] = []

    if float(input_data["sqft"]) < 500:
        flags.append("Low area property")
    if int(input_data["has_parking"]) == 0:
        flags.append("No parking")
    if resale_index < 40:
        flags.append("Low resale demand")
    if confidence_score < 0.6:
        flags.append("Low prediction confidence")
    if float(input_data["bathrooms"]) < float(input_data["bhk"]):
        flags.append("Suboptimal layout")

    return flags


def predict_property(input_data: Dict[str, object]) -> Dict[str, object]:
    logger.info("Predicting collateral valuation for property payload")
    geo = location_intelligence(
        lat=input_data.get("lat"),
        lon=input_data.get("lon"),
        address=input_data.get("address"),
    )

    enriched_input = dict(input_data)
    enriched_input["lat"] = geo["lat"]
    enriched_input["lon"] = geo["lon"]

    df = build_input_frame(enriched_input)

    price_artifact = load_price_artifact()
    liquidity_artifact = load_liquidity_artifact()

    predicted_price = predict_with_artifact(price_artifact, df)
    raw_liquidity = predict_with_artifact(liquidity_artifact, df)
    location_score = int(geo["location_score"])
    resale_index = adjust_resale_index(raw_liquidity, location_score)

    price_range = compute_price_range(predicted_price)
    distress_value_range = compute_distress_value_range(predicted_price)
    liquidation_time_days = compute_liquidation_time_days(resale_index)
    confidence_score = compute_confidence_score(predicted_price, price_artifact["mae"])
    shap_explanation = compute_shap_explanation(df)
    risk_flags = generate_risk_flags(input_data, resale_index, confidence_score)

    llm_explanation = generate_explanation(
        price_range=price_range,
        distress_range=distress_value_range,
        resale_index=int(round(resale_index)),
        dist_metro=int(geo["dist_metro"]),
        dist_hospital=int(geo["dist_hospital"]),
        dist_school=int(geo["dist_school"]),
        location_score=location_score,
        top_positive_features=shap_explanation["top_positive_features"],
        top_negative_features=shap_explanation["top_negative_features"],
        risk_flags=risk_flags,
    )

    return {
        "price_range": price_range,
        "distress_value_range": distress_value_range,
        "resale_index": int(round(resale_index)),
        "liquidation_time_days": liquidation_time_days,
        "confidence_score": round(confidence_score, 4),
        "risk_flags": risk_flags,
        "value_drivers": shap_explanation["top_positive_features"],
        "shap_explanation": shap_explanation,
        "llm_explanation": llm_explanation,
        "location_score": location_score,
        "location_intelligence": geo,
        "predicted_price": round(predicted_price, 2),
    }
