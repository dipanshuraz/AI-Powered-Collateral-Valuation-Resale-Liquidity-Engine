from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor

ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
ARTIFACT_DIR = ROOT_DIR / "artifacts"
DATASET_PATH = DATA_DIR / "clean_pune_data.csv"
TRAINING_SUMMARY_PATH = ARTIFACT_DIR / "training_summary.json"
PRICE_MODEL_PATH = ARTIFACT_DIR / "model_price.pkl"
LIQUIDITY_MODEL_PATH = ARTIFACT_DIR / "model_liquidity.pkl"
METADATA_PATH = ARTIFACT_DIR / "system_metadata.pkl"

FEATURE_COLUMNS = [
    "bhk",
    "sqft",
    "bathrooms",
    "lat",
    "lon",
    "price_per_sq_ft",
    "has_lift",
    "has_parking",
    "has_gym",
    "has_security",
    "has_power_backup",
    "has_swimming_pool",
]
TARGET_COLUMN = "price"
AMENITY_COLUMNS = [
    "has_lift",
    "has_parking",
    "has_gym",
    "has_security",
    "has_power_backup",
    "has_swimming_pool",
]


def load_real_dataset() -> pd.DataFrame:
    df = pd.read_csv(DATASET_PATH)
    missing_columns = [column for column in FEATURE_COLUMNS + [TARGET_COLUMN] if column not in df.columns]
    if missing_columns:
        raise ValueError(f"Dataset is missing required columns: {missing_columns}")

    df = df[FEATURE_COLUMNS + [TARGET_COLUMN]].copy()
    df = df.dropna(subset=FEATURE_COLUMNS + [TARGET_COLUMN]).reset_index(drop=True)
    return df


def split_features_target(df: pd.DataFrame, target_column: str) -> Tuple[pd.DataFrame, pd.Series]:
    X = df[FEATURE_COLUMNS].copy()
    y = df[target_column].copy()
    return X, y


def create_liquidity_target(df: pd.DataFrame) -> pd.Series:
    liquidity_score = df[AMENITY_COLUMNS].sum(axis=1) * 15
    return liquidity_score.clip(lower=0, upper=100)


def build_xgboost_model() -> XGBRegressor:
    return XGBRegressor(
        n_estimators=400,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.9,
        colsample_bytree=0.9,
        reg_alpha=0.05,
        reg_lambda=1.0,
        objective="reg:squarederror",
        random_state=42,
    )


def evaluate_regression(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    mae = float(mean_absolute_error(y_true, y_pred))
    r2 = float(r2_score(y_true, y_pred))
    return {"rmse": round(rmse, 4), "mae": round(mae, 4), "r2": round(r2, 4)}


def train_model(X: pd.DataFrame, y: pd.Series, model_name: str) -> Tuple[Dict[str, object], Dict[str, float]]:
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    imputer = SimpleImputer(strategy="median")
    X_train_t = imputer.fit_transform(X_train)
    X_test_t = imputer.transform(X_test)

    model = build_xgboost_model()
    model.fit(X_train_t, y_train)

    predictions = model.predict(X_test_t)
    metrics = evaluate_regression(y_test.to_numpy(), predictions)

    artifact = {
        "model_name": model_name,
        "feature_columns": FEATURE_COLUMNS,
        "imputer": imputer,
        "model": model,
        "metrics": metrics,
        "mae": float(metrics["mae"]),
        "rmse": float(metrics["rmse"]),
        "r2": float(metrics["r2"]),
        "training_rows": int(len(X_train)),
        "test_rows": int(len(X_test)),
    }
    return artifact, metrics


def build_system_metadata(df: pd.DataFrame) -> Dict[str, object]:
    price_per_sq_ft = df["price_per_sq_ft"]
    return {
        "feature_columns": FEATURE_COLUMNS,
        "price_per_sq_ft_stats": {
            "min": float(price_per_sq_ft.min()),
            "max": float(price_per_sq_ft.max()),
            "q10": float(price_per_sq_ft.quantile(0.10)),
            "q50": float(price_per_sq_ft.quantile(0.50)),
            "q90": float(price_per_sq_ft.quantile(0.90)),
        },
    }


def save_artifact(artifact: Dict[str, object], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(artifact, path)


def main() -> None:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

    df = load_real_dataset()
    X_price, y_price = split_features_target(df, TARGET_COLUMN)
    y_liquidity = create_liquidity_target(df)

    price_artifact, price_metrics = train_model(X_price, y_price, model_name="price_model")
    liquidity_artifact, liquidity_metrics = train_model(X_price, y_liquidity, model_name="liquidity_model")
    metadata = build_system_metadata(df)

    save_artifact(price_artifact, PRICE_MODEL_PATH)
    save_artifact(liquidity_artifact, LIQUIDITY_MODEL_PATH)
    save_artifact(metadata, METADATA_PATH)

    summary = {
        "dataset_path": str(DATASET_PATH),
        "row_count": int(len(df)),
        "feature_columns": FEATURE_COLUMNS,
        "price_model": price_metrics,
        "liquidity_model": liquidity_metrics,
        "saved_models": {
            "model_price": str(PRICE_MODEL_PATH),
            "model_liquidity": str(LIQUIDITY_MODEL_PATH),
        },
    }
    TRAINING_SUMMARY_PATH.write_text(json.dumps(summary, indent=2))
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
