import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  Github,
  ArrowUpRight,
  Code,
  Layers,
  Activity,
  Plus,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import { ProjectModal } from './ProjectModal';

export const ProjectsSection: React.FC = () => {
  const { projects, setIsAdminPanelOpen } = usePortfolio();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories = ['All', 'AI / ML', 'Full Stack', 'Cloud & Systems', 'Mobile & Web3'];

  const filteredProjects =
    selectedFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedFilter);

  return (
    <section
      id="projects"
      className="relative min-h-screen py-20 px-4 sm:px-6 md:pl-24 md:pr-8 flex flex-col justify-center max-w-7xl mx-auto z-20"
    >
      {/* Section Header */}
      <div className="text-center md:text-left mb-12 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-mono-tech tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>03. FEATURED BUILDS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
          Engineering <span className="text-gradient-aurora">Showcase</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
          Architected with modern paradigms: reactive UI, distributed topologies, and autonomous AI.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.5)]'
                  : 'glass-pill text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="p-10 sm:p-14 rounded-3xl glass-card border border-white/10 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold font-display text-white">No Projects Found</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            {selectedFilter === 'All'
              ? 'Ready to showcase your real builds! Add projects with live demos, architecture specs, and GitHub links via the Admin Panel.'
              : `No projects currently in "${selectedFilter}". Add one or select another filter.`}
          </p>
          <button
            onClick={() => setIsAdminPanelOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 text-slate-950 font-bold text-xs font-mono-tech inline-flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(56,189,248,0.5)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Open Admin Panel to Add Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-3xl glass-card overflow-hidden flex flex-col justify-between border border-white/15 hover:border-cyan-400/50 hover:shadow-[0_20px_50px_rgba(56,189,248,0.2)] transition-all duration-300"
            >
              {/* Project Image Banner */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Category Pill Tag */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass-panel text-[11px] font-mono-tech text-cyan-300 border border-cyan-400/30">
                  {project.category}
                </div>

                {/* Quick View Button */}
                <button
                  onClick={() => setActiveModalProject(project)}
                  className="absolute top-3 right-3 p-2 rounded-full glass-panel hover:bg-white/20 text-white transition-all opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0"
                  title="View Project Details"
                >
                  <ArrowUpRight className="w-4 h-4 text-cyan-300" />
                </button>
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3
                    onClick={() => setActiveModalProject(project)}
                    className="text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>{project.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {project.tagline}
                  </p>
                </div>

                {/* Performance Metrics Row */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/10">
                  {project.metrics.map((metric, idx) => (
                    <div key={idx} className="text-center">
                      <span className="text-sm font-bold text-cyan-300 font-mono-tech block">
                        {metric.value}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono-tech uppercase">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tech Tags Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-white/5 text-[11px] font-mono-tech text-slate-300 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] font-mono-tech text-slate-400">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>

                {/* Action Buttons Footer */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 hover:border-cyan-400/40 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Architecture</span>
                  </button>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl glass-pill hover:bg-white/20 text-slate-300 hover:text-white transition-all"
                    title="Source Code on GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
