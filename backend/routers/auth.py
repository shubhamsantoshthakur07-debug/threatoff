"""
routers/auth.py
---------------
Authentication, role definitions (Administrator, Security Analyst, Viewer),
1-click evaluator profiles, audit logging, and security settings management.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from database import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Predefined role accounts for 1-click evaluation & testing
DEMO_ACCOUNTS = {
    "admin@threatoff.soc": {
        "email": "shubham.thakur@threatoff.soc",
        "name": "Shubham Thakur",
        "role": "Administrator",
        "title": "Chief Information Security Officer (CISO)",
        "badge": "SEC-LVL-4",
        "permissions": ["all", "manage_alerts", "batch_upload", "configure_thresholds", "export_evidence", "audit_view"]
    },
    "shubham.thakur@threatoff.soc": {
        "email": "shubham.thakur@threatoff.soc",
        "name": "Shubham Thakur",
        "role": "Administrator",
        "title": "Chief Information Security Officer (CISO)",
        "badge": "SEC-LVL-4",
        "permissions": ["all", "manage_alerts", "batch_upload", "configure_thresholds", "export_evidence", "audit_view"]
    },
    "analyst@threatoff.soc": {
        "email": "analyst@threatoff.soc",
        "name": "Marcus Kane",
        "role": "Security Analyst",
        "title": "Senior SOC Tier-2 Incident Responder",
        "badge": "SEC-LVL-2",
        "permissions": ["predict_manual", "batch_upload", "manage_alerts", "view_analytics", "add_notes"]
    },
    "viewer@threatoff.soc": {
        "email": "viewer@threatoff.soc",
        "name": "Elena Rostova",
        "role": "Viewer",
        "title": "Executive Audit Observer",
        "badge": "AUDIT-LVL-1",
        "permissions": ["read_only", "view_analytics", "view_performance"]
    }
}


class LoginRequest(BaseModel):
    email: str
    password: str = "threatoff2026"


class AuditLogRequest(BaseModel):
    user_email: str
    action: str
    details: str


class SettingsUpdateRequest(BaseModel):
    threat_threshold: float
    data_retention_days: int
    max_upload_size_mb: int


@router.post("/login")
def login(payload: LoginRequest):
    email = payload.email.lower().strip()
    if email in DEMO_ACCOUNTS:
        user = DEMO_ACCOUNTS[email]
        # Log successful login to audit ledger
        conn = get_db()
        cursor = conn.cursor()
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute(
            "INSERT INTO audit_logs (user_email, action, details, timestamp) VALUES (?, ?, ?, ?)",
            (user["email"], "USER_LOGIN", f"Role '{user['role']}' authenticated into ThreatOff SOC console", now)
        )
        conn.commit()
        conn.close()

        return {
            "token": f"bearer-{user['role'].lower()}-token-909283",
            "user": user
        }

    # If any generic test login
    user = {
        "email": payload.email,
        "name": "SecOps User",
        "role": "Security Analyst",
        "title": "Threat Hunter",
        "badge": "SEC-LVL-2",
        "permissions": ["predict_manual", "batch_upload", "manage_alerts", "view_analytics"]
    }
    return {"token": "bearer-generic-token", "user": user}


@router.get("/roles")
def get_demo_roles():
    return list(DEMO_ACCOUNTS.values())


@router.get("/audit")
def get_audit_logs(limit: int = 50):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.post("/audit")
def add_audit_log(payload: AuditLogRequest):
    conn = get_db()
    cursor = conn.cursor()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute(
        "INSERT INTO audit_logs (user_email, action, details, timestamp) VALUES (?, ?, ?, ?)",
        (payload.user_email, payload.action, payload.details, now)
    )
    conn.commit()
    conn.close()
    return {"message": "Audit event recorded successfully"}


@router.get("/settings")
def get_settings():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT setting_key, setting_value FROM system_settings")
    rows = cursor.fetchall()
    conn.close()

    settings_dict = {row["setting_key"]: row["setting_value"] for row in rows}
    return {
        "threat_threshold": float(settings_dict.get("threat_threshold", 50.0)),
        "data_retention_days": int(settings_dict.get("data_retention_days", 90)),
        "max_upload_size_mb": int(settings_dict.get("max_upload_size_mb", 25)),
        "alert_notification_channel": "SecOps-Slack & Webhook",
        "model_engine": "Scikit-Learn Random Forest (300 trees)"
    }


@router.post("/settings")
def update_settings(payload: SettingsUpdateRequest):
    conn = get_db()
    cursor = conn.cursor()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("UPDATE system_settings SET setting_value = ?, updated_at = ? WHERE setting_key = 'threat_threshold'", (str(payload.threat_threshold), now))
    cursor.execute("UPDATE system_settings SET setting_value = ?, updated_at = ? WHERE setting_key = 'data_retention_days'", (str(payload.data_retention_days), now))
    cursor.execute("UPDATE system_settings SET setting_value = ?, updated_at = ? WHERE setting_key = 'max_upload_size_mb'", (str(payload.max_upload_size_mb), now))

    conn.commit()
    conn.close()
    return {"message": "Settings updated successfully", "updated_settings": payload.dict()}
