import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RiskBadge from '../components/RiskBadge';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  User,
  MessageSquare,
  RefreshCw,
  Send,
  Lock
} from 'lucide-react';

export default function ThreatAlertsPage() {
  const { user, canModifyAlerts } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getAlerts({
        status: statusFilter,
        department: deptFilter,
        priority: priorityFilter
      });
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [statusFilter, deptFilter, priorityFilter]);

  const handleStatusChange = async (newStatus) => {
    if (!selectedAlert || !canModifyAlerts) return;
    setActionLoading(true);
    try {
      await api.updateAlertStatus(selectedAlert.alert_id, newStatus);
      setFeedbackMsg(`Alert marked as '${newStatus}'`);
      setSelectedAlert(prev => ({ ...prev, status: newStatus }));
      fetchAlerts();
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedAlert || !canModifyAlerts) return;
    setActionLoading(true);
    try {
      await api.addAlertNotes(selectedAlert.alert_id, newNote.trim(), user.name);
      const updatedNotes = selectedAlert.notes
        ? `${selectedAlert.notes}\n[${new Date().toLocaleTimeString()} - ${user.name}]: ${newNote.trim()}`
        : `[${new Date().toLocaleTimeString()} - ${user.name}]: ${newNote.trim()}`;
      setSelectedAlert(prev => ({ ...prev, notes: updatedNotes }));
      setNewNote('');
      fetchAlerts();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    const q = search.toLowerCase();
    return a.alert_id.toLowerCase().includes(q) ||
           a.employee_id.toLowerCase().includes(q) ||
           a.department.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-soc-cardBorder">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <span>Threat Alert Ledger &amp; Incident Triage</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Human-in-the-loop investigation workflow for high-risk behavioral anomalies detected by the AI engine.
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          className="px-3 py-1.5 rounded-lg bg-soc-card border border-soc-cardBorder hover:border-slate-600 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-soc-card/80 border border-soc-cardBorder rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter by Alert or EMP ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
          >
            <option value="All">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
            <option value="False Positive">False Positive</option>
          </select>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
          >
            <option value="All">All Departments</option>
            {["IT", "Finance", "HR", "Sales", "R&D", "Legal"].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing <strong className="text-cyan-400">{filteredAlerts.length}</strong> active alerts
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-soc-card border border-soc-cardBorder rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-soc-cardBorder/80 bg-slate-900/60 text-slate-400">
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Subject EMP</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Threat Score</th>
                <th className="py-3 px-4">Primary Anomalies</th>
                <th className="py-3 px-4">Triage State</th>
                <th className="py-3 px-4">Detected</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soc-cardBorder/40">
              {filteredAlerts.map((alert) => (
                <tr
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                    selectedAlert?.alert_id === alert.alert_id ? 'bg-cyan-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-cyan-400 font-semibold">{alert.alert_id}</td>
                  <td className="py-3 px-4 text-white font-medium">{alert.employee_id}</td>
                  <td className="py-3 px-4 text-slate-300">{alert.department}</td>
                  <td className="py-3 px-4">
                    <RiskBadge score={alert.risk_score} level={alert.review_priority} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-slate-400 max-w-xs truncate" title={alert.top_factors}>
                    {alert.top_factors || "Off-peak access & data transfer"}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      alert.status === 'Resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : alert.status === 'Under Review'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : alert.status === 'False Positive'
                        ? 'bg-slate-700/30 text-slate-400 border-slate-600/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{alert.detected_at}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAlert(alert);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px] transition-colors"
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investigation Triage Modal / Drawer */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-soc-card border border-soc-cardBorder rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-soc-cardBorder/60">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">
                  Incident Investigation Case File
                </span>
                <h3 className="text-xl font-bold font-mono text-white mt-0.5">
                  {selectedAlert.alert_id} &bull; {selectedAlert.employee_id}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Department: <strong className="text-slate-200">{selectedAlert.department}</strong> | Detected: {selectedAlert.detected_at}
                </p>
              </div>

              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                &times;
              </button>
            </div>

            {feedbackMsg && (
              <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            {/* Score & Factors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-soc-surface p-4 rounded-xl border border-soc-cardBorder">
                <span className="text-xs font-mono text-slate-400">Assessed Risk Score</span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-3xl font-extrabold font-mono text-white">
                    {selectedAlert.risk_score}%
                  </span>
                  <RiskBadge score={selectedAlert.risk_score} level={selectedAlert.review_priority} />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Current State: <strong className="text-cyan-400">{selectedAlert.status}</strong></p>
              </div>

              <div className="bg-soc-surface p-4 rounded-xl border border-soc-cardBorder">
                <span className="text-xs font-mono text-slate-400">Top Suspicious Indicators</span>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  {selectedAlert.top_factors || "High sensitive files, USB usage, off-peak logins"}
                </p>
              </div>
            </div>

            {/* Status Transition Buttons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-slate-300 font-semibold">
                  Triage State Transition
                </label>
                {!canModifyAlerts && (
                  <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Viewer (Read-Only)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={!canModifyAlerts || actionLoading}
                  onClick={() => handleStatusChange('Under Review')}
                  className={`p-2.5 rounded-lg border font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    selectedAlert.status === 'Under Review'
                      ? 'bg-blue-500/30 text-blue-300 border-blue-500 shadow-cyan-glow'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-blue-400 disabled:opacity-40'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Under Review</span>
                </button>

                <button
                  type="button"
                  disabled={!canModifyAlerts || actionLoading}
                  onClick={() => handleStatusChange('Resolved')}
                  className={`p-2.5 rounded-lg border font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    selectedAlert.status === 'Resolved'
                      ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-400 disabled:opacity-40'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolved</span>
                </button>

                <button
                  type="button"
                  disabled={!canModifyAlerts || actionLoading}
                  onClick={() => handleStatusChange('False Positive')}
                  className={`p-2.5 rounded-lg border font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    selectedAlert.status === 'False Positive'
                      ? 'bg-slate-700 text-slate-200 border-slate-500'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 disabled:opacity-40'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>False Positive</span>
                </button>
              </div>
            </div>

            {/* Investigator Notes Thread */}
            <div>
              <label className="text-xs font-mono uppercase text-slate-300 font-semibold block mb-2">
                Forensic Investigation Notes
              </label>

              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs font-mono text-slate-300 min-h-[90px] max-h-40 overflow-y-auto whitespace-pre-wrap">
                {selectedAlert.notes ? selectedAlert.notes : <span className="text-slate-500 italic">No notes logged yet.</span>}
              </div>

              {canModifyAlerts && (
                <form onSubmit={handleAddNote} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter investigator observations or interview findings..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={actionLoading || !newNote.trim()}
                    className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-cyan-glow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Append Note</span>
                  </button>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-soc-cardBorder/60 flex items-center justify-end">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
              >
                Close Case File
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
