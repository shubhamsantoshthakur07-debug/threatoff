import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Radio,
  Clock,
  HardDrive,
  Download,
  AlertTriangle,
  Shield,
  Activity,
  Terminal,
  RefreshCw,
  Sliders
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

export default function ActivityMonitoringPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonitoring = async () => {
      setLoading(true);
      try {
        const res = await api.getMonitoring();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMonitoring();
  }, []);

  const simulatedStream = [
    { time: "11:04:12", emp: "EMP00005", dept: "IT", action: "USB_STORAGE_MOUNTED", details: "SanDisk 64GB inserted during notice period", severity: "critical" },
    { time: "11:02:40", emp: "EMP00018", dept: "Finance", action: "LARGE_DATA_EXPORT", details: "Exported 420 MB payroll database backup", severity: "high" },
    { time: "10:59:15", emp: "EMP00002", dept: "Legal", action: "SENSITIVE_DOC_VIEW", details: "NDA_Enterprise_2026_Final.docx", severity: "low" },
    { time: "10:48:30", emp: "EMP00014", dept: "R&D", action: "OFFPEAK_REMOTE_LOGIN", details: "VPN tunnel opened from IP 192.168.1.104", severity: "medium" },
    { time: "10:35:10", emp: "EMP00007", dept: "HR", action: "EMPLOYEE_RECORD_QUERY", details: "Viewed onboarding files for 12 recruits", severity: "low" },
    { time: "10:20:00", emp: "EMP00009", dept: "R&D", action: "FAILED_LOGIN_LIMIT", details: "3 consecutive invalid credentials on core Git repo", severity: "medium" }
  ];

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Synchronizing SOC Sensors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-3 border-b border-soc-cardBorder">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Radio className="w-6 h-6 text-cyan-400 animate-radar-pulse" />
          <span>Real-Time Behavioral Sensor Monitoring</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          24-hour temporal anomaly distribution, live access streams, and vector sensor thresholds.
        </p>
      </div>

      {/* Monitored Vector Sensors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {data.monitored_vectors.map((vec, i) => (
          <div key={i} className="bg-soc-card/90 border border-soc-cardBorder p-3.5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">Active Sensor</span>
            </div>
            <h4 className="text-xs font-semibold text-white leading-tight">{vec.vector}</h4>
            <p className="text-[10px] text-slate-400 font-mono mt-2">Trigger: {vec.threshold}</p>
          </div>
        ))}
      </div>

      {/* 24-Hour Telemetry Volume Chart */}
      <div className="bg-soc-card border border-soc-cardBorder rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">24-Hour Hourly Telemetry &amp; Off-Peak Surge Monitor</h2>
            <p className="text-[11px] text-slate-400">Contrasting normal business hour logons with anomalous off-peak volume</p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-mono text-slate-400 mt-2 sm:mt-0">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Standard Sessions</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" /> Off-Peak Surges</span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.hourly_distribution}>
              <defs>
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a44" vertical={false} />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="normal_logins" stroke="#00e5ff" fillOpacity={1} fill="url(#cyanGrad)" name="Standard Sessions" />
              <Area type="monotone" dataKey="offpeak_logins" stroke="#f43f5e" fillOpacity={1} fill="url(#roseGrad)" name="Off-Peak Sessions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Real-Time Live Telemetry Event Feed */}
      <div className="bg-soc-card border border-soc-cardBorder rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-soc-cardBorder/60 mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white font-mono">Live SOC Sensor Ingestion Feed</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            AUTO-POLLING (1 SEC)
          </span>
        </div>

        <div className="space-y-2">
          {simulatedStream.map((evt, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-slate-500 text-[11px]">{evt.time}</span>
                <span className="text-cyan-400 font-bold">{evt.emp}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">{evt.dept}</span>
                <span className="text-white font-semibold">{evt.action}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-slate-400 text-[11px] truncate max-w-xs">{evt.details}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                  evt.severity === 'critical' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                  evt.severity === 'high' ? 'bg-red-500/15 text-red-400 border-red-500/30' :
                  evt.severity === 'medium' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {evt.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
