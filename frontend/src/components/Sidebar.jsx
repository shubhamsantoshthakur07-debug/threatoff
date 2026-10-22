import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Activity,
  FileSpreadsheet,
  ShieldAlert,
  Users,
  Radio,
  Cpu,
  FileText,
  History,
  Sliders,
  Home,
  AlertTriangle
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, canConfigureSettings } = useAuth();

  const navItems = [
    { name: "Executive Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Manual Prediction", path: "/manual-prediction", icon: Activity },
    { name: "Dataset Analysis (CSV)", path: "/dataset-analysis", icon: FileSpreadsheet },
    { name: "Threat Alert Ledger", path: "/alerts", icon: ShieldAlert, badge: "3 New" },
    { name: "Employee Risk Directory", path: "/employee-risk", icon: Users },
    { name: "Behavioral Monitoring", path: "/monitoring", icon: Radio },
    { name: "Model Performance", path: "/model-performance", icon: Cpu, tag: "0.84 AUC" },
    { name: "Forensic Reports", path: "/reports", icon: FileText },
    { name: "Scan History", path: "/history", icon: History },
    { name: "SOC Security Settings", path: "/settings", icon: Sliders },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-soc-surface border-r border-soc-cardBorder flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Security Operations Console
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0 text-cyan-400/80" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold">
                    {item.badge}
                  </span>
                )}
                {item.tag && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {item.tag}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Portals
          </div>

          <NavLink
            to="/"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            <Home className="w-4 h-4 text-cyan-400/80" />
            <span>Public Showcase Portal</span>
          </NavLink>
        </div>

        {/* Bottom SOC badge & Academic Notice */}
        <div className="p-3 border-t border-soc-cardBorder/60 bg-soc-card/40">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-cyan-400 font-semibold">ThreatOff Core</span>
              <span className="font-mono text-[10px] text-slate-500">v1.0.0</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Enterprise Threat Detection Engine
            </p>
            <p className="text-[9px] text-slate-500 font-mono mt-0.5">
              Random Forest | SMOTE | AUC 0.8401
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
