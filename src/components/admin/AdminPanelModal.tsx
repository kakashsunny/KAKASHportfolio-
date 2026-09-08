import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  UserCheck,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Save,
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Award,
  Sparkles,
  BookOpen,
  Trophy,
  Sliders,
  Settings,
  Layers,
  Image as ImageIcon,
  Key,
  Shield,
  Loader2,
  ExternalLink,
  Phone,
  Mail,
  Github,
  Linkedin,
  FileText,
  RotateCcw,
  Flame,
  BrainCircuit,
  Code2,
  CloudLightning,
  Cpu,
  Terminal,
  Globe,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CloudinaryImageUploader } from './CloudinaryImageUploader';
import {
  updateProfile,
  addProject,
  updateProject,
  deleteProject,
  clearAllProjects,
  saveSkillCategory,
  deleteSkillCategory,
  addCertificate,
  updateCertificate,
  deleteCertificate,
  clearAllCertificates,
  addAchievement,
  updateAchievement,
  deleteAchievement,
  addEducation,
  updateEducation,
  deleteEducation,
  saveSocialLinks,
  resetToAkashResumeDefaults,
} from '../../services/firestoreService';
import { PERSONAL_INFO, SOCIAL_LINKS } from '../../data/portfolioData';
import { getCloudinaryConfig, saveCloudinaryConfig, CloudinaryConfig } from '../../lib/cloudinary';
import type { Project, SkillCategory, Certification, Achievement, EducationItem, SocialLink } from '../../types';

export const AdminPanelModal: React.FC = () => {
  const {
    user,
    isAdmin,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    profile,
    projects,
    skills,
    certificates,
    achievements,
    education,
    socialLinks,
    refreshData,
    isAdminPanelOpen,
    setIsAdminPanelOpen,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'projects' | 'skills' | 'certificates' | 'achievements' | 'education' | 'socials' | 'settings'
  >('profile');

  // Auth form state
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Status message
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Profile State
  const [profileForm, setProfileForm] = useState({
    name: profile?.name || PERSONAL_INFO.name,
    tagline: profile?.tagline || PERSONAL_INFO.tagline,
    bio: profile?.bio || PERSONAL_INFO.bio,
    location: profile?.location || PERSONAL_INFO.location,
    email: profile?.email || PERSONAL_INFO.email,
    phone: profile?.phone || PERSONAL_INFO.phone,
    github: profile?.github || PERSONAL_INFO.github,
    linkedin: profile?.linkedin || PERSONAL_INFO.linkedin,
    portfolioUrl: profile?.portfolioUrl || PERSONAL_INFO.portfolioUrl,
    college: profile?.college || PERSONAL_INFO.college,
    degree: profile?.degree || PERSONAL_INFO.degree,
    semester: profile?.semester || PERSONAL_INFO.semester,
    cgpa: profile?.cgpa || PERSONAL_INFO.cgpa,
    status: profile?.status || PERSONAL_INFO.status,
    avatarUrl: profile?.avatarUrl || PERSONAL_INFO.avatarUrl,
    resumeUrl: profile?.resumeUrl || '',
    yearsOfExp: profile?.yearsOfExp || '2+',
  });

  // Sync profileForm with profile updates
  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || PERSONAL_INFO.name,
        tagline: profile.tagline || PERSONAL_INFO.tagline,
        bio: profile.bio || PERSONAL_INFO.bio,
        location: profile.location || PERSONAL_INFO.location,
        email: profile.email || PERSONAL_INFO.email,
        phone: profile.phone || PERSONAL_INFO.phone,
        github: profile.github || PERSONAL_INFO.github,
        linkedin: profile.linkedin || PERSONAL_INFO.linkedin,
        portfolioUrl: profile.portfolioUrl || PERSONAL_INFO.portfolioUrl,
        college: profile.college || PERSONAL_INFO.college,
        degree: profile.degree || PERSONAL_INFO.degree,
        semester: profile.semester || PERSONAL_INFO.semester,
        cgpa: profile.cgpa || PERSONAL_INFO.cgpa,
        status: profile.status || PERSONAL_INFO.status,
        avatarUrl: profile.avatarUrl || PERSONAL_INFO.avatarUrl,
        resumeUrl: profile.resumeUrl || '',
        yearsOfExp: profile.yearsOfExp || '2+',
      });
    }
  }, [profile]);

  // 2. Project Editing State
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  // 3. Certificate Editing State
  const [editingCert, setEditingCert] = useState<Partial<Certification> | null>(null);

  // 4. Achievement Editing State
  const [editingAch, setEditingAch] = useState<Partial<Achievement> | null>(null);

  // 5. Education Editing State
  const [editingEdu, setEditingEdu] = useState<Partial<EducationItem> | null>(null);

  // 6. Skill Category Editing State
  const [editingSkillCat, setEditingSkillCat] = useState<Partial<SkillCategory> | null>(null);

  // 7. Cloudinary & API Settings State
  const [cloudConfig, setCloudConfig] = useState<CloudinaryConfig>(getCloudinaryConfig());
  const [geminiKeyInput, setGeminiKeyInput] = useState<string>(
    localStorage.getItem('akash_custom_gemini_key') || ''
  );

  if (!isAdminPanelOpen) return null;

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Auth Handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      if (isRegisterMode) {
        await registerWithEmail(authEmail, authPass);
      } else {
        await loginWithEmail(authEmail, authPass);
      }
      showNotification('Authenticated successfully as Admin!');
    } catch (err: unknown) {
      console.error('Auth error:', err);
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setAuthError(msg);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(profileForm);

      // Also sync to social links list
      const updatedSocials: SocialLink[] = [
        { name: 'GitHub', url: profileForm.github, icon: 'Github', handle: '@kakashsunny', color: 'hover:text-white' },
        { name: 'LinkedIn', url: profileForm.linkedin, icon: 'Linkedin', handle: 'in/k-akash-620b63427', color: 'hover:text-cyan-400' },
        { name: 'Portfolio', url: profileForm.portfolioUrl, icon: 'ExternalLink', handle: 'akashsunnyportfoilo.netlify.app', color: 'hover:text-sky-400' },
        { name: 'Email', url: `mailto:${profileForm.email}`, icon: 'Mail', handle: profileForm.email, color: 'hover:text-emerald-400' },
        { name: 'WhatsApp', url: `https://wa.me/${profileForm.phone.replace(/[^0-9]/g, '')}`, icon: 'MessageSquare', handle: profileForm.phone, color: 'hover:text-green-400' },
      ];
      await saveSocialLinks(updatedSocials);

      await refreshData();
      showNotification('Profile and Social Links updated successfully in Firestore!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to K Akash's Real Data
  const handleResetToRealData = async () => {
    if (!window.confirm('Sync and overwrite Firestore with K Akash’s real resume data (Formly AI, IEEE Awards, Google Cloud Badges, Contacts)?')) {
      return;
    }
    setIsSaving(true);
    try {
      await resetToAkashResumeDefaults();
      await refreshData();
      showNotification('Successfully synced real resume data to Firestore!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sync failed';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Projects Handlers
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsSaving(true);
    try {
      const projData = {
        title: editingProject.title || 'Untitled Project',
        tagline: editingProject.tagline || '',
        description: editingProject.description || '',
        category: editingProject.category || 'AI / ML',
        image:
          editingProject.image ||
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
        tags: editingProject.tags || ['React', 'TypeScript', 'Tailwind CSS'],
        metrics: editingProject.metrics || [{ label: 'Performance', value: '100%' }],
        featured: editingProject.featured ?? true,
        githubUrl: editingProject.githubUrl || 'https://github.com/kakashsunny',
        liveUrl: editingProject.liveUrl || 'https://akashsunnyportfoilo.netlify.app',
        highlights: editingProject.highlights || ['Engineered with high performance'],
        architecture: editingProject.architecture || 'React and Node.js stack',
      };

      if (editingProject.id) {
        await updateProject(editingProject.id, projData);
        showNotification('Project updated in Firestore!');
      } else {
        await addProject(projData);
        showNotification('New project created in Firestore!');
      }
      setEditingProject(null);
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving project';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      await refreshData();
      showNotification('Project deleted from Firestore.');
    } catch {
      alert('Failed to delete project');
    }
  };

  const handleClearAllProjects = async () => {
    if (!window.confirm('Delete all projects from Firestore?')) return;
    try {
      await clearAllProjects();
      await refreshData();
      showNotification('All projects cleared.');
    } catch {
      alert('Failed to clear projects');
    }
  };

  // Certificates Handlers
  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;
    setIsSaving(true);
    try {
      const certData = {
        title: editingCert.title || 'Certification',
        issuer: editingCert.issuer || 'Issuer Organization',
        issueDate: editingCert.issueDate || '2025',
        credentialId: editingCert.credentialId || 'ID-12345',
        credentialUrl: editingCert.credentialUrl || 'https://github.com/kakashsunny',
        badgeColor: editingCert.badgeColor || 'from-sky-500 to-cyan-400',
        skills: editingCert.skills || ['AI', 'Engineering'],
        description: editingCert.description || 'Verified competency.',
        iconName: editingCert.iconName || 'Cloud',
      };

      if (editingCert.id) {
        await updateCertificate(editingCert.id, certData);
        showNotification('Certificate updated in Firestore!');
      } else {
        await addCertificate(certData);
        showNotification('Certificate added to Firestore!');
      }
      setEditingCert(null);
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving certificate';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!window.confirm('Delete this certificate?')) return;
    try {
      await deleteCertificate(id);
      await refreshData();
      showNotification('Certificate deleted.');
    } catch {
      alert('Failed to delete certificate');
    }
  };

  const handleClearAllCertificates = async () => {
    if (!window.confirm('Delete all certificates from Firestore?')) return;
    try {
      await clearAllCertificates();
      await refreshData();
      showNotification('All certificates cleared.');
    } catch {
      alert('Failed to clear certificates');
    }
  };

  // Education Handlers
  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;
    setIsSaving(true);
    try {
      const eduData = {
        degree: editingEdu.degree || 'Bachelor of Technology (B.Tech)',
        field: editingEdu.field || 'Computer Science and Engineering',
        institution: editingEdu.institution || 'CMR University',
        location: editingEdu.location || 'Bengaluru, Karnataka',
        period: editingEdu.period || '2024 – 2028',
        grade: editingEdu.grade || '8.52 CGPA',
        status: editingEdu.status || 'Currently in 5th Semester',
        highlights: editingEdu.highlights || ['IEEE Award Winner'],
        coursework: editingEdu.coursework || ['Data Structures', 'DBMS', 'AI/ML'],
      };

      if (editingEdu.id) {
        await updateEducation(editingEdu.id, eduData);
        showNotification('Education record updated!');
      } else {
        await addEducation(eduData);
        showNotification('Education record added!');
      }
      setEditingEdu(null);
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving education';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      await deleteEducation(id);
      await refreshData();
      showNotification('Education entry deleted.');
    } catch {
      alert('Failed to delete education entry');
    }
  };

  // Achievement Handlers
  const handleSaveAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAch) return;
    setIsSaving(true);
    try {
      const achData = {
        title: editingAch.title || 'Achievement Title',
        category: editingAch.category || 'Hackathon',
        date: editingAch.date || '2025',
        organization: editingAch.organization || 'Organization',
        metric: editingAch.metric || 'Winner',
        metricLabel: editingAch.metricLabel || 'Award',
        description: editingAch.description || '',
        badge: editingAch.badge || '🏆 Winner',
      };

      if (editingAch.id) {
        await updateAchievement(editingAch.id, achData);
        showNotification('Achievement updated in Firestore!');
      } else {
        await addAchievement(achData);
        showNotification('Achievement added to Firestore!');
      }
      setEditingAch(null);
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving achievement';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!window.confirm('Delete this achievement?')) return;
    try {
      await deleteAchievement(id);
      await refreshData();
      showNotification('Achievement deleted.');
    } catch {
      alert('Failed to delete achievement');
    }
  };

  // Skill Category Handlers
  const handleSaveSkillCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkillCat) return;
    setIsSaving(true);
    try {
      const catData: SkillCategory & { id?: string } = {
        id: editingSkillCat.id,
        name: editingSkillCat.name || 'Core Skills',
        icon: editingSkillCat.icon || 'Code2',
        description: editingSkillCat.description || 'Specialized competencies',
        skills: editingSkillCat.skills || [
          { name: 'TypeScript', level: 90, experience: '2+ yrs', popular: true },
        ],
      };
      await saveSkillCategory(catData);
      setEditingSkillCat(null);
      await refreshData();
      showNotification('Skill Category saved to Firestore!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving skill category';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSkillCategory = async (id: string) => {
    if (!window.confirm('Delete this skill category?')) return;
    try {
      await deleteSkillCategory(id);
      await refreshData();
      showNotification('Skill category deleted.');
    } catch {
      alert('Failed to delete skill category');
    }
  };

  // Cloudinary Settings Save
  const handleSaveCloudinary = (e: React.FormEvent) => {
    e.preventDefault();
    saveCloudinaryConfig(cloudConfig);
    showNotification('Cloudinary configuration saved!');
  };

  const handleSaveGeminiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (geminiKeyInput.trim()) {
      localStorage.setItem('akash_custom_gemini_key', geminiKeyInput.trim());
      showNotification('Custom Gemini API Key saved to browser!');
    } else {
      localStorage.removeItem('akash_custom_gemini_key');
      showNotification('Custom key cleared. Default environment key active.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl glass-panel border border-cyan-400/30 shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#071120]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <span>Akash OS // Admin CMS & Data Manager</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tech bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Firestore Live
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono-tech">
                {user ? `Logged in: ${user.email}` : 'Guest Admin Mode (Edit & Sync directly to Firestore)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToRealData}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 text-slate-950 font-bold text-xs hover:scale-105 transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)] cursor-pointer"
              title="Sync all K Akash real resume details, projects, awards, and contacts"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sync Real Resume Data</span>
            </button>

            {user ? (
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-xl glass-pill hover:bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : null}

            <button
              onClick={() => setIsAdminPanelOpen(false)}
              className="p-2 rounded-full glass-pill hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notification Banner */}
        {saveSuccess && (
          <div className="bg-emerald-500/20 border-b border-emerald-400/30 px-6 py-2.5 flex items-center gap-2 text-xs font-mono-tech text-emerald-300 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Navigation Tabs Header */}
        <div className="flex items-center gap-1 px-5 py-2.5 bg-[#050B14]/60 border-b border-white/10 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Profile & Contacts</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'certificates'
                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certificates ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'skills'
                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Skills Matrix ({skills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('education')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'education'
                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Education ({education.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Achievements ({achievements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Cloudinary & Keys</span>
          </button>
        </div>

        {/* Scrollable Main Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* TAB 1: PROFILE & CONTACTS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/20">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-cyan-200">K Akash's Verified Profile Data</h3>
                  <p className="text-xs text-slate-300">
                    Update phone, email, GitHub, LinkedIn, CMR University academics, and resume URL in one click.
                  </p>
                </div>
                <button
                  onClick={handleResetToRealData}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Real Resume Info</span>
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-slate-300 font-semibold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Tagline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-slate-300 font-semibold">
                      Tagline / Roles Headline
                    </label>
                    <input
                      type="text"
                      value={profileForm.tagline}
                      onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-slate-300 font-semibold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Email Address *</span>
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Phone / Mobile */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-slate-300 font-semibold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Mobile Number *</span>
                    </label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      required
                      placeholder="+91 7483041745"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* GitHub Profile */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-slate-300 font-semibold flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5 text-white" />
                      <span>GitHub URL *</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={profileForm.github}
                        onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                        required
                        placeholder="https://github.com/kakashsunny"
                        className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                      <a
                        href={profileForm.github}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white flex items-center"
                        title="Test GitHub Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* LinkedIn Profile */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-slate-300 font-semibold flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>LinkedIn URL *</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        required
                        placeholder="https://www.linkedin.com/in/k-akash-620b63427/"
                        className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                      <a
                        href={profileForm.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white flex items-center"
                        title="Test LinkedIn Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Portfolio URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-slate-300 font-semibold">
                      Live Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={profileForm.portfolioUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, portfolioUrl: e.target.value })}
                      placeholder="https://akashsunnyportfoilo.netlify.app"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Resume PDF Download URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-slate-300 font-semibold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      <span>Custom Resume File URL (PDF / Cloudinary)</span>
                    </label>
                    <input
                      type="url"
                      value={profileForm.resumeUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
                      placeholder="https://res.cloudinary.com/.../akash_resume.pdf"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* College / Institution */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-slate-300 font-semibold">
                      College / University
                    </label>
                    <input
                      type="text"
                      value={profileForm.college}
                      onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                      placeholder="CMR University, Bengaluru"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Degree & Semester */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-slate-300 font-semibold">
                      Degree & Semester
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={profileForm.degree}
                        onChange={(e) => setProfileForm({ ...profileForm, degree: e.target.value })}
                        placeholder="B.Tech CSE"
                        className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                      <input
                        type="text"
                        value={profileForm.semester}
                        onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                        placeholder="5th Semester"
                        className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-slate-300 font-semibold">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      placeholder="Bengaluru, Karnataka"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-slate-300 font-semibold">
                      Hiring Status Badge
                    </label>
                    <input
                      type="text"
                      value={profileForm.status}
                      onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
                      placeholder="Open for AI/ML & Engineering Roles"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono-tech text-slate-300 font-semibold">
                    Professional Bio & Summary
                  </label>
                  <textarea
                    rows={4}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                  />
                </div>

                {/* Avatar Image Uploader */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="text-xs font-mono-tech text-slate-300 font-semibold">
                    Profile Avatar Photo (Direct URL or Upload)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-white/20 flex-shrink-0">
                      <img
                        src={profileForm.avatarUrl}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="url"
                        value={profileForm.avatarUrl}
                        onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                      <CloudinaryImageUploader
                        folder="akash_portfolio/avatars"
                        onUploadSuccess={(url) => setProfileForm({ ...profileForm, avatarUrl: url })}
                        buttonLabel="Upload Avatar to Cloudinary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(56,189,248,0.5)] cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Profile & Social Links to Firestore</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold font-display text-white">
                    Projects Showcase ({projects.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add, edit, or delete real builds in Firestore.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearAllProjects}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/30 text-rose-300 text-xs font-mono-tech flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                  <button
                    onClick={() =>
                      setEditingProject({
                        title: '',
                        tagline: '',
                        description: '',
                        category: 'AI / ML',
                        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
                        tags: ['React', 'Node.js', 'PostgreSQL', 'Gemini API'],
                        metrics: [{ label: 'Field Types', value: '18+' }, { label: 'Speed', value: '< 3s' }],
                        featured: true,
                        githubUrl: 'https://github.com/kakashsunny',
                        liveUrl: 'https://akashsunnyportfoilo.netlify.app',
                        highlights: ['AI-native dynamic form generation', 'Built with PostgreSQL and Gemini API'],
                        architecture: 'React frontend, Express.js backend, Neon PostgreSQL',
                      })
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Real Project</span>
                  </button>
                </div>
              </div>

              {/* Project Add/Edit Form Modal/Drawer */}
              {editingProject && (
                <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/30 border border-cyan-400/40 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-400/20">
                    <h4 className="text-sm font-bold text-cyan-200 font-mono-tech flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                      <span>{editingProject.id ? 'Edit Project' : 'Create New Project'}</span>
                    </h4>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono-tech text-slate-300">Project Title *</label>
                        <input
                          type="text"
                          value={editingProject.title || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                          required
                          placeholder="e.g., Formly AI - AI-Native Form Builder"
                          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono-tech text-slate-300">Category *</label>
                        <select
                          value={editingProject.category || 'AI / ML'}
                          onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
                        >
                          <option value="AI / ML">AI / ML</option>
                          <option value="Full Stack">Full Stack</option>
                          <option value="Cloud & Systems">Cloud & Systems</option>
                          <option value="Mobile & Web3">Mobile & Web3</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono-tech text-slate-300">Tagline / Subtitle</label>
                        <input
                          type="text"
                          value={editingProject.tagline || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                          placeholder="Describe a form in plain English..."
                          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono-tech text-slate-300">GitHub Repository URL</label>
                        <input
                          type="url"
                          value={editingProject.githubUrl || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                          placeholder="https://github.com/kakashsunny/..."
                          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono-tech text-slate-300">Live Demo URL</label>
                        <input
                          type="url"
                          value={editingProject.liveUrl || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[11px] font-mono-tech text-slate-300">Project Banner Image</label>
                        <CloudinaryImageUploader
                          currentImageUrl={editingProject.image}
                          onImageUploaded={(url) => setEditingProject({ ...editingProject, image: url })}
                          label="Upload Image, Pick Tech Preset, or Paste URL"
                          folder="akash_portfolio/projects"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono-tech text-slate-300">Description</label>
                      <textarea
                        rows={3}
                        value={editingProject.description || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-xs text-white focus:border-cyan-400 leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono-tech text-slate-300">Tech Stack Tags (comma separated)</label>
                      <input
                        type="text"
                        value={editingProject.tags?.join(', ') || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                          })
                        }
                        placeholder="React, TypeScript, Node.js, Express, PostgreSQL, Gemini API"
                        className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-cyan-400/20">
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>Save Project to Firestore</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Projects List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                          <span className="text-[10px] font-mono-tech text-cyan-300">{proj.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingProject(proj)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {proj.tags.slice(0, 4).map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATES MANAGEMENT */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold font-display text-white">
                    Verified Certifications ({certificates.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage real credentials, Google Cloud badges, and course accreditations.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearAllCertificates}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/30 text-rose-300 text-xs font-mono-tech flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                  <button
                    onClick={() =>
                      setEditingCert({
                        title: '',
                        issuer: 'Google Cloud Skills Boost',
                        issueDate: '2025',
                        credentialId: 'GCP-AI-2025',
                        credentialUrl: 'https://www.cloudskillsboost.google',
                        badgeColor: 'from-blue-500 to-cyan-400',
                        skills: ['Vertex AI', 'Prompt Engineering', 'Generative AI'],
                        description: 'Official Google Cloud skill badge completion.',
                        iconName: 'Cloud',
                      })
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Real Certificate</span>
                  </button>
                </div>
              </div>

              {/* Add/Edit Certificate Form */}
              {editingCert && (
                <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/30 border border-cyan-400/40 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-400/20">
                    <h4 className="text-sm font-bold text-cyan-200 font-mono-tech flex items-center gap-2">
                      <Award className="w-4 h-4 text-cyan-300" />
                      <span>{editingCert.id ? 'Edit Certificate' : 'Add New Certificate'}</span>
                    </h4>
                    <button
                      onClick={() => setEditingCert(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCertificate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono-tech text-slate-300">Certificate Title *</label>
                        <input
                          type="text"
                          value={editingCert.title || ''}
                          onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                          required
                          placeholder="e.g., Google Cloud Skills Boost - AI Track"
                          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono-tech text-slate-300">Issuer *</label>
                        <input
                          type="text"
                          value={editingCert.issuer || ''}
                          onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                          required
                          placeholder="Google Cloud / IANT"
                          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono-tech text-slate-300">Issue Date / Status</label>
                        <input
                          type="text"
                          value={editingCert.issueDate || ''}
                          onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                          placeholder="2025 / Sep 2024 / In Progress"
                          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono-tech text-slate-300">Credential ID</label>
                        <input
                          type="text"
                          value={editingCert.credentialId || ''}
                          onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                          placeholder="GCP-AI-4BADGES"
                          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono-tech text-slate-300">Verification / Badge URL</label>
                        <input
                          type="url"
                          value={editingCert.credentialUrl || ''}
                          onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                          placeholder="https://www.cloudskillsboost.google"
                          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono-tech text-slate-300">Skills Verified (comma separated)</label>
                        <input
                          type="text"
                          value={editingCert.skills?.join(', ') || ''}
                          onChange={(e) =>
                            setEditingCert({
                              ...editingCert,
                              skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                            })
                          }
                          placeholder="Vertex AI, LLMs, Generative AI"
                          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono-tech text-slate-300">Description</label>
                      <textarea
                        rows={2}
                        value={editingCert.description || ''}
                        onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                        className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-xs text-white focus:border-cyan-400 leading-relaxed"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-cyan-400/20">
                      <button
                        type="button"
                        onClick={() => setEditingCert(null)}
                        className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>Save Certificate</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Certificates List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                        <span className="text-[11px] font-mono-tech text-cyan-300">
                          {cert.issuer} • {cert.issueDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingCert(cert)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCertificate(cert.id)}
                          className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">{cert.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {cert.skills.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS MANAGEMENT */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold font-display text-white">Skills Matrix Categories</h3>
                  <p className="text-xs text-slate-400">Manage technical competency buckets and proficiency ratings.</p>
                </div>
                <button
                  onClick={() =>
                    setEditingSkillCat({
                      name: 'New Competency Category',
                      icon: 'BrainCircuit',
                      description: 'Specialized skills and engineering tools',
                      skills: [
                        { name: 'Skill 1', level: 90, experience: '2+ yrs', popular: true },
                        { name: 'Skill 2', level: 85, experience: 'Advanced', popular: false },
                      ],
                    })
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill Category</span>
                </button>
              </div>

              {/* Skill Category & Skills Edit Form */}
              {editingSkillCat && (
                <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/30 border border-cyan-400/40 space-y-5 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-400/20">
                    <h4 className="text-sm font-bold text-cyan-200 font-mono-tech flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-cyan-300" />
                      <span>{editingSkillCat.id ? `Edit Category: ${editingSkillCat.name}` : 'Create New Skill Category'}</span>
                    </h4>
                    <button
                      onClick={() => setEditingSkillCat(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveSkillCategory} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[11px] font-mono-tech text-slate-300">Category Name *</label>
                        <input
                          type="text"
                          value={editingSkillCat.name || ''}
                          onChange={(e) => setEditingSkillCat({ ...editingSkillCat, name: e.target.value })}
                          required
                          placeholder="e.g. Machine Learning & AI, Full Stack Architecture"
                          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono-tech text-slate-300">Category Icon</label>
                        <select
                          value={editingSkillCat.icon || 'Code2'}
                          onChange={(e) => setEditingSkillCat({ ...editingSkillCat, icon: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
                        >
                          <option value="BrainCircuit">BrainCircuit (AI/ML)</option>
                          <option value="Code2">Code2 (Programming)</option>
                          <option value="Layers">Layers (Full Stack / Architecture)</option>
                          <option value="CloudLightning">CloudLightning (Cloud / DevOps)</option>
                          <option value="Database">Database (Data / SQL / Firestore)</option>
                          <option value="Terminal">Terminal (CLI / Systems)</option>
                          <option value="Cpu">Cpu (Hardware / Low-Level / Performance)</option>
                          <option value="Globe">Globe (Web / APIs)</option>
                          <option value="Sparkles">Sparkles (Creative / Innovation)</option>
                        </select>
                      </div>

                      <div className="space-y-1 md:col-span-3">
                        <label className="text-[11px] font-mono-tech text-slate-300">Description</label>
                        <input
                          type="text"
                          value={editingSkillCat.description || ''}
                          onChange={(e) => setEditingSkillCat({ ...editingSkillCat, description: e.target.value })}
                          placeholder="e.g. Deep learning models, Transformer pipelines, and optimization"
                          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    {/* Individual Skills Editor Section */}
                    <div className="space-y-3 pt-3 border-t border-cyan-400/20">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold font-mono-tech text-cyan-300 flex items-center gap-1.5">
                          <span>Skills in this Category ({editingSkillCat.skills?.length || 0})</span>
                        </h5>
                        <button
                          type="button"
                          onClick={() => {
                            const curSkills = editingSkillCat.skills ? [...editingSkillCat.skills] : [];
                            curSkills.push({
                              name: '',
                              level: 85,
                              experience: '2+ yrs',
                              popular: false,
                            });
                            setEditingSkillCat({ ...editingSkillCat, skills: curSkills });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-[11px] font-mono-tech flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Skill</span>
                        </button>
                      </div>

                      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                        {editingSkillCat.skills?.map((skill, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3 rounded-xl bg-black/40 border border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                          >
                            <div className="sm:col-span-4">
                              <label className="text-[10px] font-mono-tech text-slate-400 block mb-0.5">Skill Name</label>
                              <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => {
                                  const updated = [...(editingSkillCat.skills || [])];
                                  updated[sIdx] = { ...updated[sIdx], name: e.target.value };
                                  setEditingSkillCat({ ...editingSkillCat, skills: updated });
                                }}
                                placeholder="e.g. PyTorch, TypeScript"
                                required
                                className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400"
                              />
                            </div>

                            <div className="sm:col-span-4">
                              <div className="flex justify-between text-[10px] font-mono-tech text-slate-400 mb-0.5">
                                <span>Proficiency</span>
                                <span className="text-cyan-300 font-bold">{skill.level}%</span>
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="100"
                                step="5"
                                value={skill.level}
                                onChange={(e) => {
                                  const updated = [...(editingSkillCat.skills || [])];
                                  updated[sIdx] = { ...updated[sIdx], level: Number(e.target.value) };
                                  setEditingSkillCat({ ...editingSkillCat, skills: updated });
                                }}
                                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="text-[10px] font-mono-tech text-slate-400 block mb-0.5">Experience / Tag</label>
                              <input
                                type="text"
                                value={skill.experience || ''}
                                onChange={(e) => {
                                  const updated = [...(editingSkillCat.skills || [])];
                                  updated[sIdx] = { ...updated[sIdx], experience: e.target.value };
                                  setEditingSkillCat({ ...editingSkillCat, skills: updated });
                                }}
                                placeholder="e.g. 2+ yrs, Certified"
                                className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white focus:border-cyan-400"
                              />
                            </div>

                            <div className="sm:col-span-1 flex items-center justify-center pt-2 sm:pt-0">
                              <label className="flex items-center gap-1 cursor-pointer" title="Highlight as Core Skill">
                                <input
                                  type="checkbox"
                                  checked={skill.popular || false}
                                  onChange={(e) => {
                                    const updated = [...(editingSkillCat.skills || [])];
                                    updated[sIdx] = { ...updated[sIdx], popular: e.target.checked };
                                    setEditingSkillCat({ ...editingSkillCat, skills: updated });
                                  }}
                                  className="accent-cyan-400 rounded"
                                />
                                <Flame className={`w-3.5 h-3.5 ${skill.popular ? 'text-amber-400' : 'text-slate-500'}`} />
                              </label>
                            </div>

                            <div className="sm:col-span-1 flex justify-end pt-2 sm:pt-0">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = editingSkillCat.skills?.filter((_, idx) => idx !== sIdx) || [];
                                  setEditingSkillCat({ ...editingSkillCat, skills: updated });
                                }}
                                className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300"
                                title="Remove Skill"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {(!editingSkillCat.skills || editingSkillCat.skills.length === 0) && (
                          <div className="p-4 text-center rounded-xl bg-black/30 border border-dashed border-white/10 text-xs text-slate-400">
                            No skills in this category yet. Click &quot;Add Skill&quot; above to add one!
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-cyan-400/20">
                      <button
                        type="button"
                        onClick={() => setEditingSkillCat(null)}
                        className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>Save Category & Skills to Firestore</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Skills Category List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((cat, idx) => (
                  <div
                    key={cat.id || idx}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-tech bg-cyan-500/15 text-cyan-300 border border-cyan-400/20">
                            {cat.skills?.length || 0} skills
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingSkillCat(cat)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300"
                          title="Edit Category & Skills"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkillCategory(cat.id || `skill-cat-${idx}`)}
                          className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 pt-1">
                      {cat.skills?.map((s) => (
                        <div key={s.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 flex items-center gap-1.5">
                              {s.name}
                              {s.popular && <Flame className="w-3 h-3 text-amber-400" />}
                            </span>
                            <div className="flex items-center gap-2">
                              {s.experience && (
                                <span className="text-[10px] text-slate-400 font-mono-tech">{s.experience}</span>
                              )}
                              <span className="font-mono-tech text-cyan-300 font-bold">{s.level}%</span>
                            </div>
                          </div>
                          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full"
                              style={{ width: `${s.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EDUCATION MANAGEMENT */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold font-display text-white">Education & Academics</h3>
                  <p className="text-xs text-slate-400">CMR University B.Tech CSE details & honors.</p>
                </div>
                <button
                  onClick={() =>
                    setEditingEdu({
                      degree: 'Bachelor of Technology (B.Tech)',
                      field: 'Computer Science and Engineering',
                      institution: 'CMR University',
                      location: 'Bengaluru, Karnataka',
                      period: '2024 – 2028',
                      grade: '8.52 CGPA',
                      status: '5th Semester',
                      highlights: [
                        '1st Place Winner in Cognitive Combat - Techno Whiz \'25 (IEEE Bangalore Section)',
                        'Winner - Footstep Energy Generator embedded system at IEEE Expo',
                      ],
                      coursework: ['Data Structures & Algorithms', 'DBMS (PostgreSQL, MongoDB)', 'AI/ML'],
                    })
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Education Item</span>
                </button>
              </div>

              {editingEdu && (
                <form onSubmit={handleSaveEducation} className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-400/30 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editingEdu.degree || ''}
                      onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                      placeholder="Degree (e.g. B.Tech)"
                      className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={editingEdu.institution || ''}
                      onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                      placeholder="CMR University"
                      className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={editingEdu.grade || ''}
                      onChange={(e) => setEditingEdu({ ...editingEdu, grade: e.target.value })}
                      placeholder="8.52 CGPA"
                      className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={editingEdu.period || ''}
                      onChange={(e) => setEditingEdu({ ...editingEdu, period: e.target.value })}
                      placeholder="2024 – 2028"
                      className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setEditingEdu(null)} className="px-3 py-1 text-xs text-slate-400">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-1.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs">
                      Save Education
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{edu.degree} - {edu.field}</h4>
                      <p className="text-xs text-cyan-300 font-mono-tech">{edu.institution} ({edu.grade}) • {edu.period}</p>
                      <p className="text-xs text-slate-400 mt-1">{edu.highlights.join(' • ')}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditingEdu(edu)} className="p-1.5 rounded-lg bg-white/10 text-cyan-300">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteEducation(edu.id)} className="p-1.5 rounded-lg bg-rose-500/15 text-rose-300">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ACHIEVEMENTS MANAGEMENT */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold font-display text-white">Honors & Hackathons</h3>
                  <p className="text-xs text-slate-400">IEEE awards & competition wins.</p>
                </div>
                <button
                  onClick={() =>
                    setEditingAch({
                      title: '1st Place, "Cognitive Combat" - Techno Whiz \'25',
                      category: 'Hackathon',
                      date: 'Jul 2025',
                      organization: 'IEEE Bangalore Section, CMR University',
                      metric: '1st Place',
                      metricLabel: 'Champion',
                      description: 'Won 1st place in the cognitive combat competition at CMR University.',
                      badge: '🏆 1st Place',
                    })
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Achievement</span>
                </button>
              </div>

              {editingAch && (
                <form onSubmit={handleSaveAchievement} className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-400/30 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editingAch.title || ''}
                      onChange={(e) => setEditingAch({ ...editingAch, title: e.target.value })}
                      placeholder="Title"
                      className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={editingAch.organization || ''}
                      onChange={(e) => setEditingAch({ ...editingAch, organization: e.target.value })}
                      placeholder="Organization"
                      className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={editingAch.metric || ''}
                      onChange={(e) => setEditingAch({ ...editingAch, metric: e.target.value })}
                      placeholder="Metric (e.g. 1st Place)"
                      className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={editingAch.badge || ''}
                      onChange={(e) => setEditingAch({ ...editingAch, badge: e.target.value })}
                      placeholder="Badge emoji"
                      className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setEditingAch(null)} className="px-3 py-1 text-xs text-slate-400">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-1.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs">
                      Save Achievement
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {achievements.map((ach) => (
                  <div key={ach.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                      <p className="text-xs text-cyan-300 font-mono-tech">{ach.organization} • {ach.date}</p>
                      <p className="text-xs text-slate-400 mt-1">{ach.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditingAch(ach)} className="p-1.5 rounded-lg bg-white/10 text-cyan-300">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteAchievement(ach.id)} className="p-1.5 rounded-lg bg-rose-500/15 text-rose-300">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CLOUDINARY & API SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Cloudinary Direct Upload Configuration</h3>
                </div>
                <p className="text-xs text-slate-300">
                  Configure your Cloudinary Cloud Name and unsigned Upload Preset to upload real images directly.
                </p>

                <form onSubmit={handleSaveCloudinary} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono-tech text-slate-400">Cloud Name</label>
                      <input
                        type="text"
                        value={cloudConfig.cloudName}
                        onChange={(e) => setCloudConfig({ ...cloudConfig, cloudName: e.target.value })}
                        placeholder="e.g., your_cloud_name"
                        className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono-tech text-slate-400">Upload Preset (Unsigned)</label>
                      <input
                        type="text"
                        value={cloudConfig.uploadPreset}
                        onChange={(e) => setCloudConfig({ ...cloudConfig, uploadPreset: e.target.value })}
                        placeholder="e.g., portfolio_unsigned"
                        className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <button type="submit" className="px-4 py-1.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs">
                    Save Cloudinary Settings
                  </button>
                </form>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">Custom Gemini API Key Override</h3>
                </div>
                <p className="text-xs text-slate-300">
                  Provide your personal Gemini API Key if you want to bypass platform rate limits for Ask AI and Resume Generator.
                </p>

                <form onSubmit={handleSaveGeminiKey} className="space-y-3">
                  <div>
                    <input
                      type="password"
                      value={geminiKeyInput}
                      onChange={(e) => setGeminiKeyInput(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-1.5 rounded-xl bg-purple-500 text-white font-bold text-xs">
                      Save Key
                    </button>
                    {geminiKeyInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setGeminiKeyInput('');
                          localStorage.removeItem('akash_custom_gemini_key');
                          showNotification('Custom key cleared');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/10 text-xs text-slate-300"
                      >
                        Clear Custom Key
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
