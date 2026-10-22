"""
routers/predict.py
------------------
Machine Learning prediction endpoints:
- POST /api/predict/manual: Single employee risk evaluation
- POST /api/predict/batch: CSV dataset bulk prediction and telemetry extraction
"""

import os
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
from database import get_db

router = APIRouter(prefix="/api/predict", tags=["prediction"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "insider_threat_model.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "models", "department_encoder.pkl")

# Feature specification matching model training
FEATURE_COLS = [
    "department_enc",
    "offpeak_logins",
    "failed_logins",
    "file_access_count",
    "sensitive_file_access",
    "usb_usage_count",
    "email_attachment_count",
    "data_download_mb",
    "previous_violations",
    "days_since_last_promotion",
    "is_resigning_soon",
]

_model = None
_encoder = None

def get_model():
    global _model, _encoder
    if _model is None or _encoder is None:
        if not os.path.exists(MODEL_PATH) or not os.path.exists(ENCODER_PATH):
            raise RuntimeError("Model artifacts not found in models/ directory")
        _model = joblib.load(MODEL_PATH)
        _encoder = joblib.load(ENCODER_PATH)
    return _model, _encoder


class ManualPredictRequest(BaseModel):
    employee_id: str = Field(default="EMP_MANUAL", description="Pseudonymous employee reference")
    department: str = Field(..., description="IT, Finance, HR, Sales, R&D, Legal")
    offpeak_logins: int = Field(default=0, ge=0)
    failed_logins: int = Field(default=0, ge=0)
    file_access_count: int = Field(default=25, ge=0)
    sensitive_file_access: int = Field(default=2, ge=0)
    usb_usage_count: int = Field(default=0, ge=0)
    email_attachment_count: int = Field(default=3, ge=0)
    data_download_mb: float = Field(default=50.0, ge=0.0)
    previous_violations: int = Field(default=0, ge=0)
    days_since_last_promotion: int = Field(default=365, ge=0)
    is_resigning_soon: int = Field(default=0, ge=0, le=1)


@router.post("/manual")
def predict_manual(payload: ManualPredictRequest):
    model, encoder = get_model()

    # Validate department category
    dept = payload.department.strip()
    if dept not in encoder.classes_:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported department '{dept}'. Valid options: {list(encoder.classes_)}"
        )

    dept_enc = int(encoder.transform([dept])[0])

    features_dict = {
        "department_enc": dept_enc,
        "offpeak_logins": payload.offpeak_logins,
        "failed_logins": payload.failed_logins,
        "file_access_count": payload.file_access_count,
        "sensitive_file_access": payload.sensitive_file_access,
        "usb_usage_count": payload.usb_usage_count,
        "email_attachment_count": payload.email_attachment_count,
        "data_download_mb": payload.data_download_mb,
        "previous_violations": payload.previous_violations,
        "days_since_last_promotion": payload.days_since_last_promotion,
        "is_resigning_soon": payload.is_resigning_soon,
    }

    df_single = pd.DataFrame([features_dict])[FEATURE_COLS]
    proba = float(model.predict_proba(df_single)[0][1])
    risk_score = round(proba * 100, 2)
    is_threat = proba >= 0.5
    prediction_label = "INSIDER THREAT" if is_threat else "Normal"

    # Determine risk category & SOC priority
    if risk_score >= 65.0:
        risk_category = "High-Priority Review Required"
        review_priority = "High"
    elif risk_score >= 40.0:
        risk_category = "Potentially Suspicious"
        review_priority = "Medium"
    else:
        risk_category = "No Threat Indicated (Normal)"
        review_priority = "Low"

    # Identify top behavioral contributors based on known feature weights
    contributions = []
    if payload.sensitive_file_access >= 4:
        contributions.append(f"Sensitive file access spike ({payload.sensitive_file_access} files)")
    if payload.usb_usage_count >= 2:
        contributions.append(f"Removable media usage ({payload.usb_usage_count} USB connections)")
    if payload.is_resigning_soon == 1:
        contributions.append("Active resignation notice period")
    if payload.data_download_mb >= 200.0:
        contributions.append(f"Substantial outbound download ({payload.data_download_mb:.1f} MB)")
    if payload.previous_violations >= 1:
        contributions.append(f"Prior security violations ({payload.previous_violations} recorded)")
    if payload.offpeak_logins >= 4:
        contributions.append(f"Unusual after-hours logins ({payload.offpeak_logins} sessions)")

    if not contributions:
        contributions.append("Activity metrics align with normal organizational baseline")

    # SOC Recommended Actions
    recommended_actions = []
    if is_threat:
        recommended_actions = [
            "Initiate Tier-2 SOC security analyst review",
            "Cross-reference removable media serial numbers with DLP logs",
            "Review accessed confidential directories with department manager",
            "Place account under temporary enhanced behavioral monitoring"
        ]
    else:
        recommended_actions = [
            "No immediate containment required",
            "Maintain standard access controls and logging"
        ]

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Log to alerts table if flagged as suspicious
    if is_threat or risk_score >= 50.0:
        conn = get_db()
        cursor = conn.cursor()
        alert_id = f"ALT-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        cursor.execute("""
        INSERT INTO alerts (alert_id, employee_id, department, risk_score, prediction, review_priority, status, notes, top_factors, detected_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'Pending Review', '', ?, ?, ?)
        """, (alert_id, payload.employee_id, dept, risk_score, prediction_label, review_priority, ", ".join(contributions), now_str, now_str))
        conn.commit()
        conn.close()

    return {
        "employee_id": payload.employee_id,
        "department": dept,
        "risk_score": risk_score,
        "probability": round(proba, 4),
        "prediction": prediction_label,
        "risk_category": risk_category,
        "review_priority": review_priority,
        "top_contributing_factors": contributions,
        "recommended_actions": recommended_actions,
        "analyzed_at": now_str,
        "model_version": "RandomForest-v1.0-SMOTE",
    }


@router.post("/batch")
async def predict_batch(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files (.csv) are accepted for dataset analysis.")

    model, encoder = get_model()

    try:
        df = pd.read_csv(file.file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")

    # Check required columns
    required_cols = [
        "department",
        "offpeak_logins",
        "failed_logins",
        "file_access_count",
        "sensitive_file_access",
        "usb_usage_count",
        "email_attachment_count",
        "data_download_mb",
        "previous_violations",
        "days_since_last_promotion",
        "is_resigning_soon",
    ]

    missing_cols = [c for c in required_cols if c not in df.columns]
    if missing_cols:
        raise HTTPException(
            status_code=422,
            detail=f"Uploaded dataset missing required columns: {missing_cols}"
        )

    # Fill NaN values safely
    df = df.copy()
    if "employee_id" not in df.columns:
        df["employee_id"] = [f"EMP_{i+1:05d}" for i in range(len(df))]

    # Encode department
    try:
        df["department_enc"] = encoder.transform(df["department"].astype(str).str.strip())
    except ValueError as ve:
        raise HTTPException(
            status_code=400,
            detail=f"Dataset contains unknown departments: {str(ve)}. Permitted: {list(encoder.classes_)}"
        )

    # Run inference
    X_matrix = df[FEATURE_COLS]
    probas = model.predict_proba(X_matrix)[:, 1]
    df["risk_score"] = (probas * 100).round(2)
    df["prediction"] = (probas >= 0.5).map({True: "INSIDER THREAT", False: "Normal"})

    threat_count = int((df["prediction"] == "INSIDER THREAT").sum())
    total_records = len(df)
    threat_rate = round((threat_count / total_records) * 100, 2) if total_records > 0 else 0
    avg_risk = round(float(df["risk_score"].mean()), 2)
    max_risk = round(float(df["risk_score"].max()), 2)

    # Department breakdown
    dept_threats = df[df["prediction"] == "INSIDER THREAT"]["department"].value_counts().to_dict()
    dept_totals = df["department"].value_counts().to_dict()
    dept_stats = [
        {
            "department": d,
            "total": dept_totals.get(d, 0),
            "threats": dept_threats.get(d, 0),
            "rate": round((dept_threats.get(d, 0) / dept_totals.get(d, 1)) * 100, 1)
        }
        for d in encoder.classes_
    ]

    # Score distribution brackets
    score_bins = {
        "0-25% (Low)": int((df["risk_score"] < 25).sum()),
        "25-50% (Moderate)": int(((df["risk_score"] >= 25) & (df["risk_score"] < 50)).sum()),
        "50-75% (Elevated)": int(((df["risk_score"] >= 50) & (df["risk_score"] < 75)).sum()),
        "75-100% (High Priority)": int((df["risk_score"] >= 75).sum()),
    }

    # Top 50 highest risk records
    df_sorted = df.sort_values("risk_score", ascending=False)
    results_records = df_sorted[[
        "employee_id", "department", "offpeak_logins", "failed_logins",
        "sensitive_file_access", "usb_usage_count", "data_download_mb",
        "is_resigning_soon", "risk_score", "prediction"
    ]].head(50).to_dict(orient="records")

    # Record in analysis history
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    analysis_id = f"SCAN-{datetime.now().strftime('%Y%m%d%H%M%S')}"

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO analysis_history (analysis_id, analysis_type, dataset_name, record_count, threat_count, avg_risk_score, model_version, created_by, created_at)
    VALUES (?, 'Batch Dataset', ?, ?, ?, ?, 'RandomForest-v1.0-SMOTE', 'Security Analyst', ?)
    """, (analysis_id, file.filename, total_records, threat_count, avg_risk, now_str))

    # Also register top high threats (>75%) into alerts table
    high_threats = df[df["risk_score"] >= 70.0].head(10)
    for _, row in high_threats.iterrows():
        alert_id = f"ALT-{datetime.now().strftime('%Y%m%d%H%M%S')}-{row['employee_id']}"
        cursor.execute("""
        INSERT OR IGNORE INTO alerts (alert_id, employee_id, department, risk_score, prediction, review_priority, status, notes, top_factors, detected_at, updated_at)
        VALUES (?, ?, ?, ?, 'INSIDER THREAT', 'High', 'Pending Review', '', 'High Risk Batch Detection', ?, ?)
        """, (alert_id, row['employee_id'], row['department'], row['risk_score'], now_str, now_str))

    conn.commit()
    conn.close()

    return {
        "analysis_id": analysis_id,
        "filename": file.filename,
        "total_records": total_records,
        "threat_count": threat_count,
        "normal_count": total_records - threat_count,
        "threat_percentage": threat_rate,
        "avg_risk_score": avg_risk,
        "max_risk_score": max_risk,
        "score_distribution": score_bins,
        "department_statistics": dept_stats,
        "top_threats": results_records,
        "analyzed_at": now_str,
    }
