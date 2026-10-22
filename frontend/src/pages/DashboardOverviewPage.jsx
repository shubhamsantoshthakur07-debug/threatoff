import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import RiskBadge from '../components/RiskBadge';
import {
  ShieldAlert,
  Database,
  Activity,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';

export default function DashboardOverviewPage() {
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [overviewData, alertsData] = await Promise.all([
        api.getOverview(),
        api.getAlerts()
      ]);
      setData(overviewData);
      setAlerts(alertsData.slice(0, 5));
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Loading SOC Telemetry Stream...</p>
        </div>
      </div>
    );
  }

  // Format data for Risk Pie Chart
  const pieColors = ['#f43f5e', '#ef4444', '#f59e0b', '#10b981'];
  const pieData = Object.entries(data.risk_breakdown || {}).map(([name, value], idx) => ({
    name,
    value,
    color: pieColors[idx % pieColors.length]
  }));

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-soc-cardBorder">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            <span>SOC Executive Command Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time insider threat detection telemetry, anomalous behavior indicators, and triage pipeline.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchDashboardData}
            className="px-3 py-1.5 rounded-lg bg-soc-card border border-soc-cardBorder text-slate-300 hover:text-white hover:border-slate-600 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Stream</span>
          </button>
          <Link
            to="/manual-prediction"
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 shadow-cyan-glow transition-all"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Manual Predict</span>
          </Link>
          <Link
            to="/dataset-analysis"
            className="px-3 py-1.5 rounded-lg bg-soc-card border border-soc-cardBorder hover:border-cyan-500/40 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Batch CSV</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Employees"
          value={data.kpis.total_scanned_records?.toLocaleString() || "5,021"}
          subtext="Processed in telemetry registry"
          icon={Database}
          color="cyan"
        />
        <StatCard
          title="Flagged Threats"
          value={data.kpis.total_threats_flagged || "253"}
          subtext="Exceeded critical risk threshold"
          icon={ShieldAlert}
          color="red"
          trend={{ positive: false, text: "5.03% threat ratio" }}
        />
        <StatCard
          title="Active Investigations"
          value={data.kpis.active_investigations || "4"}
          subtext={`${data.kpis.pending_alerts} pending, ${data.kpis.under_review} in review`}
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="Avg Anomaly Risk"
          value={`${data.kpis.avg_threat_risk}%`}
          subtext="Mean probability among flagged alerts"
          icon={TrendingUp}
          color="cyan"
        />
      </div>

      {/* Analytics Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Distribution Bar Chart */}
        <div className="lg:col-span-2 bg-soc-card/80 border border-soc-cardBorder rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Department Risk &amp; Threat Distribution</h2>
              <p className="text-[11px] text-slate-400">Total detected threats across enterprise units</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              6 Core Departments
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.department_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a44" vertical={false} />
                <XAxis dataKey="department" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="threat_count" name="Threat Count" fill="#00e5ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Breakdown Donut Chart */}
        <div className="bg-soc-card/80 border border-soc-cardBorder rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Risk Severity Distribution</h2>
            <p className="text-[11px] text-slate-400">Model predicted risk classification tiers</p>
          </div>

          <div className="h-52 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-soc-cardBorder/60 pt-3">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400 truncate">{item.name.split(' ')[0]}:</span>
                <strong className="text-white ml-auto">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 14-Day Activity & Anomaly Trend */}
      <div className="bg-soc-card/80 border border-soc-cardBorder rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">14-Day SOC Telemetry &amp; Anomaly Surge Trend</h2>
            <p className="text-[11px] text-slate-400">Temporal correlation between monitored activity, off-peak events, and anomalies</p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-mono text-slate-400 mt-2 sm:mt-0">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Scans</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" /> Anomalies</span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trend_timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a44" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Line yAxisId="left" type="monotone" dataKey="scanned" name="Scanned Telemetry" stroke="#00e5ff" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="anomalies" name="Flagged Anomalies" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Alerts Triage Queue Preview */}
      <div className="bg-soc-card/80 border border-soc-cardBorder rounded-xl p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-soc-cardBorder/60">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Priority Incident Triage Queue</span>
            </h2>
            <p className="text-[11px] text-slate-400">High-risk cases requiring human SOC investigator adjudication</p>
          </div>
          <Link
            to="/alerts"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Alerts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-soc-cardBorder/80 text-slate-400">
                <th className="py-2.5 px-3">Alert ID</th>
                <th className="py-2.5 px-3">Employee</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3">Top Risk Indicators</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soc-cardBorder/40">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 text-cyan-400 font-semibold">{alert.alert_id}</td>
                  <td className="py-3 px-3 text-white font-medium">{alert.employee_id}</td>
                  <td className="py-3 px-3 text-slate-300">{alert.department}</td>
                  <td className="py-3 px-3">
                    <RiskBadge score={alert.risk_score} level={alert.review_priority} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-slate-400 max-w-xs truncate" title={alert.top_factors}>
                    {alert.top_factors || "Off-peak logins & sensitive access"}
                  </td>
                  <td className="py-3 px-3">
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
                  <td className="py-3 px-3 text-right">
                    <Link
                      to="/alerts"
                      className="text-cyan-400 hover:text-cyan-300 underline font-medium text-[11px]"
                    >
                      Investigate
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
