import React from 'react';
import { ArrowUp, Heart, Sparkles } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 px-4 sm:px-6 md:pl-24 md:pr-8 border-t border-white/10 max-w-7xl mx-auto z-20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left Brand */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <div className="flex items-center gap-2 font-mono-tech font-bold text-sm tracking-widest text-slate-100">
            <span className="text-cyan-400">&lt;</span>
            <span className="bg-gradient-to-r from-white via-cyan-200 to-sky-400 bg-clip-text text-transparent font-extrabold">
              AKASH
            </span>
            <span className="text-cyan-400">/&gt;</span>
          </div>
          <p className="text-xs text-slate-400 font-mono-tech">
            Apple Design Award Winner Aesthetic • Designed with Three.js & Tailwind
          </p>
        </div>

        {/* Center Quote */}
        <div className="font-caveat text-xl sm:text-2xl text-cyan-200 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">
          "Build. Explore. Grow." 🏔️
        </div>

        {/* Right Scroll Top */}
        <button
          onClick={scrollToTop}
          className="p-3 rounded-2xl glass-panel hover:bg-white/20 border border-white/15 text-slate-200 hover:text-cyan-300 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all cursor-pointer group flex items-center gap-2 text-xs font-mono-tech"
          title="Scroll Back to Summit"
        >
          <span>Return to Top</span>
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      <div className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono-tech gap-2">
        <span>© {new Date().getFullYear()} K Akash. All rights reserved.</span>
        <span>Built with React 19, TypeScript, Three.js & Tailwind CSS.</span>
      </div>
    </footer>
  );
};
