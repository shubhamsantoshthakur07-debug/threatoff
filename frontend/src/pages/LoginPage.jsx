import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Eye,
  Key,
  Terminal
} from 'lucide-react';

export default function LoginPage() {
  const { loginAs, ROLES } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('shubham.thakur@threatoff.soc');
  const [password, setPassword] = useState('threatoff2026');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email.includes('analyst')) {
        loginAs(ROLES.ANALYST);
      } else if (email.includes('viewer')) {
        loginAs(ROLES.VIEWER);
      } else {
        loginAs(ROLES.ADMIN);
      }
      setLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  const handleQuickLogin = (roleKey) => {
    loginAs(ROLES[roleKey]);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-soc-bg text-slate-100 cyber-grid flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-soc-card/90 border border-soc-cardBorder rounded-2xl p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        
        {/* Glowing cyber accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600" />
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3 shadow-cyan-glow">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-mono tracking-tight text-white">
            Threat<span className="text-cyan-400">Off</span> SOC
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Autonomous Insider Threat Defense Platform
          </p>
        </div>

        {/* 1-Click Evaluation Presets */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold block flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5" /> 1-Click Evaluator Access
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN')}
              className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-medium transition-all flex flex-col items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('ANALYST')}
              className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-300 text-[11px] font-mono font-medium transition-all flex flex-col items-center gap-1"
            >
              <UserCheck className="w-4 h-4" />
              <span>Analyst</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('VIEWER')}
              className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-medium transition-all flex flex-col items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              <span>Viewer</span>
            </button>
          </div>
        </div>

        {/* Traditional Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Security Credential / Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Security Token / Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold font-mono text-xs tracking-wider shadow-cyan-glow flex items-center justify-center space-x-2 transition-all"
          >
            {loading ? <span>Authenticating with SOC...</span> : (
              <>
                <span>Access Security Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] font-mono text-slate-500 border-t border-soc-cardBorder/60 pt-4">
          Enterprise Threat Detection Platform &bull; Production v1.0
        </div>

      </div>
    </div>
  );
}
