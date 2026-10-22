import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Cpu, Activity, User, ChevronDown, Menu, X, LogOut, CheckCircle2 } from 'lucide-react';

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const { user, logout, ROLES, switchRole } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-soc-surface/95 backdrop-blur-md border-b border-soc-cardBorder">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Left Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 lg:hidden focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 via-cyan-400 to-blue-500 p-0.5 flex items-center justify-center shadow-cyan-glow group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-soc-bg rounded-[7px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white">Threat<span className="text-cyan-400">Off</span></span>
                <span className="px-1.5 py-0.2 text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-800/80 rounded">SOC</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight -mt-0.5 hidden sm:block">AI Insider Threat SOC</p>
            </div>
          </Link>
        </div>

        {/* Center Indicators (Academic & Model Status) */}
        <div className="hidden xl:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300">SOC Sensor Grid: <strong className="text-emerald-400">NOMINAL</strong></span>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">Model: <strong className="text-cyan-300">RandomForest</strong></span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">ROC-AUC: <strong className="text-cyan-300">0.8401</strong></span>
          </div>
        </div>

        {/* Right User & Actions */}
        <div className="flex items-center space-x-3">
          <Link
            to="/manual-prediction"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/25 transition-all shadow-cyan-glow font-mono"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Launch Analysis</span>
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors text-left"
            >
              <div className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs ${user.avatarBg || 'bg-cyan-500/20 text-cyan-400'}`}>
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                <p className="text-[10px] font-mono text-cyan-400">{user.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl bg-soc-card border border-soc-cardBorder shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-soc-cardBorder/60">
                  <p className="text-xs font-semibold text-white">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1 font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    Badge: {user.badge}
                  </span>
                </div>

                <div className="px-2 py-1.5">
                  <p className="px-2 py-1 text-[10px] font-mono uppercase text-slate-500">Quick Identity Switch</p>
                  <button
                    onClick={() => switchRole('ADMIN')}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-md flex items-center justify-between"
                  >
                    <span>Administrator</span>
                    {user.role === 'Administrator' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                  <button
                    onClick={() => switchRole('ANALYST')}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-md flex items-center justify-between"
                  >
                    <span>Security Analyst</span>
                    {user.role === 'Security Analyst' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                  <button
                    onClick={() => switchRole('VIEWER')}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-md flex items-center justify-between"
                  >
                    <span>Viewer</span>
                    {user.role === 'Viewer' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>

                <div className="border-t border-soc-cardBorder/60 px-2 pt-1">
                  <Link
                    to="/settings"
                    className="block px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-md"
                  >
                    System Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-md flex items-center space-x-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Reset Identity</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
