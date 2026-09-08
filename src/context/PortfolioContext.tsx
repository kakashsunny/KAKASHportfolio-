import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  User,
  signInWithPopup,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  auth,
} from '../lib/firebase';
import {
  getProfile,
  getProjects,
  getSkills,
  getCertificates,
  getAchievements,
  getEducation,
  getSocialLinks,
  seedInitialFirestoreData,
  recordPageView,
  ProfileData,
} from '../services/firestoreService';
import type {
  Project,
  SkillCategory,
  Certification,
  EducationItem,
  Achievement,
  SocialLink,
} from '../types';

export interface PortfolioStats {
  totalProjects: number;
  totalCertifications: number;
  totalSkills: number;
  totalAchievements: number;
  totalEducation: number;
}

interface PortfolioContextType {
  // Auth state
  user: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerWithEmail: (e: string, p: string) => Promise<void>;
  logout: () => Promise<void>;

  // Data state
  profile: ProfileData | null;
  projects: Project[];
  skills: SkillCategory[];
  certificates: Certification[];
  achievements: Achievement[];
  education: EducationItem[];
  socialLinks: SocialLink[];
  stats: PortfolioStats;
  isLoadingData: boolean;

  // Actions
  refreshData: () => Promise<void>;
  seedDatabase: () => Promise<void>;

  // Modals & Panels
  isAdminPanelOpen: boolean;
  setIsAdminPanelOpen: (open: boolean) => void;
  isRecruiterModeOpen: boolean;
  setIsRecruiterModeOpen: (open: boolean) => void;
  isAiResumeOpen: boolean;
  setIsAiResumeOpen: (open: boolean) => void;
  isAskAiOpen: boolean;
  setIsAskAiOpen: (open: boolean) => void;
  isSecretAnalyticsOpen: boolean;
  setIsSecretAnalyticsOpen: (open: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [certificates, setCertificates] = useState<Certification[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Modals
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [isRecruiterModeOpen, setIsRecruiterModeOpen] = useState<boolean>(false);
  const [isAiResumeOpen, setIsAiResumeOpen] = useState<boolean>(false);
  const [isAskAiOpen, setIsAskAiOpen] = useState<boolean>(false);
  const [isSecretAnalyticsOpen, setIsSecretAnalyticsOpen] = useState<boolean>(false);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
  };

  // 2. Fetch Data from Firestore
  const refreshData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const [profData, projData, skillData, certData, achData, eduData, linksData] =
        await Promise.all([
          getProfile(),
          getProjects(),
          getSkills(),
          getCertificates(),
          getAchievements(),
          getEducation(),
          getSocialLinks(),
        ]);

      setProfile(profData);
      setProjects(projData);
      setSkills(skillData);
      setCertificates(certData);
      setAchievements(achData);
      setEducation(eduData);
      setSocialLinks(linksData);
    } catch (err) {
      console.error('Error fetching portfolio data from Firestore:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
    recordPageView();
  }, [refreshData]);

  const seedDatabase = async () => {
    await seedInitialFirestoreData();
    await refreshData();
  };

  // 3. Dynamic Stats Calculation
  const totalSkillsCount = skills.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0);
  const stats: PortfolioStats = {
    totalProjects: projects.length,
    totalCertifications: certificates.length,
    totalSkills: totalSkillsCount,
    totalAchievements: achievements.length,
    totalEducation: education.length,
  };

  // 4. Secret Shortcut: 'A' + 'K' pressed to open Hidden Admin Analytics Panel
  useEffect(() => {
    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      pressedKeys.add(e.key.toLowerCase());

      if (pressedKeys.has('a') && pressedKeys.has('k')) {
        e.preventDefault();
        setIsSecretAnalyticsOpen(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        user,
        isAdmin: Boolean(user),
        isAuthLoading,
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
        stats,
        isLoadingData,
        refreshData,
        seedDatabase,
        isAdminPanelOpen,
        setIsAdminPanelOpen,
        isRecruiterModeOpen,
        setIsRecruiterModeOpen,
        isAiResumeOpen,
        setIsAiResumeOpen,
        isAskAiOpen,
        setIsAskAiOpen,
        isSecretAnalyticsOpen,
        setIsSecretAnalyticsOpen,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
