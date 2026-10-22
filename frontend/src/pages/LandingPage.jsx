import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Activity,
  Cpu,
  FileSpreadsheet,
  ShieldAlert,
  Terminal,
  Lock,
  Search,
  CheckCircle2,
  ArrowRight,
  Database,
  BarChart3,
  Layers,
  Fingerprint
} from 'lucide-react';

export default function LandingPage() {
  const stats = [
    { label: "Verified ROC-AUC", value: "0.8401", sub: "Class-balanced evaluation" },
    { label: "Overall Accuracy", value: "84.96%", sub: "Tested on 1,250 held-out samples" },
    { label: "Telemetry Features", value: "11 Vectors", sub: "Authentication, exfiltration & HR signals" },
    { label: "Oversampling", value: "SMOTE", sub: "Overcomes severe real-world class imbalance" }
  ];

  const features = [
    {
      icon: Activity,
      title: "Interactive Manual Prediction",
      desc: "Simulate or evaluate an individual employee's 11 telemetry indicators in real-time with instant risk breakdown and top contributing factors."
    },
    {
      icon: FileSpreadsheet,
      title: "Batch Dataset Processing",
      desc: "Upload corporate CSV telemetry logs or 1-click test synthetic batches to generate enterprise-wide risk distribution analytics."
    },
    {
      icon: ShieldAlert,
      title: "Human-in-the-Loop SOC Triage",
      desc: "Manage detected anomalies in an alert ledger. Transition states from 'Under Review' to 'Resolved' or 'False Positive' with audit logs."
    },
    {
      icon: Cpu,
      title: "Empirical Model Performance",
      desc: "Transparent access to model metrics, confusion matrix, ROC curve, and exact Gini feature importances directly from the serialized model."
    },
    {
      icon: Fingerprint,
      title: "Pseudonymous Risk Directory",
      desc: "Inspect employee behavioral telemetry without bias. Query historical anomalies, USB mount events, and night-shift login surges."
    },
    {
      icon: Lock,
      title: "Enterprise Role-Based Access",
      desc: "Tailored workspaces for Administrators (full control), Security Analysts (triage & scans), and Viewers (audit read-only)."
    }
  ];

  const workflow = [
    { step: "01", title: "Telemetry Ingestion", desc: "Collect logs: login stamps, sensitive files, USB storage, data transfer MB, and HR status." },
    { step: "02", title: "Feature Encoding", desc: "One-hot / label encoding for departments and standardized telemetry vector scaling." },
    { step: "03", title: "Random Forest Scoring", desc: "300 decision trees evaluate multi-factor behavioral anomalies with SMOTE class weighting." },
    { step: "04", title: "Threshold Classification", desc: "Calculates probability (0-100%) and segments into Low, Medium, High, or Critical risk tiers." },
    { step: "05", title: "SOC Alert & Investigation", desc: "Automated alert dispatch to SOC ledger for human analyst triage and forensic documentation." }
  ];

  return (
    <div className="min-h-screen bg-soc-bg text-slate-100 cyber-grid pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-mono text-xs mb-6 shadow-cyan-glow">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>Next-Generation SOC Platform &bull; Cybersecurity &amp; AI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Insider Threat</span> Prediction &amp; SOC Detection
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          <strong>ThreatOff</strong> leverages machine learning to predict potentially malicious insider activities, exfiltration attempts, and abnormal corporate behavioral divergence before catastrophic data leakage occurs.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold font-mono text-sm tracking-wide shadow-cyan-glow flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Enter SOC Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/manual-prediction"
            className="px-6 py-3 rounded-xl bg-soc-card hover:bg-soc-cardHover border border-soc-cardBorder hover:border-cyan-500/40 text-cyan-300 font-medium font-mono text-sm tracking-wide transition-all flex items-center space-x-2"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Interactive Risk Predictor</span>
          </Link>

          <Link
            to="/model-performance"
            className="px-6 py-3 rounded-xl bg-soc-card hover:bg-soc-cardHover border border-soc-cardBorder hover:border-cyan-500/40 text-slate-300 font-medium font-mono text-sm tracking-wide transition-all flex items-center space-x-2"
          >
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>View Empirical Metrics</span>
          </Link>
        </div>

        {/* KPI Strip */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {stats.map((s, idx) => (
            <div key={idx} className="bg-soc-card/80 border border-soc-cardBorder p-4 rounded-xl text-left backdrop-blur-sm">
              <span className="text-xs font-mono uppercase text-cyan-400">{s.label}</span>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-1">{s.value}</p>
              <p className="text-[11px] text-slate-400 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-soc-cardBorder/50">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">SOC Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">Comprehensive Cyber Defense Capabilities</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            From single-user behavioral hypothesis testing to massive enterprise dataset ingestion and triage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-soc-card/70 border border-soc-cardBorder p-6 rounded-xl hover:border-cyan-500/40 transition-all hover:shadow-cyan-glow group">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5-Step Pipeline Workflow */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-soc-cardBorder/50">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">End-to-End Pipeline</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">How ThreatOff Detects Insider Threats</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {workflow.map((w, idx) => (
            <div key={idx} className="bg-soc-surface border border-soc-cardBorder p-5 rounded-xl relative">
              <span className="text-2xl font-mono font-black text-cyan-500/30">{w.step}</span>
              <h4 className="text-sm font-bold text-white mt-2 mb-1.5">{w.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Strip */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-soc-cardBorder/50">
        <div className="bg-soc-card/40 border border-soc-cardBorder rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">Full-Stack Enterprise Architecture</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-lg">
              Engineered with FastAPI backend, Scikit-learn Random Forest model (300 estimators), SQLite triage database, React 18, Tailwind CSS, and Recharts.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {["FastAPI", "Python 3.12", "Scikit-Learn", "SMOTE", "SQLite", "React 18", "Tailwind CSS", "Recharts"].map((tech, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-cyan-300">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
