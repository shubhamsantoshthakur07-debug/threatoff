"""
routers/alerts.py
-----------------
Threat alert management and investigation workflow endpoints:
- GET /api/alerts: Filter and list detected alerts
- PATCH /api/alerts/{id}/status: Triage workflow (Under Review, Resolved, False Positive)
- POST /api/alerts/{id}/notes: Append human investigation logs
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from database import get_db

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


class StatusUpdateRequest(BaseModel):
    status: str  # 'Pending Review', 'Under Review', 'Resolved', 'False Positive'
    notes: str = ""


class NoteAddRequest(BaseModel):
    notes: str
    reviewer: str = "SecOps Analyst"


@router.get("")
def get_alerts(status: str = "All", department: str = "All", priority: str = "All"):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM alerts WHERE 1=1"
    params = []

    if status != "All":
        query += " AND status = ?"
        params.append(status)
    if department != "All":
        query += " AND department = ?"
        params.append(department)
    if priority != "All":
        query += " AND review_priority = ?"
        params.append(priority)

    query += " ORDER BY id DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@router.get("/{alert_id}")
def get_alert_detail(alert_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts WHERE alert_id = ? OR id = ?", (alert_id, alert_id))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")
    return dict(row)


@router.patch("/{alert_id}/status")
def update_alert_status(alert_id: str, payload: StatusUpdateRequest):
    valid_statuses = ["Pending Review", "Under Review", "Resolved", "False Positive"]
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Permitted: {valid_statuses}")

    conn = get_db()
    cursor = conn.cursor()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
    UPDATE alerts
    SET status = ?, notes = CASE WHEN ? != '' THEN ? ELSE notes END, updated_at = ?
    WHERE alert_id = ? OR id = ?
    """, (payload.status, payload.notes, payload.notes, now_str, alert_id, alert_id))

    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Alert not found")

    conn.commit()
    conn.close()
    return {"message": "Alert status updated successfully", "alert_id": alert_id, "status": payload.status}


@router.post("/{alert_id}/notes")
def add_alert_notes(alert_id: str, payload: NoteAddRequest):
    conn = get_db()
    cursor = conn.cursor()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted_note = f"[{now_str} - {payload.reviewer}]: {payload.notes}"

    cursor.execute("""
    UPDATE alerts
    SET notes = CASE WHEN notes = '' THEN ? ELSE notes || CHAR(10) || ? END, updated_at = ?
    WHERE alert_id = ? OR id = ?
    """, (formatted_note, formatted_note, now_str, alert_id, alert_id))

    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Alert not found")

    conn.commit()
    conn.close()
    return {"message": "Investigation note added", "alert_id": alert_id}
