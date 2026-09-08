import React, { useState } from 'react';
import {
  Terminal,
  Sparkles,
  Bot,
  Send,
  Cpu,
  ShieldCheck,
  Zap,
  Flame,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface AboutSectionProps {
  onNavigate: (sectionId: string) => void;
}

const SAMPLE_QUESTIONS = [
  'What is your primary AI & ML tech stack?',
  'Tell me about your approach to building Full-Stack systems',
  'What kind of opportunities are you looking for?',
  'How do you optimize LLM latency and cost?',
];

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  const { profile, setIsAskAiOpen } = usePortfolio();
  const [userQuery, setUserQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    {
      role: 'ai',
      text: "Greetings! I'm Akash's interactive AI assistant. Ask me anything about his engineering background, research publications, architecture philosophies, or project experience.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleAskQuestion = async (question: string) => {
    if (!question.trim()) return;
    const q = question;
    setUserQuery('');
    setChatHistory((prev) => [...prev, { role: 'user', text: q }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
          portfolioContext: { profile },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory((prev) => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        throw new Error('Fallback needed');
      }
    } catch {
      let response = '';
      const lower = q.toLowerCase();
      if (lower.includes('stack') || lower.includes('technology') || lower.includes('skills')) {
        response = "Akash's core stack centers around Python (PyTorch, LangGraph, FastAPI), TypeScript (React 19, Next.js, Three.js), and distributed cloud systems (Google Cloud, Docker, Kubernetes).";
      } else if (lower.includes('opportunity') || lower.includes('hire') || lower.includes('role')) {
        response = "Akash is actively looking for high-impact AI Engineering and Full-Stack Systems roles. Open to impactful research and product engineering teams!";
      } else {
        response = `Thanks for asking! Akash is a B.Tech Computer Science scholar with 1st rank semester standing, AWS/Google Cloud certifications, and builder of production-grade AI platforms. You can reach him at ${profile?.email || 'akash@example.com'}!`;
      }
      setChatHistory((prev) => [...prev, { role: 'ai', text: response }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section
      id="about"
      className="relative min-h-screen py-20 px-4 sm:px-6 md:pl-24 md:pr-8 flex flex-col justify-center max-w-7xl mx-auto z-20"
    >
      {/* Section Header */}
      <div className="text-center md:text-left mb-12 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-mono-tech tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>01. ORIGINS & PHILOSOPHY</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
          About <span className="text-gradient-aurora">Akash</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
          Where computational intelligence meets breathtaking visual craft.
        </p>
      </div>

      {/* Main Grid: Story Card + Interactive AI Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Story & Background Card (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-card relative overflow-hidden flex flex-col justify-between space-y-6">
          <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed">
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span>Architecting the Next Era of Intelligent Web Systems</span>
            </h3>

            <p>
              I am a Computer Science undergraduate studying at <strong className="text-cyan-300">CMR University</strong> (B.Tech 5th Sem Computer Science & Engineering) with a deep fascination for the intersection of artificial intelligence, distributed computing, and high-performance software systems.
            </p>

            <p>
              My journey began by exploring algorithmic competitive programming and quickly evolved into building end-to-end multi-agent AI ecosystems. I believe that powerful software should not only be technically flawless under heavy loads, but also feel magical, responsive, and delightful to interact with.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Research-Driven</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Published research on sub-4-bit quantization benchmarks.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Production Scalability</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Engineered pipelines handling 1M+ live telemetry events.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Apple-Tier Polish</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Hardware-accelerated glassmorphism & 60fps micro-animations.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Open Source Spirit</h4>
                  <p className="text-xs text-slate-300 mt-0.5">15k+ stars across maintained developer repositories.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono-tech">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Bangalore, India • UTC+5:30</span>
            </div>
            <button
              onClick={() => onNavigate('contact')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all border border-white/15 hover:border-cyan-400/40"
            >
              Let's Connect →
            </button>
          </div>
        </div>

        {/* Right Interactive AI Terminal Card (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl glass-card flex flex-col justify-between border border-cyan-400/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono-tech text-xs text-slate-300 font-semibold flex items-center gap-1.5 ml-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>akash-ai-copilot.sh</span>
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              Interactive
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="my-4 h-64 overflow-y-auto space-y-3 pr-1 text-xs font-mono-tech">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-100 ml-6'
                    : 'bg-white/5 border border-white/10 text-slate-200 mr-4'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 font-bold text-[10px] uppercase opacity-75">
                  {msg.role === 'user' ? (
                    <span className="text-cyan-300">You (Visitor)</span>
                  ) : (
                    <span className="text-purple-300 flex items-center gap-1">
                      <Bot className="w-3 h-3" /> Akash AI Agent
                    </span>
                  )}
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            ))}
            {isTyping && (
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 mr-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="text-[11px] font-mono-tech text-slate-400 ml-1">Synthesizing...</span>
              </div>
            )}
          </div>

          {/* Sample Prompts Chips */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-wider block">
              Quick Inquiries:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskQuestion(q)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-slate-300 hover:text-cyan-200 transition-all text-left"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskQuestion(userQuery);
              }}
              className="flex items-center gap-2 mt-2"
            >
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask about Akash's projects, stack..."
                className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="submit"
                disabled={!userQuery.trim()}
                className="p-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-bold disabled:opacity-40 hover:shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
