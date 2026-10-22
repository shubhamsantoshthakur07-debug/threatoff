import React, { useState } from 'react';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import StatCard from '../components/StatCard';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Database,
  Download,
  Search,
  Filter,
  RefreshCw,
  Sparkles
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
  Cell
} from 'recharts';

export default function DatasetAnalysisPage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const SAMPLE_CSV_CONTENT = `employee_id,department,offpeak_logins,failed_logins,file_access_count,sensitive_file_access,usb_usage_count,email_attachment_count,data_download_mb,previous_violations,days_since_last_promotion,is_resigning_soon
EMP00001,IT,1,0,28,1,2,4,12.06,0,737,0
EMP00002,Legal,1,0,33,0,0,1,96.64,0,976,0
EMP00003,R&D,1,0,21,5,0,4,88.86,0,1103,0
EMP00004,Sales,2,0,27,2,0,3,42.60,0,237,0
EMP00005,IT,6,3,40,9,4,10,320.50,1,900,1
EMP00006,Finance,1,2,33,3,1,2,52.76,0,712,0
EMP00007,HR,0,0,25,1,1,1,56.18,0,801,0
EMP00008,IT,2,0,24,4,1,1,26.33,1,654,0
EMP00009,R&D,5,2,38,7,3,6,280.40,1,850,1
EMP00010,Legal,0,0,19,0,0,1,14.80,0,410,0
EMP00011,Finance,0,1,22,2,0,2,45.00,0,300,0
EMP00012,HR,1,0,26,0,0,0,30.00,0,520,0
EMP00013,Sales,1,0,31,1,0,3,75.00,0,180,0
EMP00014,R&D,6,1,45,8,4,8,340.00,0,1200,0
EMP00015,IT,0,0,20,1,0,2,25.00,0,290,0
EMP00016,Finance,4,3,40,9,3,7,410.00,1,600,1
EMP00017,Sales,0,0,18,0,0,1,15.00,0,210,0
EMP00018,Finance,5,4,50,11,4,12,540.00,1,850,1
EMP00019,HR,0,0,15,0,0,0,12.00,0,150,0
EMP00020,Legal,1,0,22,1,0,1,33.00,0,450,0`;

  const handleFileUpload = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
      setResult(null);
      setError(null);
    }
  };

  const loadSampleBatch = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv' });
    const sampleFile = new File([blob], 'sample_test_batch.csv', { type: 'text/csv' });
    setFile(sampleFile);
    setFileName('sample_test_batch.csv (20 Test Records)');
    setResult(null);
    setError(null);
  };

  const handleProcessBatch = async () => {
    if (!file) {
      setError("Please select or load a CSV dataset first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.predictBatch(file);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Batch inference failed. Verify dataset format.");
    } finally {
      setLoading(false);
    }
  };

  // Filter batch records
  const filteredRecords = (result?.records || []).filter((r) => {
    const matchesSearch = r.employee_id.toLowerCase().includes(search.toLowerCase()) ||
                          r.department.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || r.department === deptFilter;
    const matchesStatus = statusFilter === 'All' ||
                          (statusFilter === 'Threat' && r.prediction === 'INSIDER THREAT') ||
                          (statusFilter === 'Normal' && r.prediction === 'NORMAL');
    return matchesSearch && matchesDept && matchesStatus;
  });

  const downloadResultsCSV = () => {
    if (!result?.records) return;
    const headers = [
      "employee_id", "department", "prediction", "risk_score", "review_priority",
      "offpeak_logins", "failed_logins", "sensitive_file_access", "usb_usage_count",
      "data_download_mb", "is_resigning_soon"
    ];
    const rows = result.records.map(r => [
      r.employee_id, r.department, r.prediction, r.risk_score, r.review_priority,
      r.offpeak_logins, r.failed_logins, r.sensitive_file_access, r.usb_usage_count,
      r.data_download_mb, r.is_resigning_soon
    ].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ThreatOff_Batch_Inference_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pieColors = ['#f43f5e', '#ef4444', '#f59e0b', '#10b981'];
  const pieData = result?.summary?.risk_breakdown
    ? Object.entries(result.summary.risk_breakdown).map(([name, value], i) => ({
        name,
        value,
        color: pieColors[i % pieColors.length]
      }))
    : [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-3 border-b border-soc-cardBorder">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
          <span>Batch Dataset Telemetry Ingestion &amp; Analysis</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ingest structured enterprise activity CSV logs to evaluate organizational threat prevalence and exfiltration vectors.
        </p>
      </div>

      {/* Upload & Quick Loader Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Upload Zone */}
        <div className="md:col-span-2 bg-soc-card/90 border border-dashed border-soc-cardBorder hover:border-cyan-500/50 rounded-xl p-6 text-center transition-all group">
          <input
            type="file"
            accept=".csv"
            id="csv-file-upload"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="csv-file-upload" className="cursor-pointer flex flex-col items-center">
            <UploadCloud className="w-10 h-10 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-white">
              {fileName ? <span className="text-cyan-300 font-mono">{fileName}</span> : "Click to select or drop CSV dataset"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports standard 11-column activity schemas (.csv up to 25 MB)
            </p>
          </label>
        </div>

        {/* 1-Click Sample Batch Loader */}
        <div className="bg-soc-card/90 border border-soc-cardBorder rounded-xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-cyan-400 font-semibold flex items-center gap-1 mb-1">
              <Sparkles className="w-4 h-4" /> Enterprise Demonstration Batch
            </span>
            <p className="text-xs text-slate-300 font-medium">Pre-formatted Test Batch</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              20 diverse enterprise activity records containing mixed normal patterns and suspicious exfiltration events.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSampleBatch}
            className="mt-3 px-3 py-2 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/25 text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 shadow-cyan-glow"
          >
            <span>Load Sample Batch</span>
          </button>
        </div>

      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between bg-soc-surface p-4 rounded-xl border border-soc-cardBorder">
        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Active Dataset: <strong className="text-white">{fileName || "None Selected"}</strong></span>
        </div>

        <button
          onClick={handleProcessBatch}
          disabled={!file || loading}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold font-mono text-xs tracking-wider shadow-cyan-glow flex items-center space-x-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Running Inference on Batch...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Execute Batch Analysis</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Batch Results View */}
      {result && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Batch Records Processed"
              value={result.summary.total_records}
              subtext="Parsed and validated"
              icon={Database}
              color="cyan"
            />
            <StatCard
              title="Threats Flagged"
              value={result.summary.threats_flagged}
              subtext={`${result.summary.threat_percentage}% of cohort`}
              icon={ShieldAlert}
              color="red"
            />
            <StatCard
              title="Mean Anomaly Risk"
              value={`${result.summary.average_risk_score}%`}
              subtext="Cohort baseline probability"
              icon={AlertTriangle}
              color="amber"
            />
            <StatCard
              title="Model Engine"
              value="Random Forest"
              subtext="SMOTE Balanced | 300 Trees"
              icon={CheckCircle2}
              color="emerald"
            />
          </div>

          {/* Visualizations Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 bg-soc-card border border-soc-cardBorder rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-1">Department Threat Breakdown</h3>
              <p className="text-[11px] text-slate-400 mb-4">Detected threats categorized by organizational division</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.summary.department_breakdown || []}>
                    <XAxis dataKey="department" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    <Bar dataKey="threat_count" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Flagged Threats" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-soc-card border border-soc-cardBorder rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">Risk Severity Split</h3>
                <p className="text-[11px] text-slate-400">Classification distribution across records</p>
              </div>
              <div className="h-44 my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                      {pieData.map((e, idx) => (
                        <Cell key={`c-${idx}`} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[10px] font-mono grid grid-cols-2 gap-2 pt-2 border-t border-soc-cardBorder/60">
                {pieData.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-slate-400 truncate">{p.name.split(' ')[0]}:</span>
                    <strong className="text-white ml-auto">{p.value}</strong>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Detailed Predictions Table */}
          <div className="bg-soc-card border border-soc-cardBorder rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-soc-cardBorder/60">
              <div>
                <h3 className="text-sm font-semibold text-white font-mono">
                  Batch Inference Telemetry Ledger ({filteredRecords.length} Records)
                </h3>
                <p className="text-[11px] text-slate-400">Detailed employee activity metrics with model verdicts</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search EMP ID or Dept..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

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

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
                >
                  <option value="All">All Verdicts</option>
                  <option value="Threat">Threats Only</option>
                  <option value="Normal">Normal Only</option>
                </select>

                {/* CSV Export */}
                <button
                  onClick={downloadResultsCSV}
                  className="px-3 py-1.5 rounded-lg bg-soc-surface border border-soc-cardBorder hover:border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all shadow-cyan-glow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-soc-cardBorder/80 text-slate-400">
                    <th className="py-2.5 px-3">Employee ID</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Verdict</th>
                    <th className="py-2.5 px-3">Risk Probability</th>
                    <th className="py-2.5 px-3">Sensitive Access</th>
                    <th className="py-2.5 px-3">USB Events</th>
                    <th className="py-2.5 px-3">Download (MB)</th>
                    <th className="py-2.5 px-3">Resigning?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soc-cardBorder/40">
                  {filteredRecords.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 text-cyan-400 font-semibold">{r.employee_id}</td>
                      <td className="py-2.5 px-3 text-slate-300">{r.department}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          r.prediction === 'INSIDER THREAT'
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/40'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {r.prediction}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <RiskBadge score={r.risk_score} level={r.review_priority} size="sm" />
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{r.sensitive_file_access}</td>
                      <td className="py-2.5 px-3 text-slate-300">{r.usb_usage_count}</td>
                      <td className="py-2.5 px-3 text-slate-300">{r.data_download_mb} MB</td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {r.is_resigning_soon === 1 ? (
                          <span className="text-rose-400 font-bold">YES</span>
                        ) : (
                          <span className="text-slate-500">NO</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
