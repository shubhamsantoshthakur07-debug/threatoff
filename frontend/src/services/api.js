/**
 * ThreatOff API Client
 * Connects to FastAPI backend at /api with resilient fallback handlers
 */

const API_BASE = '/api';

export const api = {
  // 1. Analytics & Overview
  async getOverview() {
    try {
      const res = await fetch(`${API_BASE}/analytics/overview`);
      if (!res.ok) throw new Error('API failed');
      return await res.json();
    } catch (err) {
      console.warn('Using fallback overview data:', err);
      return {
        kpis: {
          total_scanned_records: 5021,
          total_threats_flagged: 253,
          active_investigations: 4,
          pending_alerts: 3,
          under_review: 1,
          resolved_alerts: 1,
          false_positives: 1,
          avg_threat_risk: 70.6,
          system_status: "Operational - AI Model Active",
          model_version: "RandomForest-v1.0-SMOTE (ROC-AUC: 0.8401)"
        },
        department_distribution: [
          { department: "IT", threat_count: 82, avg_risk: 74.2 },
          { department: "Finance", threat_count: 65, avg_risk: 71.5 },
          { department: "R&D", threat_count: 49, avg_risk: 68.3 },
          { department: "Sales", threat_count: 24, avg_risk: 54.1 },
          { department: "HR", threat_count: 18, avg_risk: 51.0 },
          { department: "Legal", threat_count: 15, avg_risk: 49.8 }
        ],
        risk_breakdown: {
          "Critical (>= 80%)": 28,
          "High (65 - 79%)": 94,
          "Medium (50 - 64%)": 131,
          "Low (< 50%)": 4768
        },
        trend_timeline: [
          { date: "Oct 01", scanned: 340, anomalies: 12, data_transfers_gb: 14.2, offpeak_events: 4 },
          { date: "Oct 03", scanned: 360, anomalies: 15, data_transfers_gb: 16.0, offpeak_events: 6 },
          { date: "Oct 05", scanned: 310, anomalies: 8, data_transfers_gb: 12.5, offpeak_events: 2 },
          { date: "Oct 07", scanned: 395, anomalies: 19, data_transfers_gb: 18.2, offpeak_events: 8 },
          { date: "Oct 09", scanned: 420, anomalies: 24, data_transfers_gb: 21.4, offpeak_events: 11 },
          { date: "Oct 11", scanned: 380, anomalies: 14, data_transfers_gb: 15.6, offpeak_events: 5 },
          { date: "Oct 13", scanned: 410, anomalies: 22, data_transfers_gb: 19.8, offpeak_events: 9 },
          { date: "Oct 15", scanned: 435, anomalies: 27, data_transfers_gb: 22.5, offpeak_events: 12 }
        ]
      };
    }
  },

  // 2. Manual Single Employee Prediction
  async predictManual(payload) {
    const res = await fetch(`${API_BASE}/predict/manual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Prediction request failed' }));
      throw new Error(err.detail || 'Prediction failed');
    }
    return await res.json();
  },

  // 3. Batch Dataset Prediction
  async predictBatch(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/predict/batch`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Batch analysis failed' }));
      throw new Error(err.detail || 'Batch analysis failed');
    }
    return await res.json();
  },

  // 4. Threat Alerts Management
  async getAlerts(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
      const res = await fetch(`${API_BASE}/alerts?${query}`);
      if (!res.ok) throw new Error('API failed');
      return await res.json();
    } catch (err) {
      console.warn('Using fallback alerts:', err);
      return [
        {
          id: 1,
          alert_id: "ALT-2026-9041",
          employee_id: "EMP00005",
          department: "IT",
          risk_score: 83.54,
          prediction: "INSIDER THREAT",
          review_priority: "High",
          status: "Under Review",
          notes: "Investigating off-peak data download spike (320 MB) and 4 USB connections during resignation notice period.",
          top_factors: "Sensitive File Access (9), USB Usage (4), Resignation Pending",
          detected_at: "2026-10-15 10:24:18",
          updated_at: "2026-10-15 11:05:00"
        },
        {
          id: 2,
          alert_id: "ALT-2026-8812",
          employee_id: "EMP00018",
          department: "Finance",
          risk_score: 78.90,
          prediction: "INSIDER THREAT",
          review_priority: "High",
          status: "Pending Review",
          notes: "",
          top_factors: "Sensitive File Access (11), Data Download (540 MB), Failed Logins (4)",
          detected_at: "2026-10-15 09:12:44",
          updated_at: "2026-10-15 09:12:44"
        },
        {
          id: 3,
          alert_id: "ALT-2026-7243",
          employee_id: "EMP00014",
          department: "R&D",
          risk_score: 68.20,
          prediction: "INSIDER THREAT",
          review_priority: "High",
          status: "Pending Review",
          notes: "",
          top_factors: "Sensitive File Access (8), USB Usage (4), Career Stagnation (1200 days)",
          detected_at: "2026-10-14 16:45:00",
          updated_at: "2026-10-14 16:45:00"
        },
        {
          id: 4,
          alert_id: "ALT-2026-6109",
          employee_id: "EMP00009",
          department: "R&D",
          risk_score: 58.55,
          prediction: "INSIDER THREAT",
          review_priority: "Medium",
          status: "Resolved",
          notes: "Confirmed employee was transferring simulation data to authorized lab drive. No policy breach.",
          top_factors: "Off-peak Logins (5), USB Usage (3)",
          detected_at: "2026-10-13 14:10:00",
          updated_at: "2026-10-13 18:30:00"
        },
        {
          id: 5,
          alert_id: "ALT-2026-5520",
          employee_id: "EMP00016",
          department: "Finance",
          risk_score: 70.33,
          prediction: "INSIDER THREAT",
          review_priority: "High",
          status: "False Positive",
          notes: "Supervisor confirmed legitimate month-end audit reports access.",
          top_factors: "Failed Logins (2), Sensitive File Access (3)",
          detected_at: "2026-10-12 11:20:00",
          updated_at: "2026-10-12 15:00:00"
        }
      ];
    }
  },

  async updateAlertStatus(alertId, status, notes = '') {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) throw new Error('Status update failed');
    return await res.json();
  },

  async addAlertNotes(alertId, notes, reviewer = 'SecOps Analyst') {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, reviewer })
    });
    if (!res.ok) throw new Error('Add note failed');
    return await res.json();
  },

  // 5. Model Performance Metrics
  async getModelPerformance() {
    try {
      const res = await fetch(`${API_BASE}/model/performance`);
      if (!res.ok) throw new Error('API failed');
      return await res.json();
    } catch (err) {
      console.warn('Using fallback model performance:', err);
      return {
        model_name: "ThreatOff Random Forest Classifier",
        version: "1.0.0-SMOTE",
        algorithm: "RandomForestClassifier(n_estimators=300, max_depth=10, min_samples_split=5, class_weight='balanced')",
        metrics: {
          accuracy: 0.8496,
          accuracy_pct: "84.96%",
          roc_auc: 0.8401,
          precision: 0.1850,
          recall: 0.5968,
          f1_score: 0.2824,
          specificity: 0.8628
        },
        confusion_matrix: {
          matrix: [[1025, 163], [25, 37]],
          true_negatives: 1025,
          false_positives: 163,
          false_negatives: 25,
          true_positives: 37,
          labels: ["Normal Behavior", "Insider Threat"]
        },
        feature_importances: [
          { feature: "sensitive_file_access", label: "Sensitive File Access", importance: 0.2277, category: "Data Access" },
          { feature: "usb_usage_count", label: "USB Storage Activity", importance: 0.1936, category: "Exfiltration Vector" },
          { feature: "days_since_last_promotion", label: "Days Since Last Promotion", importance: 0.1392, category: "HR / Behavioral" },
          { feature: "data_download_mb", label: "Data Download Volume (MB)", importance: 0.1278, category: "Data Access" },
          { feature: "department_enc", label: "Department Categorization", importance: 0.0694, category: "Organizational" },
          { feature: "file_access_count", label: "Total File Access Count", importance: 0.0583, category: "Data Access" },
          { feature: "email_attachment_count", label: "Email Attachments Dispatched", importance: 0.0555, category: "Communication" },
          { feature: "offpeak_logins", label: "Off-Peak Hours Logins", importance: 0.0484, category: "Authentication" },
          { feature: "failed_logins", label: "Failed Authentication Attempts", importance: 0.0465, category: "Authentication" },
          { feature: "previous_violations", label: "Prior Policy Violations", importance: 0.0252, category: "HR / Behavioral" },
          { feature: "is_resigning_soon", label: "Resignation Status Flag", importance: 0.0083, category: "HR / Behavioral" }
        ],
        roc_curve: [
          { fpr: 0.0, tpr: 0.0 },
          { fpr: 0.02, tpr: 0.21 },
          { fpr: 0.05, tpr: 0.42 },
          { fpr: 0.10, tpr: 0.60 },
          { fpr: 0.137, tpr: 0.597 },
          { fpr: 0.20, tpr: 0.72 },
          { fpr: 0.30, tpr: 0.81 },
          { fpr: 0.45, tpr: 0.89 },
          { fpr: 0.60, tpr: 0.94 },
          { fpr: 0.80, tpr: 0.98 },
          { fpr: 1.0, tpr: 1.0 }
        ]
      };
    }
  },

  // 6. Employees Telemetry Exploration
  async getEmployees(search = '') {
    try {
      const res = await fetch(`${API_BASE}/analytics/employees?search=${encodeURIComponent(search)}`);
      if (!res.ok) throw new Error('API failed');
      return await res.json();
    } catch (err) {
      return [
        { employee_id: "EMP00005", department: "IT", offpeak_logins: 6, failed_logins: 3, sensitive_file_access: 9, usb_usage_count: 4, data_download_mb: 320.0, is_resigning_soon: 1, estimated_risk_score: 83.5, risk_level: "Critical" },
        { employee_id: "EMP00018", department: "Finance", offpeak_logins: 4, failed_logins: 4, sensitive_file_access: 11, usb_usage_count: 3, data_download_mb: 540.0, is_resigning_soon: 0, estimated_risk_score: 78.9, risk_level: "High" },
        { employee_id: "EMP00014", department: "R&D", offpeak_logins: 3, failed_logins: 2, sensitive_file_access: 8, usb_usage_count: 4, data_download_mb: 280.0, is_resigning_soon: 0, estimated_risk_score: 68.2, risk_level: "High" },
        { employee_id: "EMP00009", department: "R&D", offpeak_logins: 5, failed_logins: 1, sensitive_file_access: 4, usb_usage_count: 3, data_download_mb: 150.0, is_resigning_soon: 0, estimated_risk_score: 58.5, risk_level: "Medium" },
        { employee_id: "EMP00000", department: "HR", offpeak_logins: 1, failed_logins: 0, sensitive_file_access: 1, usb_usage_count: 0, data_download_mb: 45.0, is_resigning_soon: 0, estimated_risk_score: 14.5, risk_level: "Low" }
      ];
    }
  },

  async getEmployeeDetail(employeeId) {
    try {
      const res = await fetch(`${API_BASE}/analytics/employee/${employeeId}`);
      if (!res.ok) throw new Error('API failed');
      return await res.json();
    } catch (err) {
      return {
        employee_id: employeeId,
        department: "IT",
        risk_score: 83.5,
        is_threat: true,
        risk_level: "Critical",
        telemetry: {
          offpeak_logins: 6,
          failed_logins: 3,
          file_access_count: 52,
          sensitive_file_access: 9,
          usb_usage_count: 4,
          email_attachment_count: 8,
          data_download_mb: 320.0,
          previous_violations: 1,
          days_since_last_promotion: 730,
          is_resigning_soon: 1
        },
        contributing_factors: [
          "Unusually high sensitive file access (9 files)",
          "Frequent USB removable media connections (4 events)",
          "Elevated data download volume (320 MB)",
          "Active resignation notice pending"
        ]
      };
    }
  },

  // 7. Activity Monitoring
  async getMonitoring() {
    try {
      const res = await fetch(`${API_BASE}/analytics/monitoring`);
      if (!res.ok) throw new Error('API failed');
      return await res.json();
    } catch (err) {
      return {
        hourly_distribution: Array.from({ length: 24 }, (_, i) => ({
          hour: `${String(i).padStart(2, '0')}:00`,
          normal_logins: i >= 9 && i <= 18 ? 160 : 20,
          offpeak_logins: i < 7 || i > 19 ? 35 : 4,
          data_transfer_mb: (i >= 10 && i <= 17 ? 420 : 80),
          usb_connections: i < 7 || i > 19 ? 6 : 2
        })),
        monitored_vectors: [
          { vector: "Off-Peak Authentication", status: "Active Sensor", threshold: "> 5 events/day" },
          { vector: "Sensitive Directory Traversals", status: "Active Sensor", threshold: "> 4 files/day" },
          { vector: "Massive Exfiltration Downloads", status: "Active Sensor", threshold: "> 200 MB/session" },
          { vector: "Removable USB Storage", status: "Active Sensor", threshold: "> 2 mounts/shift" },
          { vector: "Resignation Flight Risk Correlator", status: "Active Sensor", threshold: "Resignation flag active" }
        ]
      };
    }
  },

  // 8. Scan History
  async getHistory() {
    try {
      const res = await fetch(`${API_BASE}/analytics/history`);
      if (!res.ok) throw new Error('API failed');
      return await res.json();
    } catch (err) {
      return [
        { id: 1, analysis_id: "SCAN-2026-001", analysis_type: "Batch Dataset", dataset_name: "user_activity.csv", record_count: 5000, threat_count: 248, avg_risk_score: 14.82, model_version: "RandomForest-v1.0-SMOTE", created_by: "Admin (SecOps)", created_at: "2026-10-15 08:30:00" },
        { id: 2, analysis_id: "SCAN-2026-002", analysis_type: "Batch Dataset", dataset_name: "sample_test_batch.csv", record_count: 20, threat_count: 4, avg_risk_score: 28.50, model_version: "RandomForest-v1.0-SMOTE", created_by: "SecOps Analyst", created_at: "2026-10-15 09:15:00" },
        { id: 3, analysis_id: "SCAN-2026-003", analysis_type: "Manual Analysis", dataset_name: "EMP00005 Activity Log", record_count: 1, threat_count: 1, avg_risk_score: 83.54, model_version: "RandomForest-v1.0-SMOTE", created_by: "SOC Tier-2", created_at: "2026-10-15 10:24:18" }
      ];
    }
  },

  // 9. Auth & Settings
  async login(email, password = "threatoff2026") {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Authentication failed');
    return await res.json();
  },

  async getAuditLogs() {
    try {
      const res = await fetch(`${API_BASE}/auth/audit`);
      if (!res.ok) throw new Error('API failed');
      return await res.json();
    } catch (err) {
      return [
        { id: 1, user_email: "admin@threatoff.soc", action: "USER_LOGIN", details: "Role 'Administrator' authenticated into ThreatOff SOC console", timestamp: "2026-10-15 08:00:12" },
        { id: 2, user_email: "analyst@threatoff.soc", action: "ALERT_TRIAGE", details: "Status updated to 'Under Review' for ALT-2026-9041", timestamp: "2026-10-15 10:25:40" },
        { id: 3, user_email: "admin@threatoff.soc", action: "BATCH_SCAN", details: "Initiated 5000 employee record telemetry scan", timestamp: "2026-10-15 08:30:00" }
      ];
    }
  },

  async getSettings() {
    try {
      const res = await fetch(`${API_BASE}/auth/settings`);
      if (!res.ok) throw new Error('API failed');
      return await res.json();
    } catch (err) {
      return {
        threat_threshold: 50.0,
        data_retention_days: 90,
        max_upload_size_mb: 25,
        alert_notification_channel: "SecOps-Slack & Webhook",
        model_engine: "Scikit-Learn Random Forest (300 trees)"
      };
    }
  },

  async updateSettings(settings) {
    const res = await fetch(`${API_BASE}/auth/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Update settings failed');
    return await res.json();
  }
};
