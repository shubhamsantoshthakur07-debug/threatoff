# ThreatOff — AI-Powered Insider Threat Prediction and Detection System

> **Platform**: Enterprise AI-Powered Cybersecurity Behavioral Defense Center  
> **Domain**: Cybersecurity, Machine Learning, Behavioral Analytics & Security Operations Center (SOC)  
> **Status**: Full-Stack Working System (FastAPI + Scikit-Learn + React 18 + Tailwind CSS)

---

## 1. Project Overview & Problem Statement

Organizations face substantial security risks not only from external cyber attackers but from **insiders** — employees, contractors, and administrators who already possess legitimate access to internal infrastructure. Malicious data exfiltration, intellectual property theft, and sabotage frequently occur during employee resignation notice periods or following career stagnation.

**ThreatOff** is an enterprise-grade Security Operations Center (SOC) web platform powered by an ensemble machine learning model (Random Forest with SMOTE class balancing) that predicts and flags anomalous behavioral patterns across 11 key operational telemetry vectors before catastrophic data loss occurs.

---

## 2. Verified Machine Learning Performance & Metrics

The system uses the serialized pre-trained model and encoder without fabrication:
- **Algorithm**: `RandomForestClassifier(n_estimators=300, max_depth=10, min_samples_split=5, class_weight='balanced')`
- **Class Balancing**: Synthetic Minority Over-sampling Technique (**SMOTE**)
- **Training Baseline**: 5,000 enterprise telemetry records
- **Test Set**: 1,250 held-out samples (25% split)

| Evaluation Metric | Measured Value | Academic Significance |
| :--- | :--- | :--- |
| **ROC-AUC** | **0.8401** | High discriminative power across all decision thresholds |
| **Test Accuracy** | **84.96%** | 1,062 of 1,250 test samples classified correctly |
| **Threat Recall** | **59.68%** | Caught 37 of 62 insider threat instances in test cohort |
| **Specificity** | **86.28%** | Effectively minimizes alert fatigue on benign workforce |
| **F1-Score** | **0.2824** | Configured for high-sensitivity detection under severe natural imbalance (~5%) |

### Confusion Matrix (Test Split: 1,250 Records)
```
                    Predicted Normal    Predicted Threat
Actual Normal:           1,025 (TN)          163 (FP)
Actual Threat:              25 (FN)           37 (TP)
```

### Feature Importance Weights (Gini Impurity)
1. **Sensitive File Access Count**: `22.77%` (Primary indicator of unauthorized exploration)
2. **USB Storage Activity Count**: `19.36%` (Direct physical data exfiltration vector)
3. **Days Since Last Promotion**: `13.92%` (HR/Behavioral discontent & flight risk marker)
4. **Data Download Volume (MB)**: `12.78%` (Massive exfiltration downloads)
5. **Department Categorization**: `6.94%` (Privileged vs non-privileged org units)
6. **Total File Access Count**: `5.83%` (Overall directory traversal velocity)
7. **Email Attachment Count**: `5.55%` (Outbound communication exfiltration channel)
8. **Off-Peak Hours Logins**: `4.84%` (Night/weekend irregular authentication)
9. **Failed Logins Count**: `4.65%` (Brute-force / credential anomaly signals)
10. **Previous Policy Violations**: `2.52%` (Prior compliance history)
11. **Resignation Status Flag**: `0.83%` (Active departure flight risk)

---

## 3. Platform Capabilities & Pages

| Page / Capability | Route | Description |
| :--- | :--- | :--- |
| **Public Showcase** | `/` | Academic hero, verified KPI strip, 6 core pillars, 5-stage pipeline, tech badges |
| **Executive Dashboard** | `/dashboard` | SOC Command Center: Monitored KPIs, department risk bar chart, severity donut, 14-day temporal trends, priority triage ledger |
| **Manual Predictor** | `/manual-prediction` | Single employee hypothesis tester: 11 inputs, 3 quick presets (*Critical Exfiltration*, *Benign Employee*, *Finance Spike*), probability gauge & auto-dispatch |
| **Batch Dataset CSV** | `/dataset-analysis` | Drag-and-drop CSV upload, 1-click test batch loader (`sample_test_batch.csv`), batch inference engine, risk histogram, and CSV export |
| **Threat Alert Ledger** | `/alerts` | SOC incident case files, status state transitions (*Under Review*, *Resolved*, *False Positive*), timestamped investigator notes |
| **Employee Risk Directory** | `/employee-risk` | Pseudonymous employee search (`EMP00005`), multi-vector activity flags, and full 11-attribute telemetry snapshot |
| **Behavioral Monitoring** | `/monitoring` | 24-hour temporal anomaly distribution, 5 active sensor vectors, real-time live ingestion telemetry stream |
| **Model Performance** | `/model-performance` | Empirical confusion matrix visualizer, interactive ROC curve (0.8401 AUC), horizontal feature weights ranking, and SMOTE defense notes |
| **Forensic Reports** | `/reports` | Printable executive report (`window.print()`), department risk exposure, incident summary table, mitigation recommendations, CSV download |
| **Analysis History** | `/history` | Immutable log of past manual and batch evaluation runs |
| **Security Settings** | `/settings` | Dynamic threshold slider (30%-80%), data retention window, and immutable audit log ledger |
| **Role Authentication** | `/login` | High-tech login with 1-click evaluator profiles for Administrator, Security Analyst, and Viewer |

---

## 4. Role-Based Access Control (RBAC)

ThreatOff features a persistent **1-Click Evaluation Toolbar** across the application:
1. **Administrator** (`shubham.thakur@threatoff.soc` - Shubham Thakur, CISO): Full system control, triage alerts, upload datasets, adjust security thresholds, view audit logs.
2. **Security Analyst** (`analyst@threatoff.soc` - Marcus Kane): Operational triage, manual prediction, batch analysis, add investigator notes.
3. **Viewer** (`viewer@threatoff.soc` - Elena Rostova): Executive read-only mode for audit inspection.

---

## 5. Ethical AI & Governance Principles

1. **Risk Indicators, Not Guilt**: Model outputs represent algorithmic anomaly scores, **not definitive proof of malicious intent**.
2. **Human-in-the-Loop Triage**: Administrative or disciplinary action is strictly prohibited without human SOC investigator verification.
3. **Pseudonymous Telemetry**: Employee entities are tracked via pseudonymous IDs (e.g., `EMP00005`) to prevent cognitive and personal reviewer bias.

---


## 7. Technical Architecture & Defense Talking Points

1. **Why Random Forest over Deep Learning?**
   - Tabular telemetry data with structured numerical features yields superior performance and interpretability with Random Forests.
   - Ensemble of 300 decision trees minimizes variance and prevents overfitting without requiring massive deep neural net architectures.
2. **How was the severe class imbalance handled?**
   - Real organizations exhibit genuine insider threat rates of < 5%. Training without balancing causes standard classifiers to predict "Normal" 95% of the time.
   - SMOTE (Synthetic Minority Over-sampling Technique) creates synthetic threat vectors along feature space lines, enabling the model to learn subtle exfiltration combinations while achieving **0.8401 ROC-AUC**.
3. **Which behavioral vector is the strongest predictor?**
   - **Sensitive File Access** (`22.8%`) and **USB Removable Media** (`19.4%`) together account for over 42% of the decision tree splitting power, reflecting standard cybersecurity exfiltration indicators.
