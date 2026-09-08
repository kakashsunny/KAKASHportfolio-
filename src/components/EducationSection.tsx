import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const EducationSection: React.FC = () => {
  const { education } = usePortfolio();

  return (
    <section
      id="education"
      className="relative min-h-screen py-20 px-4 sm:px-6 md:pl-24 md:pr-8 flex flex-col justify-center max-w-7xl mx-auto z-20"
    >
      {/* Section Header */}
      <div className="text-center md:text-left mb-12 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-mono-tech tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>05. ACADEMIC FOUNDATION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
          Education & <span className="text-gradient-aurora">Academics</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
          Strong theoretical foundations in algorithms, computer systems, and mathematical modeling.
        </p>
      </div>

      {/* Education Timeline Cards */}
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div
            key={edu.id}
            className="p-6 sm:p-8 rounded-3xl glass-card relative overflow-hidden group border border-white/15 hover:border-cyan-400/40 transition-all"
          >
            {/* Ambient Background Gradient Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Institution & Period Info (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 flex-shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-mono-tech">
                      {edu.status}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-1">
                      {edu.degree}
                    </h3>
                  </div>
                </div>

                <div className="text-sm font-semibold text-cyan-300">
                  {edu.field}
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 font-mono-tech">
                  <p className="text-slate-100 font-medium text-sm">{edu.institution}</p>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{edu.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{edu.period}</span>
                  </div>
                </div>

                {/* Academic Grade Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-cyan-400/30">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono-tech text-slate-200">
                    Distinction: <strong className="text-cyan-300 font-bold">{edu.grade}</strong>
                  </span>
                </div>
              </div>

              {/* Right Coursework & Key Milestones (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <h4 className="text-xs font-bold font-mono-tech text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Academic Highlights & Leadership:</span>
                  </h4>
                  <div className="space-y-2">
                    {edu.highlights.map((h, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-200 flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coursework Tags */}
                <div>
                  <h4 className="text-xs font-bold font-mono-tech text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Core Coursework:</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.coursework.map((course) => (
                      <span
                        key={course}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono-tech text-slate-300"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
