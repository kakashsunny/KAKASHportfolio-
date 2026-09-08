import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  Maximize2,
  Minimize2,
  Sparkles,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  Flame,
  Cpu,
  Layers,
  Award,
  BookOpen,
  Mail,
  Send,
  ExternalLink,
  ChevronRight,
  Shield,
  Activity,
  Compass,
} from 'lucide-react';
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES, CERTIFICATIONS, EDUCATION, ACHIEVEMENTS } from '../data/portfolioData';

interface AkashOSTerminalProps {
  onLaunchPortfolio: (targetSection?: string) => void;
  onSetSnowIntensity?: (intensity: 'gentle' | 'normal' | 'blizzard') => void;
}

interface LogEntry {
  id: string;
  type: 'command' | 'output' | 'system' | 'success' | 'error' | 'boot';
  text: string | React.ReactNode;
  timestamp: string;
}

export const AkashOSTerminal: React.FC<AkashOSTerminalProps> = ({
  onLaunchPortfolio,
  onSetSnowIntensity,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>(['K AKASH']);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isBooting, setIsBooting] = useState<boolean>(false);
  const [bootStep, setBootStep] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [matrixMode, setMatrixMode] = useState<boolean>(false);
  const [systemUptime, setSystemUptime] = useState<number>(142);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synthesize futuristic sound cues via Web Audio API
  const playSciFiSound = (type: 'key' | 'boot' | 'success' | 'launch') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'key') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else if (type === 'boot' || type === 'success') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(440, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);
        osc2.frequency.setValueAtTime(554.37, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(1108.73, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.3);
        osc2.stop(ctx.currentTime + 0.3);
      } else if (type === 'launch') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.65);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  const getTimestamp = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  // Initial welcome logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      type: 'system',
      text: '═══════════════════════════════════════════════════════════════════',
      timestamp: getTimestamp(),
    },
    {
      id: 'init-2',
      type: 'system',
      text: '❄️ AKASH OS v4.18 [AURORA KERNEL - QUANTUM ENGINE INITIALIZED]',
      timestamp: getTimestamp(),
    },
    {
      id: 'init-3',
      type: 'output',
      text: 'Type "K AKASH" or click the prompt below to boot the portfolio.',
      timestamp: getTimestamp(),
    },
    {
      id: 'init-4',
      type: 'system',
      text: 'Type "help" to view all system commands (skills, projects, certs, snow).',
      timestamp: getTimestamp(),
    },
    {
      id: 'init-5',
      type: 'system',
      text: '═══════════════════════════════════════════════════════════════════',
      timestamp: getTimestamp(),
    },
  ]);

  // System uptime counter
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom of terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isBooting, bootStep]);

  // Handle Command Execution
  const handleExecuteCommand = (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) return;

    // Save to history
    setCommandHistory((prev) => [trimmed, ...prev.filter((c) => c !== trimmed)]);
    setHistoryIndex(-1);

    const newLog: LogEntry = {
      id: `cmd-${Date.now()}`,
      type: 'command',
      text: `> ${trimmed}`,
      timestamp: getTimestamp(),
    };

    setLogs((prev) => [...prev, newLog]);
    setInputVal('');

    const cmdLower = trimmed.toLowerCase();
    playSciFiSound('key');

    // 1. SPECIAL COMMAND: K AKASH
    if (
      cmdLower === 'k akash' ||
      cmdLower === 'kakash' ||
      cmdLower === 'k-akash' ||
      cmdLower === 'akash' ||
      cmdLower === 'launch' ||
      cmdLower === 'open'
    ) {
      triggerAkashBootSequence();
      return;
    }

    // 2. HELP COMMAND
    if (cmdLower === 'help' || cmdLower === 'man' || cmdLower === '?') {
      const helpOutput: LogEntry = {
        id: `help-${Date.now()}`,
        type: 'output',
        text: (
          <div className="space-y-2 text-xs py-1">
            <p className="text-cyan-300 font-bold">AVAILABLE AKASH OS COMMANDS:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 font-mono-tech">
              <div><strong className="text-amber-300">K AKASH</strong> : Execute boot sequence & launch portfolio</div>
              <div><strong className="text-cyan-400">about</strong> : Display engineer bio & philosophies</div>
              <div><strong className="text-cyan-400">projects</strong> : List high-impact AI/Full-Stack builds</div>
              <div><strong className="text-cyan-400">skills</strong> : Visual technical mastery matrix</div>
              <div><strong className="text-cyan-400">certs</strong> : Industry verified credentials</div>
              <div><strong className="text-cyan-400">education</strong> : Academic coursework & distinction</div>
              <div><strong className="text-cyan-400">achievements</strong> : Hackathons & research honors</div>
              <div><strong className="text-cyan-400">contact</strong> : Transmit encrypted message</div>
              <div><strong className="text-purple-300">snow [gentle|normal|blizzard]</strong> : Modify weather physics</div>
              <div><strong className="text-emerald-300">matrix</strong> : Toggle cybernetic matrix mode</div>
              <div><strong className="text-slate-300">neofetch</strong> : Display system specifications</div>
              <div><strong className="text-slate-300">clear</strong> : Clear terminal logs</div>
            </div>
          </div>
        ),
        timestamp: getTimestamp(),
      };
      setLogs((prev) => [...prev, helpOutput]);
      return;
    }

    // 3. ABOUT COMMAND
    if (cmdLower === 'about' || cmdLower === 'whoami' || cmdLower === 'bio') {
      const aboutOutput: LogEntry = {
        id: `about-${Date.now()}`,
        type: 'output',
        text: (
          <div className="space-y-2 text-xs py-1 text-slate-200">
            <p className="text-cyan-300 font-bold text-sm">K AKASH — Autonomous Agent & Systems Engineer</p>
            <p className="leading-relaxed">{PERSONAL_INFO.bio}</p>
            <div className="flex flex-wrap gap-4 text-cyan-200/90 font-mono-tech pt-1">
              <span>📍 {PERSONAL_INFO.location}</span>
              <span>🎓 {PERSONAL_INFO.tagline}</span>
              <span>⚡ Status: {PERSONAL_INFO.status}</span>
            </div>
          </div>
        ),
        timestamp: getTimestamp(),
      };
      setLogs((prev) => [...prev, aboutOutput]);
      return;
    }

    // 4. PROJECTS COMMAND
    if (cmdLower === 'projects' || cmdLower === 'portfolio' || cmdLower === 'builds') {
      const projOutput: LogEntry = {
        id: `proj-${Date.now()}`,
        type: 'output',
        text: (
          <div className="space-y-3 text-xs py-1">
            <p className="text-cyan-300 font-bold">PRODUCTION ARCHITECTURES & BUILDS:</p>
            <div className="space-y-2">
              {PROJECTS.map((p, idx) => (
                <div key={p.id} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-amber-300 font-bold mr-2">[{idx + 1}] {p.title}</span>
                    <span className="text-cyan-400 text-[11px] font-mono-tech">({p.category})</span>
                    <p className="text-slate-300 text-[11px] mt-0.5">{p.tagline}</p>
                  </div>
                  <button
                    onClick={() => onLaunchPortfolio('projects')}
                    className="self-start sm:self-center px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-[11px] font-mono-tech flex items-center gap-1 cursor-pointer flex-shrink-0"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ),
        timestamp: getTimestamp(),
      };
      setLogs((prev) => [...prev, projOutput]);
      return;
    }

    // 5. SKILLS COMMAND
    if (cmdLower === 'skills' || cmdLower === 'tech' || cmdLower === 'stack') {
      const skillOutput: LogEntry = {
        id: `skill-${Date.now()}`,
        type: 'output',
        text: (
          <div className="space-y-3 text-xs py-1">
            <p className="text-cyan-300 font-bold">TECHNICAL MASTERY & CORE CAPABILITIES:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.name} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-purple-300 font-bold block mb-1.5 font-mono-tech">{cat.name}:</span>
                  <div className="space-y-1">
                    {cat.skills.slice(0, 3).map((s) => (
                      <div key={s.name} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-200">{s.name}</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${s.level}%` }} />
                          </div>
                          <span className="font-mono-tech text-cyan-300 text-[10px]">{s.level}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
        timestamp: getTimestamp(),
      };
      setLogs((prev) => [...prev, skillOutput]);
      return;
    }

    // 6. CERTIFICATIONS COMMAND
    if (cmdLower === 'certs' || cmdLower === 'certifications' || cmdLower === 'credentials') {
      const certOutput: LogEntry = {
        id: `certs-${Date.now()}`,
        type: 'output',
        text: (
          <div className="space-y-2 text-xs py-1">
            <p className="text-cyan-300 font-bold">VERIFIED INDUSTRY CREDENTIALS:</p>
            <div className="space-y-1.5 font-mono-tech text-slate-200">
              {CERTIFICATIONS.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                  <span>✦ <strong>{c.title}</strong> — {c.issuer}</span>
                  <span className="text-emerald-400 text-[11px]">[ID: {c.credentialId}]</span>
                </div>
              ))}
            </div>
          </div>
        ),
        timestamp: getTimestamp(),
      };
      setLogs((prev) => [...prev, certOutput]);
      return;
    }

    // 7. EDUCATION COMMAND
    if (cmdLower === 'education' || cmdLower === 'edu' || cmdLower === 'academic') {
      const eduOutput: LogEntry = {
        id: `edu-${Date.now()}`,
        type: 'output',
        text: (
          <div className="space-y-2 text-xs py-1">
            <p className="text-cyan-300 font-bold">ACADEMIC FOUNDATION & DISTINCTIONS:</p>
            {EDUCATION.map((e) => (
              <div key={e.id} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{e.degree} — {e.field}</span>
                  <span className="text-cyan-300 font-mono-tech">{e.grade} ({e.status})</span>
                </div>
                <p className="text-slate-300">{e.institution} • {e.period}</p>
                <p className="text-slate-400 text-[11px]">{e.highlights.join(' • ')}</p>
              </div>
            ))}
          </div>
        ),
        timestamp: getTimestamp(),
      };
      setLogs((prev) => [...prev, eduOutput]);
      return;
    }

    // 8. ACHIEVEMENTS COMMAND
    if (cmdLower === 'achievements' || cmdLower === 'awards' || cmdLower === 'honors') {
      const achOutput: LogEntry = {
        id: `ach-${Date.now()}`,
        type: 'output',
        text: (
          <div className="space-y-2 text-xs py-1">
            <p className="text-amber-300 font-bold">RECOGNITION & GLOBAL HONORS:</p>
            <div className="space-y-1.5 font-mono-tech">
              {ACHIEVEMENTS.map((a) => (
                <div key={a.id} className="p-2 rounded-lg bg-white/[0.03] flex items-center justify-between">
                  <span>🏆 <strong className="text-white">{a.title}</strong> ({a.organization})</span>
                  <span className="text-amber-300 font-bold">{a.metric}</span>
                </div>
              ))}
            </div>
          </div>
        ),
        timestamp: getTimestamp(),
      };
      setLogs((prev) => [...prev, achOutput]);
      return;
    }

    // 9. CONTACT COMMAND
    if (cmdLower === 'contact' || cmdLower === 'email' || cmdLower === 'ping') {
      const contactOutput: LogEntry = {
        id: `contact-${Date.now()}`,
        type: 'output',
        text: (
          <div className="space-y-2 text-xs py-1 text-slate-200">
            <p className="text-cyan-300 font-bold">COMMUNICATION MATRIX:</p>
            <p>Direct Transmission: <strong className="text-white font-mono-tech">{PERSONAL_INFO.email}</strong></p>
            <p>Location: Bangalore, India (Open for Worldwide Remote)</p>
            <button
              onClick={() => onLaunchPortfolio('contact')}
              className="mt-1 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[11px] font-mono-tech flex items-center gap-1 cursor-pointer"
            >
              <span>Open Encrypted Transmission Console</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        ),
        timestamp: getTimestamp(),
      };
      setLogs((prev) => [...prev, contactOutput]);
      return;
    }

    // 10. SNOW MODIFIER COMMAND
    if (cmdLower.startsWith('snow')) {
      const parts = cmdLower.split(' ');
      const mode = parts[1] as 'gentle' | 'normal' | 'blizzard' | undefined;
      if (mode && (mode === 'gentle' || mode === 'normal' || mode === 'blizzard')) {
        if (onSetSnowIntensity) onSetSnowIntensity(mode);
        const snowLog: LogEntry = {
          id: `snow-${Date.now()}`,
          type: 'success',
          text: `❄️ Weather physics reconfigured: Snow intensity set to "${mode.toUpperCase()}".`,
          timestamp: getTimestamp(),
        };
        setLogs((prev) => [...prev, snowLog]);
      } else {
        const snowLog: LogEntry = {
          id: `snow-${Date.now()}`,
          type: 'output',
          text: 'Usage: snow gentle | snow normal | snow blizzard',
          timestamp: getTimestamp(),
        };
        setLogs((prev) => [...prev, snowLog]);
      }
      return;
    }

    // 11. MATRIX COMMAND
    if (cmdLower === 'matrix') {
      setMatrixMode((prev) => !prev);
      const matrixLog: LogEntry = {
        id: `matrix-${Date.now()}`,
        type: 'success',
        text: `⚡ Matrix visual cyber-mode ${!matrixMode ? 'ACTIVATED' : 'DEACTIVATED'}.`,
        timestamp: getTimestamp(),
      };
      setLogs((prev) => [...prev, matrixLog]);
      return;
    }

    // 12. NEOFETCH / SPECS COMMAND
    if (cmdLower === 'neofetch' || cmdLower === 'specs' || cmdLower === 'sys') {
      const neofetchOutput: LogEntry = {
        id: `neofetch-${Date.now()}`,
        type: 'output',
        text: (
          <div className="font-mono-tech text-[11px] text-cyan-200 py-1 space-y-1">
            <p className="text-white font-bold">akash@aurora-terminal-os</p>
            <p className="text-slate-400">────────────────────────</p>
            <p><span className="text-cyan-400">OS:</span> Akash OS v4.18 (Aurora x86_64)</p>
            <p><span className="text-cyan-400">Host:</span> Neural Quantum Studio</p>
            <p><span className="text-cyan-400">Kernel:</span> 6.1.0-snow-release</p>
            <p><span className="text-cyan-400">Uptime:</span> {Math.floor(systemUptime / 60)}m {systemUptime % 60}s</p>
            <p><span className="text-cyan-400">Shell:</span> akash-zsh 5.9</p>
            <p><span className="text-cyan-400">GPU:</span> Three.js WebGL 2.0 (Snow & Particle Accelerator)</p>
            <p><span className="text-cyan-400">Memory:</span> 32GB High Bandwidth LPDDR5X</p>
          </div>
        ),
        timestamp: getTimestamp(),
      };
      setLogs((prev) => [...prev, neofetchOutput]);
      return;
    }

    // 13. CLEAR COMMAND
    if (cmdLower === 'clear' || cmdLower === 'cls') {
      setLogs([
        {
          id: `clear-${Date.now()}`,
          type: 'system',
          text: 'Akash OS Terminal reset. Type "K AKASH" to launch portfolio.',
          timestamp: getTimestamp(),
        },
      ]);
      return;
    }

    // Default: Unknown Command
    const unknownOutput: LogEntry = {
      id: `err-${Date.now()}`,
      type: 'error',
      text: `Command not recognized: "${trimmed}". Type "K AKASH" or "help".`,
      timestamp: getTimestamp(),
    };
    setLogs((prev) => [...prev, unknownOutput]);
  };

  // Special Boot Animation Trigger
  const triggerAkashBootSequence = () => {
    if (isBooting) return;
    setIsBooting(true);
    setBootStep(1);
    playSciFiSound('boot');

    const bootMessages = [
      { text: '> Access Granted: Identity Verified (K Akash)', delay: 400 },
      { text: '> Loading Akash Portfolio...', delay: 900 },
      { text: '> Initializing Modules (Neural Mesh, 3D Canvas, Shaders)...', delay: 1500 },
      { text: '> Launch Complete. Welcome to Akash OS.', delay: 2100 },
    ];

    bootMessages.forEach((step, idx) => {
      setTimeout(() => {
        setBootStep(idx + 1);
        setLogs((prev) => [
          ...prev,
          {
            id: `boot-${Date.now()}-${idx}`,
            type: 'boot',
            text: (
              <span className="text-cyan-300 font-bold font-mono-tech flex items-center gap-2">
                <span className="text-emerald-400">●</span> {step.text}
              </span>
            ),
            timestamp: getTimestamp(),
          },
        ]);
        if (idx === bootMessages.length - 1) {
          playSciFiSound('launch');
          setTimeout(() => {
            setIsBooting(false);
            onLaunchPortfolio();
          }, 800);
        }
      }, step.delay);
    });
  };

  // Arrow navigation for command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleExecuteCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4">
      {/* 3D Liquid Glass Terminal Container */}
      <div
        className={`w-full max-w-4xl rounded-3xl liquid-glass-card border border-white/20 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(56,189,248,0.2)] relative overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
          matrixMode ? 'border-emerald-400/50 shadow-[0_0_50px_rgba(52,211,153,0.3)]' : ''
        }`}
      >
        {/* Specular Ambient Glow Flares */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-cyan-400/15 blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-purple-500/15 blur-[60px] pointer-events-none" />

        {/* 1. Terminal Top Header Bar */}
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/10 relative z-10">
          {/* Cyber Traffic Lights & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.6)] cursor-pointer hover:scale-110 transition-transform" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.6)] cursor-pointer hover:scale-110 transition-transform" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.6)] cursor-pointer hover:scale-110 transition-transform" />
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-white/15 text-xs font-mono-tech">
              <TerminalIcon className="w-4 h-4 text-cyan-400" />
              <span className="font-bold tracking-wider text-white drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]">
                Akash OS Terminal
              </span>
              <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-[10px] text-cyan-300">
                v4.18-aurora
              </span>
            </div>
          </div>

          {/* Right Status Indicators & Sound Toggle */}
          <div className="flex items-center gap-2.5 text-xs font-mono-tech">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-400/25 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>ONLINE</span>
            </div>

            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="p-1.5 rounded-lg glass-pill hover:bg-white/15 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
              title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            <button
              onClick={() => onLaunchPortfolio()}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:shadow-[0_0_20px_rgba(56,189,248,0.6)] transition-all cursor-pointer"
              title="Launch Full Portfolio Dashboard"
            >
              <Play className="w-3 h-3 fill-slate-950" />
              <span className="hidden md:inline">Open Portfolio</span>
            </button>
          </div>
        </div>

        {/* 2. Transparent Interactive Terminal Screen */}
        <div
          className={`h-72 sm:h-80 overflow-y-auto p-3 sm:p-4 rounded-2xl terminal-glass font-mono-tech text-xs leading-relaxed space-y-2 border border-cyan-400/25 shadow-inner transition-colors ${
            matrixMode ? 'text-emerald-300 font-bold border-emerald-400/30' : 'text-slate-100'
          }`}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Render Log Entries */}
          {logs.map((log) => (
            <div key={log.id} className="animate-fade-in flex items-start gap-2">
              <span className="text-slate-500 text-[10px] select-none flex-shrink-0 pt-0.5">
                [{log.timestamp}]
              </span>
              <div className="flex-1">
                {log.type === 'command' && (
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>{log.text}</span>
                  </span>
                )}
                {log.type === 'system' && (
                  <span className="text-slate-400">{log.text}</span>
                )}
                {log.type === 'output' && (
                  <div className="text-slate-100">{log.text}</div>
                )}
                {log.type === 'success' && (
                  <div className="text-emerald-300 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{log.text}</span>
                  </div>
                )}
                {log.type === 'error' && (
                  <div className="text-rose-300 font-semibold">{log.text}</div>
                )}
                {log.type === 'boot' && (
                  <div className="text-cyan-200">{log.text}</div>
                )}
              </div>
            </div>
          ))}

          {/* Active Boot Animation Pulse */}
          {isBooting && (
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30 space-y-2 animate-pulse">
              <div className="flex items-center justify-between text-[11px] text-cyan-300">
                <span className="font-bold">SYSTEM BOOT IN PROGRESS...</span>
                <span>{bootStep * 25}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 transition-all duration-300"
                  style={{ width: `${bootStep * 25}%` }}
                />
              </div>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* 3. Interactive Input Line with Prompt & Blinking Cursor */}
        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-2xl bg-black/20 border border-white/15 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all">
          <span className="text-cyan-400 font-bold font-mono-tech text-xs sm:text-sm flex items-center gap-1 flex-shrink-0 pl-1">
            <span className="text-purple-400">akash@os</span>
            <span className="text-slate-400">:</span>
            <span className="text-amber-400">~</span>
            <span className="text-cyan-400">$</span>
          </span>

          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'K AKASH' or press Enter to launch..."
            className="min-w-0 flex-1 bg-transparent text-white font-mono-tech text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none tracking-wide"
            autoFocus
          />

          {/* Special K AKASH Launch Trigger Button */}
          <button
            onClick={() => {
              if (inputVal.trim()) {
                handleExecuteCommand(inputVal);
              } else {
                handleExecuteCommand('K AKASH');
              }
            }}
            id="terminal-enter-btn"
           className="px-2 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 text-slate-950 font-extrabold text-xs font-mono-tech hover:scale-105 hover:shadow-[0_0_20px_rgba(56,189,248,0.7)] transition-all cursor-pointer flex items-center gap-1 flex-shrink-0"
          >
            <span>ENTER</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4. Quick Command Interactive Tag Chips */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tech">
          <span className="text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Quick Commands:</span>
          </span>

          <div className="flex flex-wrap gap-1.5">
            {[
              { cmd: 'K AKASH', label: '⚡ K AKASH', special: true },
              { cmd: 'help', label: 'help' },
              { cmd: 'about', label: 'about' },
              { cmd: 'projects', label: 'projects' },
              { cmd: 'skills', label: 'skills' },
              { cmd: 'certs', label: 'certs' },
              { cmd: 'snow blizzard', label: '❄️ blizzard' },
              { cmd: 'matrix', label: 'matrix' },
              { cmd: 'clear', label: 'clear' },
            ].map((item) => (
              <button
                key={item.cmd}
                onClick={() => {
                  setInputVal(item.cmd);
                  handleExecuteCommand(item.cmd);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                  item.special
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(56,189,248,0.5)] hover:scale-105'
                    : 'bg-white/5 hover:bg-white/15 text-slate-200 hover:text-cyan-300 border border-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
