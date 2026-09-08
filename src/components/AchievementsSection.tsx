import React from 'react';
import {
  Trophy,
  Sparkles,
  FileText,
  Star,
  Award,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const AchievementsSection: React.FC = () => {
  const { achievements } = usePortfolio();

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Hackathon':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'Research':
        return <FileText className="w-5 h-5 text-purple-400" />;
      case 'Open Source':
        return <Star className="w-5 h-5 text-cyan-400" />;
      default:
        return <Award className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <section
      id="achievements"
      className="relative min-h-screen py-20 px-4 sm:px-6 md:pl-24 md:pr-8 flex flex-col justify-center max-w-7xl mx-auto z-20"
    >
      {/* Section Header */}
      <div className="text-center md:text-left mb-12 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs font-mono-tech tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>06. RECOGNITION & IMPACT</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
          Honors & <span className="text-gradient-aurora">Achievements</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
          Competitive hackathon victories, peer-reviewed AI publications, and global developer ecosystem reach.
        </p>
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="p-6 sm:p-7 rounded-3xl glass-card flex flex-col justify-between space-y-6 group border border-white/15 hover:border-amber-400/40 relative overflow-hidden transition-all duration-300"
          >
            {/* Ambient Background Flare */}
            <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-amber-400/10 blur-[45px] group-hover:bg-amber-400/20 transition-all pointer-events-none" />

            <div>
              {/* Header Badge */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-amber-400/40 transition-all">
                  {getCategoryBadge(ach.category)}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold font-display text-amber-300 block">
                    {ach.metric}
                  </span>
                  <span className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-wider block">
                    {ach.metricLabel}
                  </span>
                </div>
              </div>

              {/* Title & Organization */}
              <div className="mb-2">
                <span className="text-xs font-mono-tech text-cyan-400 font-semibold block mb-1">
                  {ach.badge}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-amber-200 transition-colors">
                  {ach.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-tech mb-3">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{ach.date}</span>
                <span>•</span>
                <span className="text-slate-300">{ach.organization}</span>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {ach.description}
              </p>
            </div>

            {/* Bottom Status */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono-tech text-slate-400">
                Category: <strong className="text-slate-200">{ach.category}</strong>
              </span>
              <span className="text-amber-400 font-mono-tech font-semibold flex items-center gap-1 text-[11px]">
                ✦ Verified Milestone
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
