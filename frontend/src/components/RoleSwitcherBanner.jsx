import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Eye, Terminal } from 'lucide-react';

export default function RoleSwitcherBanner() {
  const { user, switchRole } = useAuth();

  return (
    <div className="bg-gradient-to-r from-soc-surface via-soc-card to-soc-surface border-b border-soc-cardBorder px-4 py-2 flex flex-wrap items-center justify-between text-xs text-slate-300">
      <div className="flex items-center space-x-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="font-mono text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5" /> SOC Evaluation Toolbar:
        </span>
        <span className="text-slate-400 hidden sm:inline">
          Active Identity: <strong className="text-white">{user.name}</strong> ({user.title})
        </span>
      </div>

      <div className="flex items-center space-x-1.5 my-1 sm:my-0">
        <span className="text-slate-400 mr-1 hidden md:inline">Switch Role:</span>
        <button
          onClick={() => switchRole('ADMIN')}
          className={`px-2.5 py-1 rounded font-medium transition-all flex items-center space-x-1 border ${
            user.role === 'Administrator'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-cyan-glow'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Administrator</span>
        </button>

        <button
          onClick={() => switchRole('ANALYST')}
          className={`px-2.5 py-1 rounded font-medium transition-all flex items-center space-x-1 border ${
            user.role === 'Security Analyst'
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/60 shadow-cyan-glow'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Security Analyst</span>
        </button>

        <button
          onClick={() => switchRole('VIEWER')}
          className={`px-2.5 py-1 rounded font-medium transition-all flex items-center space-x-1 border ${
            user.role === 'Viewer'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Viewer</span>
        </button>
      </div>
    </div>
  );
}
