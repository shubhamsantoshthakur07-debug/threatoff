import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sliders,
  Shield,
  Clock,
  HardDrive,
  Users,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RefreshCw,
  Terminal,
  Activity
} from 'lucide-react';

export default function SettingsPage() {
  const { user, canConfigureSettings } = useAuth();
  const [settings, setSettings] = useState({
    threat_threshold: 50.0,
    data_retention_days: 90,
    max_upload_size_mb: 25
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [settingsData, auditData] = await Promise.all([
          api.getSettings(),
          api.getAuditLogs()
        ]);
        setSettings(settingsData);
        setAuditLogs(auditData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!canConfigureSettings) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      await api.updateSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-3 border-b border-soc-cardBorder">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Sliders className="w-6 h-6 text-cyan-400" />
          <span>SOC Security Policies &amp; Audit Logs</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure algorithmic risk thresholds, data retention parameters, and inspect privileged administrative audit trails.
        </p>
      </div>

      {!canConfigureSettings && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
          <Lock className="w-4 h-4 shrink-0" />
          <span>You are logged in as <strong>{user.role}</strong> (Read-Only). Switch to <strong>Administrator</strong> in the top toolbar to modify settings.</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>System security thresholds updated and applied to inference pipeline successfully.</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Settings Form */}
        <form onSubmit={handleSave} className="lg:col-span-6 bg-soc-card border border-soc-cardBorder rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-soc-cardBorder/60">
            <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Threat Classification Parameters
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-700">
              Live Core
            </span>
          </div>

          {/* Threshold Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Threat Classification Threshold
              </label>
              <span className="text-sm font-mono font-bold text-cyan-400">
                {settings.threat_threshold}%
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="80"
              step="1"
              disabled={!canConfigureSettings}
              value={settings.threat_threshold}
              onChange={(e) => setSettings({ ...settings, threat_threshold: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>30% (Aggressive Alerting)</span>
              <span>50% (Standard)</span>
              <span>80% (Conservative)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              When an employee's predicted anomaly probability exceeds this value, an incident case is automatically logged to the SOC triage ledger.
            </p>
          </div>

          {/* Retention */}
          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
              Telemetry Retention Window (Days)
            </label>
            <input
              type="number"
              min="30"
              max="365"
              disabled={!canConfigureSettings}
              value={settings.data_retention_days}
              onChange={(e) => setSettings({ ...settings, data_retention_days: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 disabled:opacity-40"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Automatically purge raw user activity logs older than specified days to comply with data privacy policies.
            </p>
          </div>

          {/* Max Upload Size */}
          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
              Maximum Batch CSV File Size (MB)
            </label>
            <input
              type="number"
              min="5"
              max="100"
              disabled={!canConfigureSettings}
              value={settings.max_upload_size_mb}
              onChange={(e) => setSettings({ ...settings, max_upload_size_mb: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 disabled:opacity-40"
            />
          </div>

          {/* Model Engine Specifications */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs font-mono">
            <span className="text-[10px] text-cyan-400 uppercase font-semibold block">Underlying Model Specification</span>
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span className="text-slate-400">Model Engine:</span>
              <span>Scikit-Learn Random Forest</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span className="text-slate-400">Ensemble Estimators:</span>
              <span>300 Trees (max depth 10)</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span className="text-slate-400">Class Balancer:</span>
              <span>SMOTE Synthetic Sampling</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span className="text-slate-400">Verified Test ROC-AUC:</span>
              <strong className="text-cyan-400">0.8401</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-soc-cardBorder/60 flex justify-end">
            <button
              type="submit"
              disabled={!canConfigureSettings || saving}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold font-mono text-xs tracking-wider shadow-cyan-glow flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              {saving ? <span>Updating Policies...</span> : <span>Save System Policies</span>}
            </button>
          </div>
        </form>

        {/* Audit Log Ledger */}
        <div className="lg:col-span-6 bg-soc-card border border-soc-cardBorder rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-soc-cardBorder/60 mb-4">
              <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Privileged Security Audit Ledger</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400">Immutable Log</span>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-1 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-semibold">{log.action}</span>
                    <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-snug">{log.details}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Actor: {log.user_email}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-soc-cardBorder/60 text-[10px] font-mono text-slate-500 text-right">
            System tamper-evident logging active &bull; ThreatOff SOC v1.0
          </div>
        </div>

      </div>

    </div>
  );
}
