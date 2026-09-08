import React from 'react';
import { X, Download, FileText, Printer, CheckCircle, ExternalLink, Sparkles, Phone, Mail, Github, Linkedin } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { profile, projects, skills, certificates, education, achievements } = usePortfolio();

  if (!isOpen) return null;

  const name = profile?.name || 'K AKASH';
  const tagline = profile?.tagline || 'B.Tech CSE (5th Sem) | AI/ML & Full Stack Engineer | CMR University';
  const email = profile?.email || 'kakashsunny2007@gmail.com';
  const phone = profile?.phone || '+91 7483041745';
  const github = profile?.github || 'https://github.com/kakashsunny';
  const linkedin = profile?.linkedin || 'https://www.linkedin.com/in/k-akash-620b63427/';
  const location = profile?.location || 'Bengaluru, Karnataka';
  const bio = profile?.bio || 'Computer Science undergraduate at CMR University with hands-on experience building full-stack AI-powered applications using the MERN stack, PostgreSQL, and LLM APIs. Currently deepening expertise in agentic AI systems (LangChain, RAG). IEEE award winner with a track record of shipping and deploying live projects end-to-end.';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const markdownContent = `# ${name} - ${tagline}
Email: ${email} | Phone: ${phone} | Location: ${location}
GitHub: ${github} | LinkedIn: ${linkedin}

---

## Professional Summary
${bio}

---

## Technical Skills
${skills
  .map(
    (cat) =>
      `### ${cat.name}\n${cat.skills.map((s) => `- **${s.name}** (${s.experience}, Proficiency: ${s.level}%)`).join('\n')}`
  )
  .join('\n\n')}

---

## Key Projects
${projects
  .map(
    (p) => `### ${p.title} (${p.category})
*${p.tagline}*
- ${p.description}
- **Stack**: ${p.tags.join(', ')}
- **GitHub**: ${p.githubUrl || github}
- **Highlights**:
${p.highlights.map((h) => `  - ${h}`).join('\n')}
`
  )
  .join('\n')}

---

## Education
${education
  .map(
    (e) => `### ${e.degree} - ${e.field}
**${e.institution}** (${e.location}) | ${e.period} | Grade: **${e.grade}** (${e.status})
- Highlights: ${e.highlights.join('; ')}
`
  )
  .join('\n')}

---

## Certifications
${certificates
  .map((c) => `- **${c.title}** (${c.issuer}, ${c.issueDate}) [ID: ${c.credentialId}]`)
  .join('\n')}

---

## Honors & Awards
${achievements
  .map((a) => `- **${a.title}** - ${a.organization} (${a.date}): ${a.description}`)
  .join('\n')}
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `K_AKASH_Resume_${new Date().getFullYear()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl animate-fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel border border-cyan-400/30 shadow-[0_30px_90px_rgba(0,0,0,0.9)] p-6 sm:p-10 space-y-6 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky top-0 bg-[#071120]/90 backdrop-blur-md z-20 -mt-2 pt-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span className="font-display font-bold text-white text-base sm:text-lg">
              Curriculum Vitae Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-all"
                title="Download Uploaded PDF Resume"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            )}
            <button
              onClick={handleDownloadMarkdown}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all cursor-pointer"
              title="Download Markdown Resume"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.MD)</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl glass-pill hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
              title="Print to PDF"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full glass-pill hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resume Content Body */}
        <div className="space-y-6 font-sans">
          {/* Header */}
          <div className="border-b border-white/10 pb-6 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              {name}
            </h1>
            <p className="text-cyan-300 font-mono-tech text-sm font-semibold">
              {tagline}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-300 font-mono-tech pt-2">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-cyan-400" /> {email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> {phone}
              </span>
              <span>•</span>
              <span>{location}</span>
              <span>•</span>
              <a href={github} target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">
                github.com/kakashsunny
              </a>
              <span>•</span>
              <a href={linkedin} target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">
                linkedin.com/in/k-akash
              </a>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold font-mono-tech text-cyan-400 uppercase tracking-wider">
              01 // Professional Summary
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed">{bio}</p>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold font-mono-tech text-cyan-400 uppercase tracking-wider">
              02 // Education & Academics
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs">
                <div className="flex items-center justify-between text-white font-bold">
                  <span>{edu.degree} - {edu.field}</span>
                  <span className="font-mono-tech text-cyan-300">{edu.grade}</span>
                </div>
                <div className="text-slate-300 flex justify-between font-mono-tech">
                  <span>{edu.institution} ({edu.location})</span>
                  <span>{edu.period} ({edu.status})</span>
                </div>
                <p className="text-slate-400 mt-1">{edu.highlights.join(' • ')}</p>
              </div>
            ))}
          </div>

          {/* Featured Projects */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold font-mono-tech text-cyan-400 uppercase tracking-wider">
              03 // Key Production & AI Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-white font-bold">
                  <span>{proj.title}</span>
                  <span className="font-mono-tech text-cyan-300">{proj.category}</span>
                </div>
                <p className="text-slate-300">{proj.description}</p>
                <div className="font-mono-tech text-slate-400">
                  <strong className="text-white">Stack:</strong> {proj.tags.join(', ')}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold font-mono-tech text-cyan-400 uppercase tracking-wider">
              04 // Verified Certifications & Badges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {certificates.map((cert) => (
                <div key={cert.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <strong className="text-white block">{cert.title}</strong>
                  <span className="text-slate-400 font-mono-tech text-[11px]">{cert.issuer} • {cert.issueDate}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Honors & Hackathon Achievements */}
          {achievements.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold font-mono-tech text-cyan-400 uppercase tracking-wider">
                05 // Honors & Awards
              </h2>
              <div className="space-y-2 text-xs">
                {achievements.map((ach) => (
                  <div key={ach.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between">
                    <div>
                      <strong className="text-white">{ach.title}</strong>
                      <p className="text-slate-400 text-[11px] font-mono-tech">{ach.organization} • {ach.date}</p>
                      <p className="text-slate-300 text-xs mt-0.5">{ach.description}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-tech text-[11px]">
                      {ach.metric}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
