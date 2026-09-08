import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Mail,
  Code,
  Trophy,
  GraduationCap,
  Heart,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Bot,
  Briefcase,
  FileText,
  Shield,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { AkashOSTerminal } from './AkashOSTerminal';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
  onOpenResume: () => void;
  onSetSnowIntensity?: (intensity: 'gentle' | 'normal' | 'blizzard') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenResume,
  onSetSnowIntensity,
}) => {
  const {
    profile,
    stats,
    socialLinks,
    setIsAskAiOpen,
    setIsRecruiterModeOpen,
    setIsAiResumeOpen,
    setIsAdminPanelOpen,
  } = usePortfolio();

  // Typewriter dynamic roles
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(90);

  const roles = profile?.roles && profile.roles.length > 0
    ? profile.roles
    : [
        'Autonomous Agent Architect',
        'AI & Full Stack Systems Engineer',
        'Deep Learning & LLM Researcher',
        'Distributed Cloud Computing Specialist',
      ];

  useEffect(() => {
    const currentRole = roles[currentRoleIndex] || roles[0];
    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentRole.substring(0, displayText.length + 1));
        if (displayText.length + 1 === currentRole.length) {
          setTypingSpeed(1800);
          setIsDeleting(true);
        } else {
          setTypingSpeed(75);
        }
      } else {
        setDisplayText(currentRole.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
          setTypingSpeed(300);
        } else {
          setTypingSpeed(35);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentRoleIndex, typingSpeed, roles]);

  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'x / twitter':
      case 'twitter':
      case 'x':
        return <Twitter className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const displayName = profile?.name || 'Akash';
  const displayTagline = profile?.tagline || 'B.Tech CSE | AI & Full Stack Systems Engineer';
  const displayBio =
    profile?.bio ||
    'I craft hyper-performant web applications and engineer intelligent multi-agent AI systems. Driven by the confluence of mathematical models, reactive user interfaces, and cloud computing.';
  const displayAvatar =
    profile?.avatarUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop';

  return (
    <section
      id="home"
      className="relative min-h-screen pt-36 pb-16 px-4 sm:px-6 md:pl-24 md:pr-8 flex flex-col justify-start items-center max-w-7xl mx-auto z-20"
    >
      {/* 1. Top OS Status, AI Actions & Admin Access */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/15 text-xs font-mono-tech text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>AKASH OS v4.18 // CLOUDINARY & FIRESTORE LIVE</span>
        </div>

        {/* Dynamic AI Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech">
          <button
            onClick={() => setIsAskAiOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer shadow-[0_0_12px_rgba(56,189,248,0.2)]"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask Akash AI</span>
          </button>

          <button
            onClick={() => setIsRecruiterModeOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Recruiter Mode</span>
          </button>

          <button
            onClick={() => setIsAiResumeOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/30 text-purple-300 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>AI Resume</span>
          </button>

          <button
            onClick={() => setIsAdminPanelOpen(true)}
            className="px-2.5 py-1.5 rounded-xl glass-pill hover:bg-white/15 text-slate-300 hover:text-white border border-white/15 flex items-center gap-1 cursor-pointer"
            title="Open Admin CMS"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Admin CMS</span>
          </button>
        </div>
      </div>

      {/* 2. Large Central Liquid Glassmorphism Card (Firmly grounded, no floating drift) */}
      <div className="w-full liquid-glass-card rounded-3xl p-6 sm:p-10 relative overflow-visible lg:overflow-hidden border border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_50px_rgba(56,189,248,0.2)]">
        {/* Specular Ambient Glow Flares */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-400/10 blur-[75px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-500/10 blur-[75px] pointer-events-none" />

         <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-12 pt-12">
          {/* Left Column: Typography Showcase, Typewriter & Actions */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono-tech tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>HELLO, I AM</span>
            </div>

            {/* Glowing Heading: Akash */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight font-display text-white drop-shadow-[0_0_20px_rgba(56,189,248,0.7)]">
              {displayName}
            </h1>

            {/* Dynamic Typewriter Title */}
            <div className="h-9 flex items-center justify-center lg:justify-start">
              <span className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-100 font-mono-tech flex items-center">
                <span className="text-cyan-400 mr-2">B.Tech CSE |</span>
                <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
                  {displayText}
                </span>
                <span className="w-0.5 h-6 bg-cyan-400 ml-1.5 animate-pulse" />
              </span>
            </div>

            {/* Bio */}
            <p className="text-slate-100 text-sm sm:text-base leading-relaxed max-w-xl font-normal pt-1 drop-shadow-sm">
              {displayBio}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
              <button
                id="hero-view-projects-btn"
                onClick={() => onNavigate('projects')}
                className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 text-slate-950 font-bold text-sm tracking-wide transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(56,189,248,0.8)] shadow-lg active:scale-95 cursor-pointer"
              >
                <span>Explore Builds</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-download-cv-btn"
                onClick={onOpenResume}
                className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl glass-pill hover:bg-white/15 border-white/25 text-white font-semibold text-sm transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] cursor-pointer"
              >
                <span>Download CV</span>
                <Download className="w-4 h-4 text-cyan-300 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Social Media Glass Icons */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-3">
              {(socialLinks && socialLinks.length > 0
                ? socialLinks
                : [
                    { name: 'GitHub', url: 'https://github.com', color: 'hover:text-cyan-400' },
                    { name: 'LinkedIn', url: 'https://linkedin.com', color: 'hover:text-blue-400' },
                    { name: 'X / Twitter', url: 'https://x.com', color: 'hover:text-sky-300' },
                    { name: 'Email', url: `mailto:${profile?.email || 'akash@example.com'}`, color: 'hover:text-rose-400' },
                  ]
              ).map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  id={`hero-social-${social.name.toLowerCase().replace(/\s+/g, '-')}`}
                  title={social.name}
                  className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-slate-200 hover:text-cyan-300 hover:border-cyan-400/60 hover:scale-110 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all duration-300"
                >
                  {getSocialIcon(social.name)}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Properly Cropped Avatar Frame (No Top Cutoff) */}
          <div className="relative flex-shrink-0 flex items-center justify-center p-2 lg:mt-8">
            {/* Outer Glowing Energy Rings */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-400/30 via-sky-300/20 to-purple-500/30 blur-2xl pointer-events-none" />

            {/* Clean Cropped Frame */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl p-1.5 bg-gradient-to-tr from-cyan-400 via-sky-300 to-indigo-500 shadow-[0_0_40px_rgba(56,189,248,0.4),inset_0_0_20px_rgba(255,255,255,0.4)] overflow-hidden">
              <div className="w-full h-full rounded-[22px] overflow-hidden relative bg-slate-900">
                <img
                  src={displayAvatar}
                  alt="Akash - AI & Full Stack Engineer"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: 'center 15%' }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B14]/60 via-transparent to-cyan-500/10 mix-blend-overlay pointer-events-none" />
              </div>
            </div>

            {/* Status Floating Pill */}
            <div className="absolute -bottom-3 px-3.5 py-1.5 rounded-full bg-[#050B14]/90 backdrop-blur-xl border border-cyan-400/50 shadow-[0_0_15px_rgba(56,189,248,0.4)] flex items-center gap-2 text-[11px] font-mono-tech text-cyan-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{profile?.status || 'Available for Roles & Research'}</span>
            </div>
          </div>
        </div>

        {/* 3. Embedded Interactive Akash OS Terminal inside the Liquid Glass Card */}
        <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
          <AkashOSTerminal
            onLaunchPortfolio={onNavigate}
            onSetSnowIntensity={onSetSnowIntensity}
          />
        </div>
      </div>

      {/* 4. Dynamic Achievement Analytics calculated dynamically from Firestore */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {/* Stat 1: Projects Built */}
        <div className="p-4 sm:p-5 rounded-2xl liquid-glass-card border border-white/15 flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center text-cyan-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold font-display text-white flex items-baseline drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
              <span>{stats.totalProjects}</span>
              <span className="text-cyan-400 text-lg font-bold">+</span>
            </div>
            <p className="text-[11px] font-medium text-slate-300">Projects Built</p>
          </div>
        </div>

        {/* Stat 2: Major Achievements */}
        <div className="p-4 sm:p-5 rounded-2xl liquid-glass-card border border-white/15 flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/25 flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold font-display text-white flex items-baseline drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
              <span>{stats.totalAchievements}</span>
              <span className="text-purple-400 text-lg font-bold">+</span>
            </div>
            <p className="text-[11px] font-medium text-slate-300">Global Achievements</p>
          </div>
        </div>

        {/* Stat 3: Total Skills Verified */}
        <div className="p-4 sm:p-5 rounded-2xl liquid-glass-card border border-white/15 flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/25 flex items-center justify-center text-sky-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold font-display text-white flex items-baseline drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
              <span>{stats.totalSkills}</span>
              <span className="text-sky-400 text-sm font-bold ml-0.5">Skills</span>
            </div>
            <p className="text-[11px] font-medium text-slate-300">Mastery Stack</p>
          </div>
        </div>

        {/* Stat 4: Total Certifications */}
        <div className="p-4 sm:p-5 rounded-2xl liquid-glass-card border border-white/15 flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-400/25 flex items-center justify-center text-rose-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold font-display text-white flex items-baseline drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">
              <span>{stats.totalCertifications}</span>
              <span className="text-rose-400 text-sm font-bold ml-0.5">Certs</span>
            </div>
            <p className="text-[11px] font-medium text-slate-300">Verified Credentials</p>
          </div>
        </div>
      </div>

      {/* 5. Bottom Scroll Down Indicator & Quote */}
      <div className="w-full mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="hidden sm:block w-32" />

        <button
          id="hero-scroll-indicator"
          onClick={() => onNavigate('about')}
          className="group flex flex-col items-center gap-1.5 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <div className="w-5 h-8 rounded-full border-2 border-slate-300/80 group-hover:border-cyan-400 flex items-start justify-center p-1 transition-colors shadow-[0_0_10px_rgba(56,189,248,0.2)]">
            <div className="w-1 h-2 rounded-full bg-cyan-400 animate-bounce" />
          </div>
          <span className="text-[11px] font-mono-tech tracking-wider uppercase opacity-90 group-hover:opacity-100">
            Scroll Down
          </span>
          <ChevronDown className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
        </button>

        <div className="text-center sm:text-right">
          <div className="font-caveat text-2xl sm:text-3xl text-cyan-200 tracking-wide drop-shadow-[0_0_14px_rgba(56,189,248,0.85)] transform -rotate-2 select-none">
            "Build Explore Grow" 🏔️
          </div>
        </div>
      </div>
    </section>
  );
};
