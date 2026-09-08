import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  Loader2,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export const AskAkashAiModal: React.FC = () => {
  const {
    profile,
    projects,
    skills,
    certificates,
    achievements,
    education,
    isAskAiOpen,
    setIsAskAiOpen,
  } = usePortfolio();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        "Hello! I am **Ask Akash AI**, an autonomous assistant grounded in Akash's real-time portfolio data. Ask me anything about his projects, skills, research, certifications, or hiring value proposition.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'Tell me about Akash.',
    'What projects has he built?',
    'What certifications does he have?',
    'What are his strongest skills?',
    'Why should I hire him?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAskAiOpen) {
      scrollToBottom();
    }
  }, [messages, isAskAiOpen]);

  if (!isAskAiOpen) return null;

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputVal).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const portfolioContext = {
        profile,
        projects: projects.map((p) => ({
          title: p.title,
          category: p.category,
          tagline: p.tagline,
          description: p.description,
          tags: p.tags,
          metrics: p.metrics,
          liveUrl: p.liveUrl,
          githubUrl: p.githubUrl,
        })),
        skills,
        certificates: certificates.map((c) => ({
          title: c.title,
          issuer: c.issuer,
          credentialId: c.credentialId,
          skills: c.skills,
        })),
        achievements: achievements.map((a) => ({
          title: a.title,
          organization: a.organization,
          metric: a.metric,
          category: a.category,
        })),
        education,
      };

      const customKey = localStorage.getItem('akash_custom_gemini_key') || undefined;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          portfolioContext,
          apiKey: customKey,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "I don't have that information in Akash's portfolio.";

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      console.error('Chat error:', err);
      // Client-side fallback response if offline or key error
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content:
          "Akash Sharma is an Autonomous Agent Architect and B.Tech CSE scholar. He has built high-performance distributed AI systems (Autonomous Agent Orchestrator, DeepFusion Vision, Quantum Ledger) and holds verified AWS & Google Cloud credentials.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl liquid-glass-card border border-cyan-400/40 shadow-[0_20px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(56,189,248,0.3)] flex flex-col h-[620px] max-h-[90vh] overflow-hidden bg-[#050B14]/95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-sky-400 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display text-white">Ask Akash AI</h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[10px] font-mono-tech text-cyan-300">
                  GEMINI 2.5 FLASH
                </span>
              </div>
              <p className="text-xs text-slate-400">Strictly grounded in Firestore portfolio context</p>
            </div>
          </div>

          <button
            onClick={() => setIsAskAiOpen(false)}
            className="p-2 rounded-xl glass-pill hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 text-slate-950 font-medium'
                    : 'bg-white/[0.04] border border-white/15 text-slate-100'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[10px] mt-1.5 font-mono-tech ${
                    msg.role === 'user' ? 'text-slate-900/80 text-right' : 'text-slate-400 text-left'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 animate-spin">
                <Loader2 className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/15 text-xs font-mono-tech text-cyan-300 animate-pulse">
                Consulting Akash's Firestore portfolio context...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 border-t border-white/10 bg-white/[0.01] flex items-center gap-2 overflow-x-auto text-[11px] font-mono-tech">
          <span className="text-slate-500 flex-shrink-0">Prompts:</span>
          {sampleQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 whitespace-nowrap transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-black/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything about Akash's skills, projects, or background..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs hover:scale-105 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
