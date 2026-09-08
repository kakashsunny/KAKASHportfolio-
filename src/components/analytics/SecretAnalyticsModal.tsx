import React from 'react';
import {
  X,
  Zap,
  Activity,
  BarChart3,
  TrendingUp,
  Cpu,
  Layers,
  Award,
  Database,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const SecretAnalyticsModal: React.FC = () => {
  const {
    projects,
    skills,
    certificates,
    achievements,
    education,
    stats,
    isSecretAnalyticsOpen,
    setIsSecretAnalyticsOpen,
    setIsAdminPanelOpen,
  } = usePortfolio();

  if (!isSecretAnalyticsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl rounded-3xl liquid-glass-card border border-amber-400/40 shadow-[0_20px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(245,158,11,0.25)] flex flex-col max-h-[92vh] overflow-hidden my-auto bg-[#050B14]/95">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-display text-white">
                  Hidden System Analytics & Telemetry
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-[10px] font-mono-tech text-amber-300">
                  SECRET ACCESS (A + K)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Deep portfolio growth metrics, stack distribution & database vitals
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSecretAnalyticsOpen(false)}
            className="p-2 rounded-xl glass-pill hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analytics Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-400/30 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400">
                <span>Projects</span>
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-display text-white">{stats.totalProjects}</div>
              <div className="text-[10px] text-emerald-400 font-mono-tech">100% Production Ready</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-purple-400/30 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400">
                <span>Skills Verified</span>
                <Layers className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold font-display text-white">{stats.totalSkills}</div>
              <div className="text-[10px] text-purple-300 font-mono-tech">Across 4 Domains</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-400/30 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400">
                <span>Achievements</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-display text-white">{stats.totalAchievements}</div>
              <div className="text-[10px] text-amber-300 font-mono-tech">Top Tier Recognitions</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-400/30 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400">
                <span>Certifications</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-display text-white">{stats.totalCertifications}</div>
              <div className="text-[10px] text-emerald-300 font-mono-tech">AWS & GCP Verified</div>
            </div>
          </div>

          {/* Skill Matrix Proficiency Breakdown */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 font-mono-tech">
                TECHNICAL PROFICIENCY RADAR
              </span>
              <span className="text-[11px] font-mono-tech text-slate-400">Live Evaluation</span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'AI & Autonomous Agent Orchestration', level: 96, color: 'from-cyan-400 to-sky-400' },
                { name: 'Full-Stack Systems & High Concurrency', level: 93, color: 'from-purple-400 to-indigo-400' },
                { name: 'Distributed Cloud Architecture & Docker', level: 90, color: 'from-amber-400 to-orange-400' },
                { name: 'Deep Learning & Neural Tensor Acceleration', level: 88, color: 'from-emerald-400 to-teal-400' },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono-tech text-slate-200">
                    <span>{item.name}</span>
                    <span className="font-bold">{item.level}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/10">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                      style={{ width: `${item.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Database & System Vitals */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-amber-500/10 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-bold text-sm text-white">Direct Admin Access</p>
              <p className="text-xs text-slate-300 font-mono-tech">
                Need to modify projects, upload images to Cloudinary, or alter credentials?
              </p>
            </div>
            <button
              onClick={() => {
                setIsSecretAnalyticsOpen(false);
                setIsAdminPanelOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs font-mono-tech hover:scale-105 transition-all cursor-pointer flex items-center gap-2 flex-shrink-0"
            >
              <Database className="w-4 h-4" />
              <span>Open Admin CMS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
