import React, { useState, useEffect } from 'react';
import {
  X,
  Briefcase,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Award,
  CheckCircle2,
  Code2,
  Trophy,
  GraduationCap,
  Loader2,
  Mail,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const RecruiterModeModal: React.FC = () => {
  const {
    profile,
    projects,
    skills,
    certificates,
    achievements,
    education,
    stats,
    isRecruiterModeOpen,
    setIsRecruiterModeOpen,
  } = usePortfolio();

  const [copied, setCopied] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [roleFocus, setRoleFocus] = useState<'AI Systems Engineer' | 'Full Stack Architect' | 'Machine Learning Researcher'>('AI Systems Engineer');

  useEffect(() => {
    if (!isRecruiterModeOpen) return;

    const generateSummary = async () => {
      setIsLoadingAi(true);
      try {
        const portfolioContext = { profile, projects, skills, certificates, achievements, education };
        const customKey = localStorage.getItem('akash_custom_gemini_key') || undefined;
        const res = await fetch('/api/recruiter-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ portfolioContext, roleFocus, apiKey: customKey }),
        });
        if (res.ok) {
          const data = await res.json();
          setAiSummary(data.summary);
        }
      } catch {
        // Fallback static recruiter snapshot
        setAiSummary(
          `## Executive Recruiter Brief: K AKASH\n\nCandidate: Akash Sharma (B.Tech CSE, 1st Rank Semester Standing)\nTarget Track: ${roleFocus}\n\n### Key Highlights\n- Production AI Systems: Architected autonomous multi-agent systems and real-time vision inference pipelines.\n- Technical Mastery: Python, PyTorch, TypeScript, React, Distributed Systems, Cloud Infrastructure.\n- **Verified Credentials:** AWS Certified AI Practitioner, Google Cloud Professional ML Engineer.\n- Work Ethic & Growth: Relentless learning velocity, proven hackathon winner, and team multiplier.`
        );
      } finally {
        setIsLoadingAi(false);
      }
    };

    generateSummary();
  }, [isRecruiterModeOpen, roleFocus, profile, projects, skills, certificates, achievements, education]);

  if (!isRecruiterModeOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(aiSummary || 'Recruiter Brief for K AKASH');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl rounded-3xl liquid-glass-card border border-cyan-400/40 shadow-[0_20px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(56,189,248,0.3)] flex flex-col max-h-[92vh] overflow-hidden my-auto bg-[#050B14]/95">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-cyan-400 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-display text-white">
                  Recruiter Executive Brief
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[10px] font-mono-tech text-emerald-300">
                  RECRUITER MODE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Condensed hiring dossier, verified strengths, and quantifiable impact
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Dossier' : 'Copy Brief'}</span>
            </button>
            <button
              onClick={() => setIsRecruiterModeOpen(false)}
              className="p-2 rounded-xl glass-pill hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Focus Selector */}
        <div className="px-6 py-3 border-b border-white/10 bg-white/[0.01] flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
          <span className="text-slate-400">Target Role Perspective:</span>
          <div className="flex gap-2">
            {(['AI Systems Engineer', 'Full Stack Architect', 'Machine Learning Researcher'] as const).map(
              (role) => (
                <button
                  key={role}
                  onClick={() => setRoleFocus(role)}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    roleFocus === role
                      ? 'bg-cyan-400 text-slate-950 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {role}
                </button>
              )
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div className="text-xl font-bold text-cyan-300 font-display">{stats.totalProjects}+</div>
              <p className="text-[11px] text-slate-400 font-mono-tech">Production Projects</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div className="text-xl font-bold text-purple-300 font-display">{stats.totalCertifications}</div>
              <p className="text-[11px] text-slate-400 font-mono-tech">Cloud & AI Certs</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div className="text-xl font-bold text-emerald-300 font-display">1st Rank</div>
              <p className="text-[11px] text-slate-400 font-mono-tech">Academic Standing</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div className="text-xl font-bold text-amber-300 font-display">Immediate</div>
              <p className="text-[11px] text-slate-400 font-mono-tech">Availability</p>
            </div>
          </div>

          {/* AI Generated Executive Dossier */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-cyan-400/25 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 font-mono-tech">
              <Sparkles className="w-4 h-4" />
              <span>AI SYNTHESIZED EXECUTIVE SUMMARY</span>
            </div>

            {isLoadingAi ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-cyan-300 text-xs font-mono-tech">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Generating custom role evaluation with Gemini...</span>
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {aiSummary}
              </div>
            )}
          </div>

          {/* Direct Contact Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 to-cyan-500/10 border border-cyan-400/30">
            <div>
              <p className="font-bold text-sm text-white">Direct Line to Candidate</p>
              <p className="text-xs text-slate-300 font-mono-tech">{profile?.email || 'akash@example.com'}</p>
            </div>
            <a
              href={`mailto:${profile?.email || 'akash@example.com'}?subject=Interview%20Invitation%20for%20Akash`}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs font-mono-tech hover:scale-105 transition-all flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Schedule Interview</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
