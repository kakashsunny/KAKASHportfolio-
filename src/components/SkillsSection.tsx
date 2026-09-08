import React, { useState } from 'react';
import {
  Code2,
  BrainCircuit,
  Layers,
  CloudLightning,
  Sparkles,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const SkillsSection: React.FC = () => {
  const { skills } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'BrainCircuit':
        return <BrainCircuit className="w-5 h-5 text-cyan-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-purple-400" />;
      case 'CloudLightning':
        return <CloudLightning className="w-5 h-5 text-sky-400" />;
      default:
        return <Code2 className="w-5 h-5 text-cyan-400" />;
    }
  };

  const filteredCategories =
    selectedCategory === 'all'
      ? skills
      : skills.filter(
          (c) => c.name.toLowerCase().replace(/\s+/g, '-') === selectedCategory
        );

  return (
    <section
      id="skills"
      className="relative min-h-screen py-20 px-4 sm:px-6 md:pl-24 md:pr-8 flex flex-col justify-center max-w-7xl mx-auto z-20"
    >
      {/* Section Header */}
      <div className="text-center md:text-left mb-12 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-xs font-mono-tech tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>02. TECHNICAL MATRIX</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
          Skills & <span className="text-gradient-aurora">Proficiencies</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
          Engineered for production scale, low-latency execution, and mathematical precision.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.5)]'
                : 'glass-pill text-slate-300 hover:text-white'
            }`}
          >
            All Competencies
          </button>
          {skills.map((cat) => {
            const catId = cat.name.toLowerCase().replace(/\s+/g, '-');
            const isActive = selectedCategory === catId;
            return (
              <button
                key={catId}
                onClick={() => setSelectedCategory(catId)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.5)]'
                    : 'glass-pill text-slate-300 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.name}
            className="p-6 sm:p-7 rounded-3xl glass-card flex flex-col justify-between space-y-6 relative group overflow-hidden border border-white/15 hover:border-cyan-400/40"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-400/10 blur-[50px] group-hover:bg-cyan-400/20 transition-all pointer-events-none" />

            <div>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {getCategoryIcon(category.icon)}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-white">
                    {category.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Skills List with Progress Bars */}
              <div className="space-y-3.5 mt-5">
                {category.skills.map((skill) => {
                  const isHovered = hoveredSkill === skill.name;
                  return (
                    <div
                      key={skill.name}
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-cyan-400/30 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-1.5 text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-medium">{skill.name}</span>
                          {skill.popular && (
                            <span className="flex items-center gap-0.5 text-[9px] font-mono-tech px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                              <Flame className="w-2.5 h-2.5 text-cyan-400" />
                              Core
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 font-mono-tech text-[11px]">
                          <span className="text-slate-400">{skill.experience}</span>
                          <span className="text-cyan-300 font-bold">{skill.level}%</span>
                        </div>
                      </div>

                      {/* Progress Meter Bar */}
                      <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden relative">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(56,189,248,0.7)] transition-all duration-700 ease-out"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Category Summary Badge */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono-tech">
              <span>{category.skills.length} Technical Modules</span>
              <span className="text-cyan-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Verified Depth
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
