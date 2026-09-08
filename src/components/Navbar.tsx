import React from 'react';
import { Download, Snowflake, Bot, Briefcase, Shield, Sparkles } from 'lucide-react';
import { AudioAmbience } from './AudioAmbience';
import { usePortfolio } from '../context/PortfolioContext';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenResume: () => void;
  snowIntensity: 'gentle' | 'normal' | 'blizzard';
  setSnowIntensity: (intensity: 'gentle' | 'normal' | 'blizzard') => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certificates' },
  { id: 'education', label: 'Education' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenResume,
  snowIntensity,
  setSnowIntensity,
}) => {
  const { setIsAskAiOpen, setIsRecruiterModeOpen, setIsAdminPanelOpen, isAdmin } = usePortfolio();

  const cycleSnow = () => {
    if (snowIntensity === 'gentle') setSnowIntensity('normal');
    else if (snowIntensity === 'normal') setSnowIntensity('blizzard');
    else setSnowIntensity('gentle');
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-40 px-3 sm:px-8 max-w-7xl mx-auto flex items-center justify-between gap-3 pointer-events-none">
      {/* 1. Left Logo: < AKASH /> */}
      <div className="pointer-events-auto">
        <button
          id="logo-brand-btn"
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full glass-nav hover:border-cyan-400/50 transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.4)] cursor-pointer"
        >
          <span className="font-mono-tech font-bold text-xs sm:text-sm tracking-widest text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
            <span className="text-cyan-400">&lt;</span>
            <span className="bg-gradient-to-r from-white via-cyan-200 to-sky-400 bg-clip-text text-transparent font-extrabold">AKASH</span>
            <span className="text-cyan-400">/&gt;</span>
          </span>
        </button>
      </div>

      {/* 2. Center Capsule Navigation (Desktop/Tablet) */}
      <nav className="hidden lg:flex pointer-events-auto items-center p-1.5 rounded-full glass-nav shadow-[0_12px_32px_rgba(0,0,0,0.5)] border border-white/15">
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'text-white font-semibold shadow-[0_0_18px_rgba(56,189,248,0.5)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/80 via-cyan-500/80 to-blue-600/80 border border-cyan-300/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] -z-10 animate-fade-in" />
                )}
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Right Interactive Controls & Action Buttons */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Ask AI Pill */}
        <button
          onClick={() => setIsAskAiOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-xs font-mono-tech text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.2)] transition-all hover:scale-105 cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>

        {/* Recruiter Pill */}
        <button
          onClick={() => setIsRecruiterModeOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-xs font-mono-tech text-emerald-300 transition-all hover:scale-105 cursor-pointer"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Recruiter</span>
        </button>

        {/* Admin CMS Access */}
        <button
          onClick={() => setIsAdminPanelOpen(true)}
          className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border text-xs font-mono-tech transition-all cursor-pointer flex items-center gap-1.5 ${
            isAdmin
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
              : 'glass-pill border-white/20 text-slate-300 hover:text-white'
          }`}
          title={isAdmin ? 'Admin Active (Click for CMS)' : 'Admin Login'}
        >
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xl:inline">{isAdmin ? 'Admin Live' : 'CMS'}</span>
        </button>

        {/* Snowfall Intensity Toggle */}
        <button
          id="snow-toggle-btn"
          onClick={cycleSnow}
          title={`Snowfall: ${snowIntensity.toUpperCase()} (Click to change)`}
          className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full glass-pill text-xs text-slate-200 hover:text-cyan-300 cursor-pointer"
        >
          <Snowflake className={`w-3.5 h-3.5 text-cyan-300 ${snowIntensity === 'blizzard' ? 'animate-spin' : ''}`} />
        </button>

        {/* Procedural Audio Ambience Toggle */}
        <AudioAmbience />

        {/* Download CV Action Button */}
        <button
          id="navbar-download-cv-btn"
          onClick={onOpenResume}
          className="group relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full glass-pill hover:bg-white/15 border-white/20 text-xs font-medium text-slate-100 hover:text-white transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
          <span className="tracking-wide hidden sm:inline">Download CV</span>
        </button>
      </div>
    </header>
  );
};
