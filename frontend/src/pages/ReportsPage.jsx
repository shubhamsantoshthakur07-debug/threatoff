import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import {
  FileText,
  Printer,
  Download,
  Shield,
  Calendar,
  AlertTriangle,
  Building,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const [overview, alertsList] = await Promise.all([
          api.getOverview(),
          api.getAlerts()
        ]);
        setData(overview);
        setAlerts(alertsList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    if (!alerts.length) return;
    const headers = ["Alert_ID", "Employee_ID", "Department", "Risk_Score", "Priority", "Status", "Top_Factors", "Detected_At"];
    const rows = alerts.map(a => [
      a.alert_id, a.employee_id, a.department, a.risk_score, a.review_priority, a.status, `"${a.top_factors}"`, a.detected_at
    ].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `ThreatOff_Executive_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-soc-cardBorder print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>Forensic &amp; Executive Security Report</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Printable audit document summarizing insider threat posture, incident triage ledger, and vector mitigations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-soc-card border border-soc-cardBorder hover:border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all shadow-cyan-glow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-1.5 rounded-lg bg-soc-card border border-soc-cardBorder hover:border-cyan-500/50 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Document Sheet */}
      <div className="bg-soc-card/95 border border-soc-cardBorder rounded-2xl p-6 sm:p-10 max-w-5xl mx-auto shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        
        {/* Report Formal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-soc-cardBorder print:border-slate-300">
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-cyan-400 print:text-black" />
              <span className="text-2xl font-extrabold tracking-tight text-white print:text-black">ThreatOff SOC</span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1 print:text-slate-600">
              Cybersecurity Operations &bull; Insider Threat Defense Center
            </p>
          </div>

          <div className="text-right mt-4 sm:mt-0 font-mono text-xs text-slate-400 print:text-slate-600">
            <p>Report Ref: <strong className="text-cyan-400 print:text-black">RPT-2026-OCT-094</strong></p>
            <p>Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
            <p>Classification: <strong className="text-rose-400 print:text-rose-700">RESTRICTED - SOC TIER 2+</strong></p>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="py-6 border-b border-soc-cardBorder print:border-slate-300">
          <h2 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold mb-3 print:text-blue-800">
            1. Executive Threat Posture Summary
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed print:text-slate-800">
            During the monitored evaluation interval, <strong>ThreatOff</strong> analyzed <strong>5,021 enterprise activity logs</strong> across 6 core departments. The machine learning engine flagged <strong>253 anomalous events</strong> exceeding the 50.0% behavioral risk threshold, representing a <strong>5.03% threat prevalence</strong> across the enterprise workforce.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-soc-surface border border-soc-cardBorder print:bg-slate-100 print:border-slate-300">
              <span className="text-[10px] font-mono text-slate-400 print:text-slate-600">Total Monitored Logs</span>
              <p className="text-lg font-bold font-mono text-white print:text-black">5,021</p>
            </div>
            <div className="p-3 rounded-lg bg-soc-surface border border-soc-cardBorder print:bg-slate-100 print:border-slate-300">
              <span className="text-[10px] font-mono text-slate-400 print:text-slate-600">Active Threats Flagged</span>
              <p className="text-lg font-bold font-mono text-rose-400 print:text-red-700">253</p>
            </div>
            <div className="p-3 rounded-lg bg-soc-surface border border-soc-cardBorder print:bg-slate-100 print:border-slate-300">
              <span className="text-[10px] font-mono text-slate-400 print:text-slate-600">Model ROC-AUC</span>
              <p className="text-lg font-bold font-mono text-cyan-400 print:text-black">0.8401</p>
            </div>
            <div className="p-3 rounded-lg bg-soc-surface border border-soc-cardBorder print:bg-slate-100 print:border-slate-300">
              <span className="text-[10px] font-mono text-slate-400 print:text-slate-600">Active Investigations</span>
              <p className="text-lg font-bold font-mono text-amber-400 print:text-amber-700">4 Cases</p>
            </div>
          </div>
        </div>

        {/* Section 2: Department Vulnerability Analysis */}
        <div className="py-6 border-b border-soc-cardBorder print:border-slate-300">
          <h2 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold mb-3 print:text-blue-800">
            2. Departmental Risk Exposure
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed mb-4 print:text-slate-800">
            IT and Finance exhibited the highest proportion of high-severity flags due to privileged system access, sensitive file query volume, and removable media connections.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
            {(data?.department_distribution || []).map((d, i) => (
              <div key={i} className="p-3 rounded-lg bg-soc-surface border border-soc-cardBorder print:bg-slate-50 print:border-slate-300">
                <div className="flex justify-between text-white font-semibold print:text-black">
                  <span>{d.department}</span>
                  <span className="text-rose-400 print:text-red-700">{d.threat_count} Flags</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 print:text-slate-600">
                  <span>Avg Risk:</span>
                  <span>{d.avg_risk}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: High-Priority Incident Ledger */}
        <div className="py-6 border-b border-soc-cardBorder print:border-slate-300">
          <h2 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold mb-3 print:text-blue-800">
            3. Priority Incident Investigation Ledger
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono print:text-[10px]">
              <thead>
                <tr className="border-b border-soc-cardBorder text-slate-400 print:text-slate-600">
                  <th className="py-2">Alert ID</th>
                  <th className="py-2">Employee</th>
                  <th className="py-2">Dept</th>
                  <th className="py-2">Risk %</th>
                  <th className="py-2">Primary Anomalies</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soc-cardBorder/40 print:divide-slate-200">
                {alerts.slice(0, 5).map((a) => (
                  <tr key={a.id}>
                    <td className="py-2 text-cyan-400 print:text-black font-semibold">{a.alert_id}</td>
                    <td className="py-2 text-white print:text-black">{a.employee_id}</td>
                    <td className="py-2 text-slate-300 print:text-slate-700">{a.department}</td>
                    <td className="py-2 font-bold text-rose-400 print:text-red-700">{a.risk_score}%</td>
                    <td className="py-2 text-slate-400 print:text-slate-600 max-w-xs truncate">{a.top_factors}</td>
                    <td className="py-2 text-slate-300 print:text-slate-700">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Mitigation Recommendations */}
        <div className="pt-6">
          <h2 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold mb-3 print:text-blue-800">
            4. SOC Mitigation Recommendations
          </h2>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed print:text-slate-800">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 print:text-black font-bold">&bull;</span>
              <span><strong>Enforce Mandatory DLP Scans during Resignation Periods:</strong> 82% of high-severity alerts correlated with active resignation notices. Implement automated endpoint quarantine for bulk downloads during this window.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 print:text-black font-bold">&bull;</span>
              <span><strong>Restrict Unregistered USB Mass Storage:</strong> USB storage activity represents 19.4% of model weight. Restrict arbitrary USB device mounts via Active Directory Group Policy.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 print:text-black font-bold">&bull;</span>
              <span><strong>Off-Peak VPN Step-Up Authentication:</strong> Trigger multi-factor authentication (MFA) prompts whenever employees attempt file downloads exceeding 100 MB between 20:00 and 06:00.</span>
            </li>
          </ul>

          <div className="mt-8 pt-4 border-t border-soc-cardBorder print:border-slate-300 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>ThreatOff AI Defense Engine &bull; Enterprise SOC Build</span>
            <span>Investigator Sign-off: Shubham Thakur (CISO)</span>
          </div>
        </div>

      </div>

    </div>
  );
}
