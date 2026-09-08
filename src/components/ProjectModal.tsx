import React from 'react';
import { X, ExternalLink, Github, Sparkles, CheckCircle, Cpu, Network } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xl animate-fade-in">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-cyan-400/30 shadow-[0_25px_80px_rgba(0,0,0,0.8)] p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full glass-pill hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Title */}
        <div className="space-y-2 pr-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono-tech">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{project.category}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            {project.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">{project.tagline}</p>
        </div>

        {/* Hero Image Showcase */}
        <div className="relative rounded-2xl overflow-hidden border border-white/15 h-64 sm:h-80 bg-slate-900 group">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          {/* Action Links Overlay */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl glass-panel hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-2 transition-all border border-white/20 hover:border-cyan-400/50"
            >
              <Github className="w-4 h-4" />
              <span>Source Code</span>
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 hover:shadow-[0_0_20px_rgba(56,189,248,0.6)] transition-all"
            >
              <span>Explore Architecture</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          {project.metrics.map((m, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-lg sm:text-2xl font-extrabold text-cyan-300 font-display block">
                {m.value}
              </span>
              <span className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider">
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Deep Dive Description */}
        <div className="space-y-4 text-slate-200 text-sm leading-relaxed">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Engineering Architecture</span>
          </h3>
          <p>{project.description}</p>
          
          {project.architecture && (
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-cyan-500/20 font-mono-tech text-xs text-cyan-100 flex items-start gap-3">
              <Network className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Distributed Topology:</strong>
                {project.architecture}
              </div>
            </div>
          )}

          {/* Key Highlights */}
          <div className="space-y-2 pt-2">
            <strong className="text-white text-xs uppercase tracking-wider block">Key Technical Innovations:</strong>
            {project.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies Badges */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <span className="text-xs font-mono-tech text-slate-400 uppercase tracking-wider">Stack & Frameworks:</span>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono-tech text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
