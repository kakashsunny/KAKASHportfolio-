import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
  HelpCircle,
  FolderGit2,
  Award,
  Layers,
  User,
  FileText,
  Mail,
  GraduationCap,
  Trophy,
} from 'lucide-react';

interface TerminalEntryScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenResume: () => void;
}

interface CommandHistoryItem {
  id: string;
  type: 'system' | 'input' | 'output' | 'error' | 'success';
  text: string | React.ReactNode;
}

export const TerminalEntryScreen: React.FC<TerminalEntryScreenProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenResume,
}) => {
  const [bootPhase, setBootPhase] = useState<number>(0);
  const [bootComplete, setBootComplete] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdHistoryIdx, setCmdHistoryIdx] = useState<number>(-1);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Boot sequence animation on initial mount
  useEffect(() => {
    if (!isOpen) return;

    // Fast, crisp boot sequence
    const timers: NodeJS.Timeout[] = [];

    // Line 1: AKASH OS v4.18
    timers.push(
      setTimeout(() => {
        setBootPhase(1);
      }, 150)
    );

    // Line 2: Initializing...
    timers.push(
      setTimeout(() => {
        setBootPhase(2);
      }, 400)
    );

    // Line 3: Loading portfolio...
    timers.push(
      setTimeout(() => {
        setBootPhase(3);
      }, 700)
    );

    // Line 4: System ready.
    timers.push(
      setTimeout(() => {
        setBootPhase(4);
        setBootComplete(true);
      }, 1000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isOpen]);

  // Auto-focus input when boot completes or terminal is clicked
  useEffect(() => {
    if (bootComplete && inputRef.current) {
      inputRef.current.focus();
    }
  }, [bootComplete]);

  // Auto-scroll to bottom of terminal when history changes or boot steps update
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, bootPhase, bootComplete]);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const executeTransition = (
    destinationName: string,
    callback: () => void
  ) => {
    setHistory((prev) => [
      ...prev,
      {
        id: `succ-${Date.now()}`,
        type: 'success',
        text: (
          <div className="flex items-center gap-2 text-emerald-300 font-mono-tech">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>[ACCESS GRANTED] Transitioning to {destinationName}...</span>
          </div>
        ),
      },
    ]);

    // Smooth blur + fade transition before revealing the existing site
    setIsClosing(true);
    setTimeout(() => {
      callback();
      onClose();
      setIsClosing(false);
    }, 450);
  };

  const handleCommand = (rawCommand: string) => {
    const cmd = rawCommand.trim();
    if (!cmd) return;

    // Add to command history for up/down arrows
    setCmdHistory((prev) => [...prev, cmd]);
    setCmdHistoryIdx(-1);

    // Add user input to terminal view
    const inputEntry: CommandHistoryItem = {
      id: `in-${Date.now()}`,
      type: 'input',
      text: `guest@akash:~$ ${cmd}`,
    };

    const lower = cmd.toLowerCase().trim();

    // 1. CLEAR command
    if (lower === 'clear' || lower === 'cls') {
      setHistory([]);
      setInputVal('');
      return;
    }

    // 2. HELP command
    if (lower === 'help' || lower === '?' || lower === 'commands' || lower === 'man') {
      const helpOutput: CommandHistoryItem = {
        id: `out-${Date.now()}`,
        type: 'output',
        text: (
          <div className="space-y-2 py-1 text-slate-300 font-mono-tech text-xs sm:text-sm">
            <div className="text-cyan-300 font-bold border-b border-cyan-500/20 pb-1">
              AKASH OS // AVAILABLE COMMANDS
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1 text-xs">
              <div>
                <span className="text-cyan-400 font-bold">open k akash</span>
                <span className="text-slate-400"> - Reveal main portfolio homepage</span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">akash / portfolio</span>
                <span className="text-slate-400"> - Enter portfolio homepage</span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">certificates</span>
                <span className="text-slate-400"> - View verified credentials</span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">projects</span>
                <span className="text-slate-400"> - Explore engineering projects</span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">skills</span>
                <span className="text-slate-400"> - Technical competencies</span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">about / whoami</span>
                <span className="text-slate-400"> - Developer biography & philosophy</span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">resume / cv</span>
                <span className="text-slate-400"> - Open Curriculum Vitae modal</span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">contact / email</span>
                <span className="text-slate-400"> - Reach out to K Akash</span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">education</span>
                <span className="text-slate-400"> - B.Tech CSE details & honors</span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">achievements</span>
                <span className="text-slate-400"> - Hackathons & IEEE awards</span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">clear</span>
                <span className="text-slate-400"> - Clear terminal display</span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">help</span>
                <span className="text-slate-400"> - Display this command manual</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              Tip: You can also click any suggested command chip below or press Enter.
            </div>
          </div>
        ),
      };
      setHistory((prev) => [...prev, inputEntry, helpOutput]);
      setInputVal('');
      return;
    }

    // 3. HOMEPAGE / MAIN ENTRY COMMANDS
    if (
      lower === 'open k akash' ||
      lower === 'k akash' ||
      lower === 'open akash' ||
      lower === 'akash' ||
      lower === 'open portfolio' ||
      lower === 'portfolio' ||
      lower === 'home' ||
      lower === 'open home' ||
      lower === 'exit' ||
      lower === 'start' ||
      lower === 'launch' ||
      lower === 'enter'
    ) {
      setHistory((prev) => [...prev, inputEntry]);
      setInputVal('');
      executeTransition('Homepage', () => {
        onNavigate('home');
      });
      return;
    }

    // 4. CERTIFICATES COMMANDS
    if (
      lower === 'certificate' ||
      lower === 'certificates' ||
      lower === 'open certificate' ||
      lower === 'open certificates' ||
      lower === 'cert' ||
      lower === 'certs' ||
      lower === 'open cert' ||
      lower === 'open certs'
    ) {
      setHistory((prev) => [...prev, inputEntry]);
      setInputVal('');
      executeTransition('Certificates Section', () => {
        onNavigate('certifications');
      });
      return;
    }

    // 5. PROJECTS COMMANDS
    if (
      lower === 'project' ||
      lower === 'projects' ||
      lower === 'open project' ||
      lower === 'open projects'
    ) {
      setHistory((prev) => [...prev, inputEntry]);
      setInputVal('');
      executeTransition('Projects Section', () => {
        onNavigate('projects');
      });
      return;
    }

    // 6. ABOUT / WHOAMI COMMANDS
    if (
      lower === 'about' ||
      lower === 'open about' ||
      lower === 'whoami' ||
      lower === 'bio' ||
      lower === 'info'
    ) {
      setHistory((prev) => [...prev, inputEntry]);
      setInputVal('');
      executeTransition('About Section', () => {
        onNavigate('about');
      });
      return;
    }

    // 7. SKILLS COMMANDS
    if (
      lower === 'skill' ||
      lower === 'skills' ||
      lower === 'open skill' ||
      lower === 'open skills' ||
      lower === 'tech' ||
      lower === 'stack'
    ) {
      setHistory((prev) => [...prev, inputEntry]);
      setInputVal('');
      executeTransition('Skills Matrix', () => {
        onNavigate('skills');
      });
      return;
    }

    // 8. RESUME / CV COMMANDS
    if (
      lower === 'resume' ||
      lower === 'cv' ||
      lower === 'open resume' ||
      lower === 'open cv' ||
      lower === 'curriculum vitae'
    ) {
      setHistory((prev) => [...prev, inputEntry]);
      setInputVal('');
      executeTransition('Curriculum Vitae', () => {
        onNavigate('home');
        onOpenResume();
      });
      return;
    }

    // 9. CONTACT COMMANDS
    if (
      lower === 'contact' ||
      lower === 'contact me' ||
      lower === 'open contact' ||
      lower === 'email' ||
      lower === 'reach' ||
      lower === 'message'
    ) {
      setHistory((prev) => [...prev, inputEntry]);
      setInputVal('');
      executeTransition('Contact Section', () => {
        onNavigate('contact');
      });
      return;
    }

    // 10. EDUCATION COMMANDS
    if (
      lower === 'education' ||
      lower === 'open education' ||
      lower === 'academic' ||
      lower === 'academics' ||
      lower === 'college' ||
      lower === 'university'
    ) {
      setHistory((prev) => [...prev, inputEntry]);
      setInputVal('');
      executeTransition('Education Section', () => {
        onNavigate('education');
      });
      return;
    }

    // 11. ACHIEVEMENTS COMMANDS
    if (
      lower === 'achievements' ||
      lower === 'achievement' ||
      lower === 'awards' ||
      lower === 'award' ||
      lower === 'open achievements' ||
      lower === 'hackathons'
    ) {
      setHistory((prev) => [...prev, inputEntry]);
      setInputVal('');
      executeTransition('Achievements Section', () => {
        onNavigate('achievements');
      });
      return;
    }

    // UNKNOWN COMMAND HANDLER
    const errorOutput: CommandHistoryItem = {
      id: `err-${Date.now()}`,
      type: 'error',
      text: (
        <div className="space-y-1 text-rose-300 font-mono-tech text-xs sm:text-sm">
          <div>command not found: <span className="text-white font-bold">{rawCommand}</span></div>
          <div className="text-slate-400 text-xs">
            Type <button type="button" onClick={() => handleCommand('help')} className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200 cursor-pointer">&quot;help&quot;</button> for available commands.
          </div>
        </div>
      ),
    };

    setHistory((prev) => [...prev, inputEntry, errorOutput]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = cmdHistoryIdx === -1 ? cmdHistory.length - 1 : Math.max(0, cmdHistoryIdx - 1);
      setCmdHistoryIdx(nextIdx);
      setInputVal(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistoryIdx === -1) return;
      const nextIdx = cmdHistoryIdx + 1;
      if (nextIdx >= cmdHistory.length) {
        setCmdHistoryIdx(-1);
        setInputVal('');
      } else {
        setCmdHistoryIdx(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocompletion
      const val = inputVal.toLowerCase().trim();
      const suggestions = [
        'open k akash',
        'certificates',
        'projects',
        'skills',
        'about',
        'resume',
        'contact',
        'education',
        'achievements',
        'help',
        'clear',
      ];
      const match = suggestions.find((s) => s.startsWith(val));
      if (match) {
        setInputVal(match);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/40 backdrop-blur-md transition-all duration-500 ${
        isClosing ? 'opacity-0 scale-95 blur-xl pointer-events-none' : 'opacity-100 scale-100 blur-none'
      }`}
      onClick={handleFocus}
    >
      {/* Outer Glow Backdrop */}
      <div className="absolute inset-0 bg-radial-gradient from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Futuristic Glassmorphism Terminal Window */}
      <div
        ref={terminalContainerRef}
        className={`relative w-full ${
          isMaximized
            ? 'max-w-none h-[95vh]'
            : 'max-w-3xl sm:max-w-4xl h-[80vh] sm:h-[75vh] max-h-[720px]'
        } flex flex-col rounded-2xl sm:rounded-3xl bg-[#040914]/85 backdrop-blur-2xl border border-cyan-400/35 shadow-[0_0_50px_rgba(6,182,212,0.18),0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-300 text-slate-100 font-mono-tech select-text`}
        onClick={(e) => {
          e.stopPropagation();
          handleFocus();
        }}
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-cyan-400/20 bg-[#071322]/90 backdrop-blur-md select-none">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Window control dots */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCommand('open k akash');
                }}
                className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-400 border border-rose-400/40 transition-colors"
                title="Close Terminal & Enter Website"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCommand('clear');
                }}
                className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 border border-amber-400/40 transition-colors"
                title="Clear Output"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMaximized(!isMaximized);
                }}
                className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 border border-emerald-400/40 transition-colors"
                title={isMaximized ? 'Restore' : 'Maximize'}
              />
            </div>

            {/* Title / Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs sm:text-sm font-bold text-white tracking-wider flex items-center gap-2">
                <span>AKASH OS // TERMINAL</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono-tech bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
                  v4.18
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">ONLINE</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMaximized(!isMaximized);
              }}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors hidden sm:block"
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCommand('open k akash');
              }}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Enter Website"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 font-mono-tech text-xs sm:text-sm leading-relaxed scrollbar-thin">
          {/* Boot Sequence Lines */}
          <div className="space-y-1 text-slate-300">
            {bootPhase >= 1 && (
              <div className="text-cyan-400 font-bold flex items-center gap-2 animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>AKASH OS v4.18</span>
              </div>
            )}
            {bootPhase >= 2 && (
              <div className="text-slate-400 animate-fade-in flex items-center gap-2">
                <span className="text-cyan-500">&gt;</span>
                <span>Initializing...</span>
              </div>
            )}
            {bootPhase >= 3 && (
              <div className="text-slate-400 animate-fade-in flex items-center gap-2">
                <span className="text-cyan-500">&gt;</span>
                <span>Loading portfolio...</span>
              </div>
            )}
            {bootPhase >= 4 && (
              <div className="text-emerald-400 font-bold animate-fade-in flex items-center gap-2 pb-2 border-b border-white/10">
                <span className="text-emerald-500">&gt;</span>
                <span>System ready.</span>
              </div>
            )}
          </div>

          {/* User Command History Output */}
          {history.map((item) => (
            <div key={item.id} className="animate-fade-in">
              {item.type === 'input' && (
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <span className="text-cyan-400">&gt;</span>
                  <span>{item.text}</span>
                </div>
              )}
              {item.type !== 'input' && <div className="pl-4">{item.text}</div>}
            </div>
          ))}

          {/* Active Command Prompt Line */}
          {bootComplete && (
            <div className="pt-1">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCommand(inputVal);
                }}
                className="flex items-center gap-2 text-slate-100 flex-wrap sm:flex-nowrap"
              >
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold whitespace-nowrap select-none">
                  <span className="text-emerald-400">guest@akash</span>
                  <span className="text-slate-400">:</span>
                  <span className="text-sky-300">~</span>
                  <span className="text-cyan-400">$</span>
                </div>

                <div className="relative flex-1 min-w-[200px] flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                    placeholder="Type command (e.g. open k akash, projects, certificates, help)..."
                    className="w-full bg-transparent border-none outline-none text-white font-mono-tech text-xs sm:text-sm placeholder:text-slate-600 focus:ring-0 p-0"
                  />
                  {/* Blinking block/underscore cursor when focused */}
                  <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-0.5" />
                </div>

                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-[11px] font-mono-tech flex items-center gap-1 cursor-pointer transition-all hover:border-cyan-300 ml-auto"
                >
                  <span>Run</span>
                  <CornerDownLeft className="w-3 h-3" />
                </button>
              </form>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Quick Command Suggestions Footer Bar for Mobile & Desktop */}
        {bootComplete && (
          <div className="px-4 py-2.5 sm:py-3 border-t border-cyan-400/20 bg-[#06101d]/90 backdrop-blur-md select-none">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-mono-tech text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-cyan-400" />
                <span>Quick Commands (click to execute):</span>
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                Press Enter to run • Tab for autocomplete
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                type="button"
                onClick={() => handleCommand('open k akash')}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-200 border border-cyan-400/40 text-[11px] font-mono-tech whitespace-nowrap flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span>open k akash</span>
              </button>

              <button
                type="button"
                onClick={() => handleCommand('certificates')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[11px] font-mono-tech whitespace-nowrap flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer hover:border-cyan-400/30"
              >
                <Award className="w-3 h-3 text-sky-400" />
                <span>certificates</span>
              </button>

              <button
                type="button"
                onClick={() => handleCommand('projects')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[11px] font-mono-tech whitespace-nowrap flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer hover:border-cyan-400/30"
              >
                <FolderGit2 className="w-3 h-3 text-cyan-400" />
                <span>projects</span>
              </button>

              <button
                type="button"
                onClick={() => handleCommand('skills')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[11px] font-mono-tech whitespace-nowrap flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer hover:border-cyan-400/30"
              >
                <Layers className="w-3 h-3 text-indigo-400" />
                <span>skills</span>
              </button>

              <button
                type="button"
                onClick={() => handleCommand('about')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[11px] font-mono-tech whitespace-nowrap flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer hover:border-cyan-400/30"
              >
                <User className="w-3 h-3 text-emerald-400" />
                <span>about</span>
              </button>

              <button
                type="button"
                onClick={() => handleCommand('resume')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[11px] font-mono-tech whitespace-nowrap flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer hover:border-cyan-400/30"
              >
                <FileText className="w-3 h-3 text-amber-400" />
                <span>resume</span>
              </button>

              <button
                type="button"
                onClick={() => handleCommand('contact')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[11px] font-mono-tech whitespace-nowrap flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer hover:border-cyan-400/30"
              >
                <Mail className="w-3 h-3 text-rose-400" />
                <span>contact</span>
              </button>

              <button
                type="button"
                onClick={() => handleCommand('help')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] font-mono-tech whitespace-nowrap flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>help</span>
              </button>

              <button
                type="button"
                onClick={() => handleCommand('clear')}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10 text-[11px] font-mono-tech whitespace-nowrap flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer ml-auto"
              >
                <span>clear</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
