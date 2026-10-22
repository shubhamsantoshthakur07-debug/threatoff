"""
database.py
-----------
SQLite database management for ThreatOff:
- Alerts ledger & investigation workflows
- Batch analysis history
- System audit logs
- Configurable security thresholds
"""

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "threatoff.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. Alerts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alert_id TEXT UNIQUE NOT NULL,
        employee_id TEXT NOT NULL,
        department TEXT NOT NULL,
        risk_score REAL NOT NULL,
        prediction TEXT NOT NULL,
        review_priority TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending Review',
        notes TEXT DEFAULT '',
        top_factors TEXT DEFAULT '',
        detected_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    """)

    # 2. Analysis History Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analysis_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        analysis_id TEXT UNIQUE NOT NULL,
        analysis_type TEXT NOT NULL,
        dataset_name TEXT NOT NULL,
        record_count INTEGER NOT NULL,
        threat_count INTEGER NOT NULL,
        avg_risk_score REAL NOT NULL,
        model_version TEXT NOT NULL DEFAULT 'RandomForest-v1.0-SMOTE',
        created_by TEXT NOT NULL DEFAULT 'Security Administrator',
        created_at TEXT NOT NULL
    )
    """)

    # 3. Audit Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT NOT NULL,
        timestamp TEXT NOT NULL
    )
    """)

    # 4. Settings Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS system_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    """)

    # Pre-seed initial demonstration alerts if empty
    cursor.execute("SELECT COUNT(*) FROM alerts")
    if cursor.fetchone()[0] == 0:
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        initial_alerts = [
            ("ALT-2026-9041", "EMP00005", "IT", 83.54, "INSIDER THREAT", "High", "Under Review", "Investigating off-peak data download spike (320 MB) and 4 USB connections during resignation notice period.", "Sensitive File Access (9), USB Usage (4), Resignation Pending", now, now),
            ("ALT-2026-8812", "EMP00018", "Finance", 78.90, "INSIDER THREAT", "High", "Pending Review", "", "Sensitive File Access (11), Data Download (540 MB), Failed Logins (4)", now, now),
            ("ALT-2026-7243", "EMP00014", "R&D", 68.20, "INSIDER THREAT", "High", "Pending Review", "", "Sensitive File Access (8), USB Usage (4), Career Stagnation (1200 days)", now, now),
            ("ALT-2026-6109", "EMP00009", "R&D", 58.55, "INSIDER THREAT", "Medium", "Resolved", "Confirmed employee was transferring simulation data to authorized lab drive. No policy breach.", "Off-peak Logins (5), USB Usage (3)", now, now),
            ("ALT-2026-5520", "EMP00016", "Finance", 70.33, "INSIDER THREAT", "High", "False Positive", "Supervisor confirmed legitimate month-end audit reports access.", "Failed Logins (2), Sensitive File Access (3)", now, now),
        ]
        cursor.executemany("""
        INSERT INTO alerts (alert_id, employee_id, department, risk_score, prediction, review_priority, status, notes, top_factors, detected_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, initial_alerts)

    # Pre-seed analysis history if empty
    cursor.execute("SELECT COUNT(*) FROM analysis_history")
    if cursor.fetchone()[0] == 0:
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        initial_history = [
            ("SCAN-2026-001", "Batch Dataset", "user_activity.csv", 5000, 248, 14.82, "RandomForest-v1.0-SMOTE", "Admin (SecOps)", now),
            ("SCAN-2026-002", "Batch Dataset", "sample_test_batch.csv", 20, 4, 28.50, "RandomForest-v1.0-SMOTE", "SecOps Analyst", now),
            ("SCAN-2026-003", "Manual Analysis", "EMP00005 Activity Log", 1, 1, 83.54, "RandomForest-v1.0-SMOTE", "SOC Tier-2", now)
        ]
        cursor.executemany("""
        INSERT INTO analysis_history (analysis_id, analysis_type, dataset_name, record_count, threat_count, avg_risk_score, model_version, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, initial_history)

    # Pre-seed default settings
    cursor.execute("SELECT COUNT(*) FROM system_settings")
    if cursor.fetchone()[0] == 0:
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("INSERT INTO system_settings (setting_key, setting_value, updated_at) VALUES ('threat_threshold', '50.0', ?)", (now,))
        cursor.execute("INSERT INTO system_settings (setting_key, setting_value, updated_at) VALUES ('data_retention_days', '90', ?)", (now,))
        cursor.execute("INSERT INTO system_settings (setting_key, setting_value, updated_at) VALUES ('max_upload_size_mb', '25', ?)", (now,))

    conn.commit()
    conn.close()
