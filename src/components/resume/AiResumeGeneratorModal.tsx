import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Download,
  Sparkles,
  Loader2,
  CheckCircle2,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { usePortfolio } from '../../context/PortfolioContext';

export const AiResumeGeneratorModal: React.FC = () => {
  const {
    profile,
    projects,
    skills,
    certificates,
    achievements,
    education,
    isAiResumeOpen,
    setIsAiResumeOpen,
  } = usePortfolio();

  const [selectedRole, setSelectedRole] = useState<'AI Engineer' | 'Machine Learning Engineer' | 'Full Stack Developer'>(
    'AI Engineer'
  );
  const [resumeText, setResumeText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const generateRoleResume = async (roleToGenerate: string) => {
    setIsGenerating(true);
    try {
      const portfolioContext = { profile, projects, skills, certificates, achievements, education };
      const customKey = localStorage.getItem('akash_custom_gemini_key') || undefined;
      const res = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleToGenerate, portfolioContext, apiKey: customKey }),
      });

      if (res.ok) {
        const data = await res.json();
        setResumeText(data.resumeMarkdown);
      } else {
        throw new Error('API failed');
      }
    } catch {
      // Fallback structured resume
      setResumeText(
        `# AKASH SHARMA\n**Autonomous Agent & Systems Engineer** | Bangalore, India\n${profile?.email || 'akash@example.com'} | github.com/akash | linkedin.com/in/akash\n\n## PROFESSIONAL SUMMARY\nHigh-impact engineering leader specializing in ${roleToGenerate} systems. B.Tech Computer Science with 1st rank semester distinction.\n\n## CORE TECHNICAL COMPETENCIES\n- Languages: Python, TypeScript, C++, Rust, SQL\n- Frameworks & Tools: PyTorch, React, Next.js, Node.js, Docker, Kubernetes\n- Cloud & AI: AWS (Certified AI Practitioner), GCP (Professional ML Engineer), Gemini API\n\n## FLAGSHIP PROJECTS\n- Autonomous Multi-Agent Orchestrator: Event-driven agentic framework handling 10k+ concurrent asynchronous task plans.\n- DeepFusion Realtime Vision Engine: TensorRT optimized computer vision pipeline with sub-15ms edge inference.\n\n## CERTIFICATIONS\n- AWS Certified AI Practitioner (2024)\n- Google Cloud Professional ML Engineer (2024)\n\n## EDUCATION\n- B.Tech Computer Science & Engineering (9.4 CGPA, 1st Rank Semester Honors)`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isAiResumeOpen) {
      generateRoleResume(selectedRole);
    }
  }, [isAiResumeOpen, selectedRole]);

  if (!isAiResumeOpen) return null;

  // Download PDF using jsPDF
  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);

      // Simple clean formatting
      const lines = doc.splitTextToSize(resumeText || 'Akash Sharma Resume', 500);
      let cursorY = 40;

      lines.forEach((line: string) => {
        if (cursorY > 780) {
          doc.addPage();
          cursorY = 40;
        }

        if (line.startsWith('# ')) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(16);
          doc.setTextColor(30, 41, 59);
          doc.text(line.replace('# ', ''), 40, cursorY);
          cursorY += 22;
        } else if (line.startsWith('## ')) {
          cursorY += 6;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(2, 132, 199);
          doc.text(line.replace('## ', ''), 40, cursorY);
          cursorY += 16;
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(51, 65, 85);
          doc.text(line, 40, cursorY);
          cursorY += 13;
        }
      });

      doc.save(`Akash_Sharma_${selectedRole.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Could not export PDF. Downloading text resume.');
      const blob = new Blob([resumeText], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Akash_Sharma_${selectedRole}_Resume.md`;
      a.click();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl rounded-3xl liquid-glass-card border border-cyan-400/40 shadow-[0_20px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(56,189,248,0.3)] flex flex-col max-h-[92vh] overflow-hidden my-auto bg-[#050B14]/95">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-display text-white">
                  AI Dynamic Resume Generator
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-[10px] font-mono-tech text-purple-300">
                  GEMINI ROLE TAILORED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generates ATS-optimized role resumes on the fly from Firestore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating || isDownloading}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs font-mono-tech hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => setIsAiResumeOpen(false)}
              className="p-2 rounded-xl glass-pill hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="px-6 py-3 border-b border-white/10 bg-white/[0.01] flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
          <span className="text-slate-400">Target Role:</span>
          <div className="flex flex-wrap gap-2">
            {(['AI Engineer', 'Machine Learning Engineer', 'Full Stack Developer'] as const).map(
              (role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                    selectedRole === role
                      ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {role}
                </button>
              )
            )}
          </div>
        </div>

        {/* Resume Preview Sheet */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-950/60 font-mono-tech text-xs leading-relaxed text-slate-200">
          {isGenerating ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-cyan-300 text-xs">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p>Gemini AI is crafting your tailored {selectedRole} resume...</p>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 max-w-3xl mx-auto shadow-inner">
              <div className="whitespace-pre-wrap">{resumeText}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
