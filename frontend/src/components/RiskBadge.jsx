import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export default function RiskBadge({ level = 'Low', score = null, showIcon = true, size = 'md' }) {
  const normLevel = (level || 'Low').toLowerCase();

  let styles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  let Icon = CheckCircle;
  let text = "LOW RISK";

  if (normLevel.includes('crit') || (score !== null && score >= 80)) {
    styles = "bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-red-glow animate-pulse";
    Icon = ShieldAlert;
    text = "CRITICAL RISK";
  } else if (normLevel.includes('high') || (score !== null && score >= 65)) {
    styles = "bg-red-500/15 text-red-400 border-red-500/40";
    Icon = AlertCircle;
    text = "HIGH RISK";
  } else if (normLevel.includes('med') || (score !== null && score >= 50)) {
    styles = "bg-amber-500/15 text-amber-400 border-amber-500/40";
    Icon = AlertTriangle;
    text = "MEDIUM RISK";
  }

  const sizeClasses = size === 'sm' 
    ? "px-2 py-0.5 text-xs gap-1"
    : size === 'lg'
    ? "px-3.5 py-1.5 text-sm gap-2 font-semibold"
    : "px-2.5 py-1 text-xs gap-1.5 font-medium";

  return (
    <span className={`inline-flex items-center rounded-full border font-mono uppercase tracking-wider ${styles} ${sizeClasses}`}>
      {showIcon && <Icon className={size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"} />}
      <span>{text}</span>
      {score !== null && <span className="opacity-80">({Number(score).toFixed(1)}%)</span>}
    </span>
  );
}
