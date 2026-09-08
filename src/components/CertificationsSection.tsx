import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Cloud,
  Cpu,
  Code,
  Plus,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Certification } from '../types';

export const CertificationsSection: React.FC = () => {
  const { certificates, setIsAdminPanelOpen } = usePortfolio();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  const getCertIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cloud':
        return <Cloud className="w-5 h-5 text-blue-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Code':
        return <Code className="w-5 h-5 text-cyan-400" />;
      default:
        return <Award className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section
      id="certifications"
      className="relative min-h-screen py-20 px-4 sm:px-6 md:pl-24 md:pr-8 flex flex-col justify-center max-w-7xl mx-auto z-20"
    >
      {/* Section Header */}
      <div className="text-center md:text-left mb-12 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-mono-tech tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-blue-300" />
          <span>04. VERIFIED CREDENTIALS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
          Industry <span className="text-gradient-aurora">Certifications</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
          Validated domain expertise across Cloud Architecture, Deep Learning, and Distributed Engineering.
        </p>
      </div>

      {/* Certifications Grid or Empty State */}
      {certificates.length === 0 ? (
        <div className="p-10 sm:p-14 rounded-3xl glass-card border border-white/10 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-300 mx-auto">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold font-display text-white">No Certifications Listed Yet</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Add your verified credentials, course completion certificates, and badges dynamically via the Admin Panel.
          </p>
          <button
            onClick={() => setIsAdminPanelOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 text-slate-950 font-bold text-xs font-mono-tech inline-flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(56,189,248,0.5)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Open Admin Panel to Add Certificate</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="p-6 sm:p-7 rounded-3xl glass-card flex flex-col justify-between space-y-6 cursor-pointer group border border-white/15 hover:border-cyan-400/40 relative overflow-hidden"
            >
              {/* Ambient Corner Flare */}
              <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-cyan-400/10 blur-[45px] group-hover:bg-cyan-400/20 transition-all pointer-events-none" />

              <div>
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-cyan-400/40 transition-all">
                    {getCertIcon(cert.iconName)}
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono-tech text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                    <span className="block text-[11px] font-mono-tech text-slate-400 mt-1">
                      Issued {cert.issueDate}
                    </span>
                  </div>
                </div>

                {/* Title & Issuer */}
                <h3 className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors mb-1">
                  {cert.title}
                </h3>
                <p className="text-xs font-mono-tech text-cyan-400 font-semibold mb-3">
                  {cert.issuer}
                </p>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {cert.description}
                </p>

                {/* Skills Validated */}
                <div className="flex flex-wrap gap-1.5">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono-tech text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Credential ID & Action */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-mono-tech text-slate-400 text-[11px]">
                  ID: <strong className="text-slate-200">{cert.credentialId}</strong>
                </span>
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-white font-semibold transition-colors"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
