import React, { useState } from 'react';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Send,
  Sparkles,
  Info,
  CheckCircle,
  FileText,
  User,
  Building,
  HardDrive,
  Mail,
  DownloadCloud,
  History,
  Lock
} from 'lucide-react';

export default function ManualPredictionPage() {
  const PRESETS = {
    highRisk: {
      name: "Critical Exfiltration Profile",
      desc: "Simulates departing engineer copying sensitive IP via USB during off-peak hours",
      data: {
        employee_id: "EMP_EXFIL_DEMO",
        department: "IT",
        offpeak_logins: 7,
        failed_logins: 3,
        file_access_count: 55,
        sensitive_file_access: 11,
        usb_usage_count: 5,
        email_attachment_count: 9,
        data_download_mb: 420.0,
        previous_violations: 1,
        days_since_last_promotion: 780,
        is_resigning_soon: 1
      }
    },
    benign: {
      name: "Normal Baseline Employee",
      desc: "Standard daily activity within expected operational parameters",
      data: {
        employee_id: "EMP_BENIGN_DEMO",
        department: "HR",
        offpeak_logins: 0,
        failed_logins: 0,
        file_access_count: 20,
        sensitive_file_access: 1,
        usb_usage_count: 0,
        email_attachment_count: 2,
        data_download_mb: 35.0,
        previous_violations: 0,
        days_since_last_promotion: 320,
        is_resigning_soon: 0
      }
    },
    suspiciousFinance: {
      name: "Finance Data Spike",
      desc: "Elevated financial downloads and off-peak authentication with no USB",
      data: {
        employee_id: "EMP_FIN_DEMO",
        department: "Finance",
        offpeak_logins: 5,
        failed_logins: 2,
        file_access_count: 42,
        sensitive_file_access: 6,
        usb_usage_count: 1,
        email_attachment_count: 5,
        data_download_mb: 310.0,
        previous_violations: 0,
        days_since_last_promotion: 950,
        is_resigning_soon: 0
      }
    }
  };

  const [formData, setFormData] = useState(PRESETS.highRisk.data);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : (type === 'number' ? Number(value) : value)
    }));
  };

  const loadPreset = (presetKey) => {
    setFormData(PRESETS[presetKey].data);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.predictManual(formData);
      setResult(response);
    } catch (err) {
      console.error(err);
      setError(err.message || "Prediction execution failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-3 border-b border-soc-cardBorder">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          <span>Manual Insider Threat Risk Predictor</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Perform ad-hoc hypothesis evaluation by entering 11 behavioral telemetry vectors into the 300-tree Random Forest engine.
        </p>
      </div>

      {/* Preset Scenarios Selector */}
      <div className="bg-soc-card/70 border border-soc-cardBorder rounded-xl p-4">
        <span className="text-xs font-mono uppercase text-cyan-400 font-semibold flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-4 h-4" /> Quick-Test Scenario Presets
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(PRESETS).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => loadPreset(key)}
              className="text-left p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all text-xs"
            >
              <p className="font-semibold text-white mb-1 flex items-center justify-between">
                <span>{item.name}</span>
                <span className="text-[10px] text-cyan-400 font-mono">Load &rarr;</span>
              </p>
              <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form on Left, Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-soc-card/90 border border-soc-cardBorder rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider pb-2 border-b border-soc-cardBorder/60 flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" /> Telemetry Vector Inputs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Employee ID */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Employee Reference ID</label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Corporate Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              >
                {["IT", "Finance", "HR", "Sales", "R&D", "Legal"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Offpeak Logins */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Off-Peak Logins (Night/Weekend)</label>
              <input
                type="number"
                min="0"
                name="offpeak_logins"
                value={formData.offpeak_logins}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Failed Logins */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Failed Authentication Attempts</label>
              <input
                type="number"
                min="0"
                name="failed_logins"
                value={formData.failed_logins}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Total File Access */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Total File Access Count</label>
              <input
                type="number"
                min="0"
                name="file_access_count"
                value={formData.file_access_count}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Sensitive File Access */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 text-cyan-400 font-semibold">
                Sensitive File Access Count *
              </label>
              <input
                type="number"
                min="0"
                name="sensitive_file_access"
                value={formData.sensitive_file_access}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-cyan-500/50 rounded-lg px-3 py-2 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-500 font-mono">Model Importance: 22.8%</span>
            </div>

            {/* USB Usage Count */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 text-cyan-400 font-semibold">
                USB Storage Usage Count *
              </label>
              <input
                type="number"
                min="0"
                name="usb_usage_count"
                value={formData.usb_usage_count}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-cyan-500/50 rounded-lg px-3 py-2 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-500 font-mono">Model Importance: 19.4%</span>
            </div>

            {/* Email Attachment Count */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Email Attachments Dispatched</label>
              <input
                type="number"
                min="0"
                name="email_attachment_count"
                value={formData.email_attachment_count}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Data Download Volume (MB) */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 text-cyan-400 font-semibold">
                Data Download Volume (MB) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="data_download_mb"
                value={formData.data_download_mb}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-cyan-500/50 rounded-lg px-3 py-2 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-500 font-mono">Model Importance: 12.8%</span>
            </div>

            {/* Previous Violations */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Previous Security Infractions</label>
              <input
                type="number"
                min="0"
                name="previous_violations"
                value={formData.previous_violations}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Days Since Last Promotion */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Days Since Promotion (Stagnation)</label>
              <input
                type="number"
                min="0"
                name="days_since_last_promotion"
                value={formData.days_since_last_promotion}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Resigning Soon Checkbox */}
            <div className="flex items-center space-x-3 pt-6">
              <input
                type="checkbox"
                id="is_resigning_soon"
                name="is_resigning_soon"
                checked={formData.is_resigning_soon === 1}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-soc-bg"
              />
              <label htmlFor="is_resigning_soon" className="text-xs font-mono text-slate-300 cursor-pointer">
                Resignation Notice Submitted
              </label>
            </div>

          </div>

          <div className="pt-4 border-t border-soc-cardBorder/60 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">
              * Top feature weights influencing decision trees
            </span>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold font-mono text-xs tracking-wider shadow-cyan-glow flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Evaluating Telemetry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Execute Risk Prediction</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Prediction Output Results Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-mono mb-4 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {result ? (
            <div className="bg-soc-card border border-soc-cardBorder rounded-xl p-5 space-y-5 animate-in fade-in shadow-2xl">
              
              {/* Verdict Header */}
              <div className="text-center pb-4 border-b border-soc-cardBorder/60">
                <span className="text-[10px] font-mono uppercase text-slate-400">Random Forest Inference Result</span>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <RiskBadge score={result.risk_score} level={result.review_priority} size="lg" />
                </div>
                <h3 className={`text-2xl font-black font-mono tracking-tight mt-2 ${
                  result.prediction === 'INSIDER THREAT' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {result.prediction}
                </h3>
              </div>

              {/* Dial & Score */}
              <div className="bg-soc-surface/80 rounded-xl p-4 border border-soc-cardBorder text-center">
                <span className="text-xs font-mono text-slate-400">Anomaly Threat Probability</span>
                <p className="text-4xl font-extrabold font-mono text-cyan-400 mt-1">
                  {result.risk_score}%
                </p>
                <div className="w-full bg-slate-800 rounded-full h-2.5 mt-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      result.risk_score >= 80 ? 'bg-rose-500' :
                      result.risk_score >= 65 ? 'bg-orange-500' :
                      result.risk_score >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${result.risk_score}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>0% (Benign)</span>
                  <span>50% (Threshold)</span>
                  <span>100% (Critical)</span>
                </div>
              </div>

              {/* Contributing Risk Factors */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-300 font-semibold mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" /> Primary Driving Factors
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.contributing_factors?.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded border border-slate-800">
                      <span className="text-cyan-400 font-mono mt-0.5">&bull;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SOC Triage Recommendation */}
              <div className="bg-cyan-950/30 border border-cyan-800/60 rounded-xl p-3.5 text-xs">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold block mb-1">
                  SOC Recommended Action
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {result.recommended_action || "Log into triage ledger and conduct human peer review before escalating."}
                </p>
                {result.alert_id && (
                  <span className="inline-block mt-2 font-mono text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    Auto-dispatched to Alert Ledger: {result.alert_id}
                  </span>
                )}
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-soc-card/40 border border-dashed border-soc-cardBorder rounded-xl flex flex-col items-center justify-center p-8 text-center">
              <Activity className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-sm font-semibold text-slate-300 font-mono">Awaiting Telemetry Execution</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Select a preset scenario above or enter custom attributes, then click "Execute Risk Prediction" to run inference.
              </p>
            </div>
          )}

          {/* Ethical AI Notice */}
          <div className="mt-4 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] text-slate-500 leading-relaxed font-mono">
            <strong>Ethical AI Disclosure:</strong> ThreatOff models calculate risk metrics from historical behavioral divergence. High probabilities do not equate to criminal guilt; human SOC oversight is strictly mandated.
          </div>
        </div>

      </div>

    </div>
  );
}
