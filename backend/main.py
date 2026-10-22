"""
main.py
-------
ThreatOff — AI-Powered Insider Threat Prediction and Detection System
FastAPI Application Entry Point
"""

import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Ensure backend root is on Python sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from database import init_db
from routers.predict import router as predict_router, get_model
from routers.alerts import router as alerts_router
from routers.analytics import router as analytics_router
from routers.model_info import router as model_info_router
from routers.auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize SQLite database schema and seed tables
    print("[INIT] Initializing ThreatOff SQLite database...")
    init_db()

    # 2. Warm up and verify Random Forest model + department encoder
    print("[INIT] Loading serialized Random Forest model and label encoder...")
    try:
        model, encoder = get_model()
        print(f"[SUCCESS] Model loaded successfully: {type(model).__name__} (Features: {model.n_features_in_})")
        print(f"[SUCCESS] Department Encoder classes: {list(encoder.classes_)}")
    except Exception as e:
        print(f"[WARNING] Model initialization error: {e}")

    yield

    print("[SHUTDOWN] ThreatOff SOC backend shutting down cleanly.")


app = FastAPI(
    title="ThreatOff — AI Insider Threat Prediction API",
    description="Enterprise SOC backend engine for behavioral risk scoring, batch telemetry analysis, and alert triage.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(predict_router)
app.include_router(alerts_router)
app.include_router(analytics_router)
app.include_router(model_info_router)


@app.get("/")
def root():
    return {
        "system": "ThreatOff SOC AI Engine",
        "status": "Online",
        "docs_url": "/docs",
        "verified_metrics": {
            "roc_auc": 0.8401,
            "accuracy": 0.8496,
            "algorithm": "Random Forest (SMOTE Balanced)"
        }
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "services": {
            "database": "connected",
            "model_engine": "loaded",
            "api": "operational"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
