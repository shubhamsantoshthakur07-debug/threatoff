import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  History,
  FileSpreadsheet,
  Activity,
  Calendar,
  User,
  Search,
  Filter,
  RefreshCw,
  Database
} from 'lucide-react';

export default function PredictionHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [search, setSearch] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.analysis_id.toLowerCase().includes(search.toLowerCase()) ||
                          item.dataset_name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || item.analysis_type.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-soc-cardBorder">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Analysis &amp; Prediction Audit Ledger</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical log of all manual and batch telemetry evaluations recorded by the system.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="px-3 py-1.5 rounded-lg bg-soc-card border border-soc-cardBorder hover:border-slate-600 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-soc-card/80 border border-soc-cardBorder rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search scan ID or dataset..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
          >
            <option value="All">All Ingestion Types</option>
            <option value="Batch">Batch Dataset</option>
            <option value="Manual">Manual Analysis</option>
          </select>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing <strong className="text-cyan-400">{filteredHistory.length}</strong> historical runs
        </div>
      </div>

      {/* History Table */}
      <div className="bg-soc-card border border-soc-cardBorder rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-soc-cardBorder/80 bg-slate-900/60 text-slate-400">
                <th className="py-3 px-4">Scan ID</th>
                <th className="py-3 px-4">Ingestion Type</th>
                <th className="py-3 px-4">Dataset / Entity</th>
                <th className="py-3 px-4">Records</th>
                <th className="py-3 px-4">Threats Caught</th>
                <th className="py-3 px-4">Mean Risk %</th>
                <th className="py-3 px-4">Model Engine</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soc-cardBorder/40">
              {filteredHistory.map((h) => (
                <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-cyan-400 font-semibold">{h.analysis_id}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {h.analysis_type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white font-medium">{h.dataset_name}</td>
                  <td className="py-3 px-4 text-slate-300">{h.record_count}</td>
                  <td className="py-3 px-4 text-rose-400 font-bold">{h.threat_count}</td>
                  <td className="py-3 px-4 text-cyan-300">{h.avg_risk_score}%</td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">{h.model_version}</td>
                  <td className="py-3 px-4 text-slate-300">{h.created_by}</td>
                  <td className="py-3 px-4 text-right text-slate-500 text-[11px]">{h.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
