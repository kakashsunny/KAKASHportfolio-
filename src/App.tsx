/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { SnowBackground } from './components/SnowBackground';
import { MouseGlow } from './components/MouseGlow';
import { ScrollProgress } from './components/ScrollProgress';
import { Navbar } from './components/Navbar';
import { SidebarNav } from './components/SidebarNav';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { CertificationsSection } from './components/CertificationsSection';
import { EducationSection } from './components/EducationSection';
import { AchievementsSection } from './components/AchievementsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { TerminalEntryScreen } from './components/TerminalEntryScreen';

// Modals
import { AdminPanelModal } from './components/admin/AdminPanelModal';
import { AskAkashAiModal } from './components/ai/AskAkashAiModal';
import { RecruiterModeModal } from './components/recruiter/RecruiterModeModal';
import { AiResumeGeneratorModal } from './components/resume/AiResumeGeneratorModal';
import { SecretAnalyticsModal } from './components/analytics/SecretAnalyticsModal';

function PortfolioApp() {
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [snowIntensity, setSnowIntensity] = useState<'gentle' | 'normal' | 'blizzard'>('normal');

  // Smooth navigation handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Keyboard shortcut to toggle terminal (` or Ctrl+`)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === '`' || (e.ctrlKey && e.key === '`') || (e.altKey && e.key.toLowerCase() === 't')) {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // IntersectionObserver to auto-update active section indicator on scroll
  useEffect(() => {
    const sectionIds = [
      'home',
      'about',
      'skills',
      'projects',
      'certifications',
      'education',
      'achievements',
      'contact',
    ];

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.2,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050B14] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* 1. Interactive Three.js Snowfall & Mountain Night Background */}
      <SnowBackground snowIntensity={snowIntensity} />

      {/* 2. Interactive Smooth Mouse Radial Light Glow */}
      <MouseGlow />

      {/* 3. Top Scroll Progress Indicator */}
      <ScrollProgress />

      {/* 4. Glassmorphism Top Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenResume={() => setIsResumeOpen(true)}
        snowIntensity={snowIntensity}
        setSnowIntensity={setSnowIntensity}
      />

      {/* 5. Frosted Transparent Left Sidebar Navigation */}
      <SidebarNav
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* 6. Main Portfolio Sections */}
      <main className="relative z-20">
        <HeroSection
          onNavigate={handleNavigate}
          onOpenResume={() => setIsResumeOpen(true)}
          onSetSnowIntensity={setSnowIntensity}
        />
        <AboutSection onNavigate={handleNavigate} />
        <SkillsSection />
        <ProjectsSection />
        <CertificationsSection />
        <EducationSection />
        <AchievementsSection />
        <ContactSection />
      </main>

      {/* 7. Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* 8. Interactive Curriculum Vitae Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* 9. Dynamic System Modals */}
      <AdminPanelModal />
      <AskAkashAiModal />
      <RecruiterModeModal />
      <AiResumeGeneratorModal />
      <SecretAnalyticsModal />

      {/* 10. Floating Terminal Quick Re-opener Button */}
      {!isTerminalOpen && (
        <button
          type="button"
          onClick={() => setIsTerminalOpen(true)}
          className="fixed bottom-5 left-5 z-40 px-3 py-2 rounded-2xl bg-[#040914]/85 backdrop-blur-xl border border-cyan-400/35 text-cyan-300 font-mono-tech text-xs flex items-center gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.15)] hover:border-cyan-300 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Open Akash OS Terminal (Shortcut: `)"
        >
          <span className="text-cyan-400 font-bold">&gt;_</span>
          <span>Terminal</span>
          <span className="hidden sm:inline text-[10px] text-slate-400 group-hover:text-slate-300 font-mono px-1 py-0.5 rounded bg-white/5 border border-white/10">
            `
          </span>
        </button>
      )}

      {/* 11. Interactive Fullscreen Terminal Entry Layer */}
      <TerminalEntryScreen
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onNavigate={handleNavigate}
        onOpenResume={() => setIsResumeOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
