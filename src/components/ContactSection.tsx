import React, { useState } from 'react';
import {
  Mail,
  Sparkles,
  Send,
  Copy,
  Check,
  MessageSquare,
  MapPin,
  Clock,
  ArrowRight,
  Github,
  Linkedin,
  Phone,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePortfolio } from '../context/PortfolioContext';
import { submitContactMessage } from '../services/firestoreService';

export const ContactSection: React.FC = () => {
  const { profile, socialLinks } = usePortfolio();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'AI & Engineering Opportunity',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('AI Project Collaboration');

  const presets = [
    'AI Project Collaboration',
    'High-Impact Engineering Role',
    'Full-Stack MERN Project',
    'General Inquiry',
  ];

  const emailToUse = profile?.email || 'kakashsunny2007@gmail.com';
  const phoneToUse = profile?.phone || '+91 7483041745';
  const githubToUse = profile?.github || 'https://github.com/kakashsunny';
  const linkedinToUse = profile?.linkedin || 'https://www.linkedin.com/in/k-akash-620b63427/';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailToUse);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phoneToUse);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    setFormData((prev) => ({
      ...prev,
      subject: preset,
      message: `Hi K Akash,\n\nI came across your portfolio and would love to discuss ${preset.toLowerCase()} with you...`,
    }));
  };

  
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSending(true);

    try {
      await submitContactMessage(formData);


    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#818cf8', '#c084fc', '#ffffff'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }

    setSubmitted(true);
    } catch (error) {
      console.error('Unable to send contact message:', error);
      alert('Unable to send your message right now. Please use the email or WhatsApp contact options.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen py-20 px-4 sm:px-6 md:pl-24 md:pr-8 flex flex-col justify-center max-w-7xl mx-auto z-20"
    >
      {/* Section Header */}
      <div className="text-center md:text-left mb-12 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-mono-tech tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>07. DIRECT TRANSMISSION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
          Let's Build Something <span className="text-gradient-aurora">Impactful</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
          Have an AI/ML project, engineering role, or collaboration in mind? Reach out via phone, email, or message.
        </p>
      </div>

      {/* Main Grid: Direct Contact Info + Interactive Glass Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Info & Social Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl glass-card space-y-6 border border-white/15">
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-400" />
              <span>Contact & Channels</span>
            </h3>

            {/* Email Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider block">
                  Email Address
                </span>
                <a
                  href={`mailto:${emailToUse}`}
                  className="text-xs sm:text-sm font-mono-tech text-cyan-300 font-bold truncate block hover:underline"
                >
                  {emailToUse}
                </a>
              </div>
              <button
                id="contact-copy-email-btn"
                onClick={handleCopyEmail}
                className="p-2.5 rounded-xl glass-pill hover:bg-white/20 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                title="Copy Email Address"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-mono-tech text-emerald-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span className="text-[11px] font-mono-tech text-slate-200">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Phone Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  Mobile Number / WhatsApp
                </span>
                <a
                  href={`tel:${phoneToUse.replace(/[^0-9+]/g, '')}`}
                  className="text-xs sm:text-sm font-mono-tech text-emerald-300 font-bold truncate block hover:underline"
                >
                  {phoneToUse}
                </a>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a
                  href={`https://wa.me/${phoneToUse.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 transition-all flex items-center gap-1"
                  title="Chat on WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-mono-tech">WhatsApp</span>
                </a>
                <button
                  id="contact-copy-phone-btn"
                  onClick={handleCopyPhone}
                  className="p-2 rounded-xl glass-pill hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer"
                  title="Copy Phone Number"
                >
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                </button>
              </div>
            </div>

            {/* University & Location */}
            <div className="space-y-2.5 text-xs font-mono-tech pt-1">
              <div className="flex items-center gap-2.5 text-slate-300">
                <GraduationCap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>CMR University, Bengaluru (B.Tech 5th Sem CSE)</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Bengaluru, Karnataka • Open for Roles & Relocation</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Clock className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Response Time: &lt; 6 Hours</span>
              </div>
            </div>

            {/* Social Profiles Grid */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-xs font-mono-tech text-slate-400 uppercase tracking-wider block">
                Verified Handles & Links:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={githubToUse}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-between text-xs text-slate-200 hover:text-cyan-300 transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                </a>

                <a
                  href={linkedinToUse}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-between text-xs text-slate-200 hover:text-cyan-300 transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>LinkedIn</span>
                  </span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Glass Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-card border border-cyan-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-display text-white">
                Message Sent Successfully!
              </h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Thank you, <strong className="text-cyan-300">{formData.name}</strong>. Your message has been received. K Akash will review and reply to <strong className="text-cyan-300">{formData.email}</strong> shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: 'AI & Engineering Opportunity', message: '' });
                }}
                className="px-6 py-2.5 rounded-xl glass-pill hover:bg-white/15 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Preset Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono-tech text-slate-300 uppercase tracking-wider block">
                  Select Topic Intent:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        selectedPreset === preset
                          ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono-tech text-slate-300">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Miller"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono-tech text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-slate-300">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-slate-300">Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details regarding the role, problem statement, or idea..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="contact-submit-btn"
                disabled={isSending}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 text-slate-950 font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(56,189,248,0.7)] transition-all active:scale-[0.99] cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? 'Sending Message...' : 'Send Message to K Akash'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
