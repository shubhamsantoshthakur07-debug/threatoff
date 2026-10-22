import React from 'react';
import { Shield, Lock, FileCode } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-soc-cardBorder bg-soc-surface py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-semibold">ThreatOff</span>
          <span>— AI-Powered Insider Threat Prediction & SOC Triage System</span>
        </div>

        <div className="text-center md:text-right text-slate-400">
          <p>Enterprise Cybersecurity & Anomaly Detection Platform</p>
          <p className="text-[11px] text-slate-500">
            Algorithmic predictions denote behavioral risk indicators requiring human investigator verification.
          </p>
        </div>
      </div>
    </footer>
  );
}
