import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, trend = null, color = "cyan" }) {
  const colorMap = {
    cyan: {
      border: "border-cyan-500/20 hover:border-cyan-500/50",
      iconBg: "bg-cyan-500/10 text-cyan-400",
      glow: "hover:shadow-cyan-glow",
      text: "text-cyan-400"
    },
    red: {
      border: "border-rose-500/20 hover:border-rose-500/50",
      iconBg: "bg-rose-500/10 text-rose-400",
      glow: "hover:shadow-red-glow",
      text: "text-rose-400"
    },
    amber: {
      border: "border-amber-500/20 hover:border-amber-500/50",
      iconBg: "bg-amber-500/10 text-amber-400",
      glow: "hover:shadow-amber-glow",
      text: "text-amber-400"
    },
    emerald: {
      border: "border-emerald-500/20 hover:border-emerald-500/50",
      iconBg: "bg-emerald-500/10 text-emerald-400",
      glow: "",
      text: "text-emerald-400"
    }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div className={`bg-soc-card/90 backdrop-blur-sm rounded-xl border ${scheme.border} p-5 transition-all duration-300 ${scheme.glow} relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none rounded-bl-full" />
      
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider font-mono text-slate-400 font-medium">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${scheme.iconBg} transition-transform group-hover:scale-110 duration-200`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">{value}</span>
        {trend && (
          <span className={`text-xs font-mono font-medium ${trend.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.text}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1.5 text-xs text-slate-400 line-clamp-1">{subtext}</p>
      )}
    </div>
  );
}
