import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import {
  Users,
  Search,
  Filter,
  ShieldAlert,
  UserX,
  FileText,
  HardDrive,
  Mail,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function EmployeeRiskPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [employeeDetail, setEmployeeDetail] = useState(null);

  const fetchEmployees = async (searchTerm = '') => {
    setLoading(true);
    try {
      const data = await api.getEmployees(searchTerm);
      setEmployees(data);
      if (data.length > 0 && !selectedEmployee) {
        loadDetail(data[0].employee_id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees('');
  }, []);

  const loadDetail = async (empId) => {
    setSelectedEmployee(empId);
    setDetailLoading(true);
    try {
      const detail = await api.getEmployeeDetail(empId);
      setEmployeeDetail(detail);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(search);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-3 border-b border-soc-cardBorder">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-cyan-400" />
          <span>Pseudonymous Employee Behavioral Risk Directory</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore individual employee telemetry profiles and multi-vector anomaly ratings to understand baseline divergence.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-soc-card/80 border border-soc-cardBorder rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search pseudonymous ID (e.g. EMP00005, EMP00018) or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/25 rounded-lg text-xs font-mono font-medium transition-all shadow-cyan-glow"
          >
            Search
          </button>
        </form>

        <div className="text-xs font-mono text-slate-400">
          Tracking <strong className="text-cyan-400">{employees.length}</strong> Subject Entities
        </div>
      </div>

      {/* Main Grid: Directory Table on Left, Drilldown on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Employee Table */}
        <div className="lg:col-span-7 bg-soc-card border border-soc-cardBorder rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-soc-cardBorder/60 bg-slate-900/60 flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase text-slate-300 font-semibold">
              Employee Telemetry Registry
            </h2>
            <span className="text-[10px] font-mono text-slate-500">Sorted by Anomaly Priority</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-soc-cardBorder/80 text-slate-400">
                  <th className="py-2.5 px-3">EMP ID</th>
                  <th className="py-2.5 px-3">Dept</th>
                  <th className="py-2.5 px-3">Sensitive Files</th>
                  <th className="py-2.5 px-3">USB Events</th>
                  <th className="py-2.5 px-3">Data MB</th>
                  <th className="py-2.5 px-3">Risk Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soc-cardBorder/40">
                {employees.map((emp) => (
                  <tr
                    key={emp.employee_id}
                    onClick={() => loadDetail(emp.employee_id)}
                    className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                      selectedEmployee === emp.employee_id ? 'bg-cyan-950/30' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-cyan-400 font-semibold">{emp.employee_id}</td>
                    <td className="py-3 px-3 text-slate-300">{emp.department}</td>
                    <td className="py-3 px-3 text-slate-300">{emp.sensitive_file_access}</td>
                    <td className="py-3 px-3 text-slate-300">{emp.usb_usage_count}</td>
                    <td className="py-3 px-3 text-slate-300">{emp.data_download_mb} MB</td>
                    <td className="py-3 px-3">
                      <RiskBadge score={emp.estimated_risk_score} level={emp.risk_level} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drilldown Inspector */}
        <div className="lg:col-span-5 bg-soc-card border border-soc-cardBorder rounded-xl p-5 flex flex-col justify-between">
          {detailLoading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
            </div>
          ) : employeeDetail ? (
            <div className="space-y-4">
              
              <div className="flex items-start justify-between pb-3 border-b border-soc-cardBorder/60">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Subject Profile</span>
                  <h3 className="text-xl font-bold font-mono text-white mt-0.5">
                    {employeeDetail.employee_id}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Department: <strong className="text-cyan-400">{employeeDetail.department}</strong>
                  </p>
                </div>
                <RiskBadge score={employeeDetail.risk_score} level={employeeDetail.risk_level} size="md" />
              </div>

              {/* Contributing Indicators */}
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block mb-2">
                  Key Behavioral Flags
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {employeeDetail.contributing_factors.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-900/80 p-2 rounded border border-slate-800">
                      <span className="text-rose-400 font-mono mt-0.5">&bull;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 11-Vector Telemetry Breakdown */}
              <div className="bg-soc-surface p-3.5 rounded-xl border border-soc-cardBorder space-y-2 text-xs font-mono">
                <span className="text-[10px] uppercase text-cyan-400 font-semibold block mb-1">
                  11-Vector Telemetry Snapshot
                </span>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Off-Peak Logins:</span>
                    <strong className="text-white">{employeeDetail.telemetry.offpeak_logins}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Failed Logins:</span>
                    <strong className="text-white">{employeeDetail.telemetry.failed_logins}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Total File Access:</span>
                    <strong className="text-white">{employeeDetail.telemetry.file_access_count}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400 text-rose-400">Sensitive Files:</span>
                    <strong className="text-rose-400">{employeeDetail.telemetry.sensitive_file_access}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400 text-rose-400">USB Storage:</span>
                    <strong className="text-rose-400">{employeeDetail.telemetry.usb_usage_count}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Attachments:</span>
                    <strong className="text-white">{employeeDetail.telemetry.email_attachment_count}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400 text-cyan-300">Data Download:</span>
                    <strong className="text-cyan-300">{employeeDetail.telemetry.data_download_mb} MB</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Prior Infractions:</span>
                    <strong className="text-white">{employeeDetail.telemetry.previous_violations}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Promotion Days:</span>
                    <strong className="text-white">{employeeDetail.telemetry.days_since_last_promotion}d</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Resignation:</span>
                    <strong className={employeeDetail.telemetry.is_resigning_soon ? "text-rose-400" : "text-emerald-400"}>
                      {employeeDetail.telemetry.is_resigning_soon ? "Notice Active" : "No"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Associated SOC Alert */}
              {employeeDetail.associated_alert && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-300 font-semibold">Active Alert in SOC Ledger:</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-white border border-slate-700">
                      {employeeDetail.associated_alert.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Alert Ref: {employeeDetail.associated_alert.alert_id}</p>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center text-slate-500 text-xs font-mono py-12">
              Select an employee record to inspect telemetry drilldown
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
