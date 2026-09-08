import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  PERSONAL_INFO,
  PROJECTS,
  SKILL_CATEGORIES,
  CERTIFICATIONS,
  EDUCATION,
  ACHIEVEMENTS,
  SOCIAL_LINKS,
} from '../data/portfolioData';
import type {
  Project,
  SkillCategory,
  Certification,
  EducationItem,
  Achievement,
  SocialLink,
} from '../types';

export interface ProfileData {
  name: string;
  tagline: string;
  roles: string[];
  bio: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  portfolioUrl: string;
  college: string;
  degree: string;
  semester: string;
  cgpa: string;
  status: string;
  avatarUrl: string;
  resumeUrl: string;
  yearsOfExp: string;
  availableForHire: boolean;
  updatedAt?: unknown;
}

// 1. PROFILE CRUD
export const getProfile = async (): Promise<ProfileData> => {
  try {
    const docRef = doc(db, 'profile', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as ProfileData;
      return {
        name: data.name || PERSONAL_INFO.name,
        tagline: data.tagline || PERSONAL_INFO.tagline,
        roles: data.roles?.length ? data.roles : PERSONAL_INFO.roles,
        bio: data.bio || PERSONAL_INFO.bio,
        location: data.location || PERSONAL_INFO.location,
        email: data.email || PERSONAL_INFO.email,
        phone: data.phone || PERSONAL_INFO.phone,
        github: data.github || PERSONAL_INFO.github,
        linkedin: data.linkedin || PERSONAL_INFO.linkedin,
        portfolioUrl: data.portfolioUrl || PERSONAL_INFO.portfolioUrl,
        college: data.college || PERSONAL_INFO.college,
        degree: data.degree || PERSONAL_INFO.degree,
        semester: data.semester || PERSONAL_INFO.semester,
        cgpa: data.cgpa || PERSONAL_INFO.cgpa,
        status: data.status || PERSONAL_INFO.status,
        avatarUrl: data.avatarUrl || PERSONAL_INFO.avatarUrl,
        resumeUrl: data.resumeUrl || '',
        yearsOfExp: data.yearsOfExp || '2+',
        availableForHire: data.availableForHire ?? true,
      };
    }
  } catch (err) {
    console.warn('Using default profile data:', err);
  }
  return {
    name: PERSONAL_INFO.name,
    tagline: PERSONAL_INFO.tagline,
    roles: PERSONAL_INFO.roles,
    bio: PERSONAL_INFO.bio,
    location: PERSONAL_INFO.location,
    email: PERSONAL_INFO.email,
    phone: PERSONAL_INFO.phone,
    github: PERSONAL_INFO.github,
    linkedin: PERSONAL_INFO.linkedin,
    portfolioUrl: PERSONAL_INFO.portfolioUrl,
    college: PERSONAL_INFO.college,
    degree: PERSONAL_INFO.degree,
    semester: PERSONAL_INFO.semester,
    cgpa: PERSONAL_INFO.cgpa,
    status: PERSONAL_INFO.status,
    avatarUrl: PERSONAL_INFO.avatarUrl,
    resumeUrl: '',
    yearsOfExp: '2+',
    availableForHire: true,
  };
};

export const updateProfile = async (data: Partial<ProfileData>): Promise<void> => {
  const docRef = doc(db, 'profile', 'main');
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

// 2. PROJECTS CRUD
export const getProjects = async (): Promise<Project[]> => {
  try {
    const colRef = collection(db, 'projects');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
    }
    const metaRef = doc(db, 'settings', 'portfolioMeta');
    const metaSnap = await getDoc(metaRef);
    if (metaSnap.exists() && metaSnap.data()?.projectsInitialized) {
      return [];
    }
  } catch (err) {
    console.warn('Using default projects:', err);
  }
  return PROJECTS;
};

export const saveProject = async (project: Partial<Project> & { id?: string }): Promise<string> => {
  const metaRef = doc(db, 'settings', 'portfolioMeta');
  await setDoc(metaRef, { projectsInitialized: true, updatedAt: serverTimestamp() }, { merge: true });
  
  if (project.id) {
    const docRef = doc(db, 'projects', project.id);
    await setDoc(docRef, { ...project, updatedAt: serverTimestamp() }, { merge: true });
    return project.id;
  } else {
    const colRef = collection(db, 'projects');
    const res = await addDoc(colRef, {
      ...project,
      createdAt: serverTimestamp(),
    });
    return res.id;
  }
};

export const addProject = async (project: Omit<Project, 'id'>): Promise<string> => {
  return saveProject(project);
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<void> => {
  await saveProject({ ...project, id });
};

export const deleteProject = async (id: string): Promise<void> => {
  const docRef = doc(db, 'projects', id);
  await deleteDoc(docRef);
  const metaRef = doc(db, 'settings', 'portfolioMeta');
  await setDoc(metaRef, { projectsInitialized: true, updatedAt: serverTimestamp() }, { merge: true });
};

export const clearAllProjects = async (): Promise<void> => {
  const colRef = collection(db, 'projects');
  const snap = await getDocs(colRef);
  for (const d of snap.docs) {
    await deleteDoc(doc(db, 'projects', d.id));
  }
  const metaRef = doc(db, 'settings', 'portfolioMeta');
  await setDoc(metaRef, { projectsInitialized: true, updatedAt: serverTimestamp() }, { merge: true });
};

// 3. SKILLS CRUD
export const getSkills = async (): Promise<SkillCategory[]> => {
  try {
    const colRef = collection(db, 'skills');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as SkillCategory));
    }
    const metaRef = doc(db, 'settings', 'portfolioMeta');
    const metaSnap = await getDoc(metaRef);
    if (metaSnap.exists() && metaSnap.data()?.skillsInitialized) {
      return [];
    }
  } catch (err) {
    console.warn('Using default skills:', err);
  }
  return SKILL_CATEGORIES;
};

export const saveSkillCategory = async (category: SkillCategory & { id?: string }): Promise<string> => {
  const metaRef = doc(db, 'settings', 'portfolioMeta');
  await setDoc(metaRef, { skillsInitialized: true, updatedAt: serverTimestamp() }, { merge: true });

  const catId = category.id || `skill-cat-${Date.now()}`;
  const docRef = doc(db, 'skills', catId);
  await setDoc(docRef, { ...category, id: catId, updatedAt: serverTimestamp() }, { merge: true });
  return catId;
};

export const deleteSkillCategory = async (id: string): Promise<void> => {
  const docRef = doc(db, 'skills', id);
  await deleteDoc(docRef);
  const metaRef = doc(db, 'settings', 'portfolioMeta');
  await setDoc(metaRef, { skillsInitialized: true, updatedAt: serverTimestamp() }, { merge: true });
};

// 4. CERTIFICATES CRUD
export const getCertificates = async (): Promise<Certification[]> => {
  try {
    const colRef = collection(db, 'certificates');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Certification));
    }
  } catch (err) {
    console.warn('Using default certificates:', err);
  }
  return CERTIFICATIONS;
};

export const addCertificate = async (cert: Omit<Certification, 'id'>): Promise<string> => {
  const colRef = collection(db, 'certificates');
  const res = await addDoc(colRef, {
    ...cert,
    createdAt: serverTimestamp(),
  });
  return res.id;
};

export const updateCertificate = async (id: string, cert: Partial<Certification>): Promise<void> => {
  const docRef = doc(db, 'certificates', id);
  await setDoc(docRef, { ...cert, updatedAt: serverTimestamp() }, { merge: true });
};

export const deleteCertificate = async (id: string): Promise<void> => {
  const docRef = doc(db, 'certificates', id);
  await deleteDoc(docRef);
};

export const clearAllCertificates = async (): Promise<void> => {
  const colRef = collection(db, 'certificates');
  const snap = await getDocs(colRef);
  for (const d of snap.docs) {
    await deleteDoc(doc(db, 'certificates', d.id));
  }
};

// 5. ACHIEVEMENTS CRUD
export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const colRef = collection(db, 'achievements');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Achievement));
    }
  } catch (err) {
    console.warn('Using default achievements:', err);
  }
  return ACHIEVEMENTS;
};

export const addAchievement = async (ach: Omit<Achievement, 'id'>): Promise<string> => {
  const colRef = collection(db, 'achievements');
  const res = await addDoc(colRef, {
    ...ach,
    createdAt: serverTimestamp(),
  });
  return res.id;
};

export const updateAchievement = async (id: string, ach: Partial<Achievement>): Promise<void> => {
  const docRef = doc(db, 'achievements', id);
  await updateDoc(docRef, { ...ach, updatedAt: serverTimestamp() });
};

export const deleteAchievement = async (id: string): Promise<void> => {
  const docRef = doc(db, 'achievements', id);
  await deleteDoc(docRef);
};

// 6. EDUCATION CRUD
export const getEducation = async (): Promise<EducationItem[]> => {
  try {
    const colRef = collection(db, 'education');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EducationItem));
    }
  } catch (err) {
    console.warn('Using default education:', err);
  }
  return EDUCATION;
};

export const addEducation = async (edu: Omit<EducationItem, 'id'>): Promise<string> => {
  const colRef = collection(db, 'education');
  const res = await addDoc(colRef, {
    ...edu,
    createdAt: serverTimestamp(),
  });
  return res.id;
};

export const updateEducation = async (id: string, edu: Partial<EducationItem>): Promise<void> => {
  const docRef = doc(db, 'education', id);
  await updateDoc(docRef, { ...edu, updatedAt: serverTimestamp() });
};

export const deleteEducation = async (id: string): Promise<void> => {
  const docRef = doc(db, 'education', id);
  await deleteDoc(docRef);
};

// 7. SOCIAL LINKS CRUD
export const getSocialLinks = async (): Promise<SocialLink[]> => {
  try {
    const docRef = doc(db, 'socialLinks', 'list');
    const snap = await getDoc(docRef);
    if (snap.exists() && snap.data()?.links && Array.isArray(snap.data().links)) {
      return snap.data().links as SocialLink[];
    }
  } catch (err) {
    console.warn('Using default social links:', err);
  }
  return SOCIAL_LINKS;
};

export const saveSocialLinks = async (links: SocialLink[]): Promise<void> => {
  const docRef = doc(db, 'socialLinks', 'list');
  await setDoc(docRef, { links, updatedAt: serverTimestamp() }, { merge: true });
};

// 8. RESET / SEED FIRESTORE WITH K AKASH'S REAL DATA
export const resetToAkashResumeDefaults = async (): Promise<void> => {
  try {
    // 1. Profile
    await setDoc(
      doc(db, 'profile', 'main'),
      {
        name: PERSONAL_INFO.name,
        tagline: PERSONAL_INFO.tagline,
        roles: PERSONAL_INFO.roles,
        bio: PERSONAL_INFO.bio,
        location: PERSONAL_INFO.location,
        college: PERSONAL_INFO.college,
        degree: PERSONAL_INFO.degree,
        semester: PERSONAL_INFO.semester,
        cgpa: PERSONAL_INFO.cgpa,
        phone: PERSONAL_INFO.phone,
        email: PERSONAL_INFO.email,
        github: PERSONAL_INFO.github,
        linkedin: PERSONAL_INFO.linkedin,
        portfolioUrl: PERSONAL_INFO.portfolioUrl,
        status: PERSONAL_INFO.status,
        avatarUrl: PERSONAL_INFO.avatarUrl,
        resumeUrl: '',
        yearsOfExp: '2+',
        availableForHire: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // 2. Clean and reset Projects
    const pSnap = await getDocs(collection(db, 'projects'));
    for (const d of pSnap.docs) {
      await deleteDoc(doc(db, 'projects', d.id));
    }
    for (const p of PROJECTS) {
      await setDoc(doc(db, 'projects', p.id), { ...p, createdAt: serverTimestamp() });
    }

    // 3. Clean and reset Certificates
    const cSnap = await getDocs(collection(db, 'certificates'));
    for (const d of cSnap.docs) {
      await deleteDoc(doc(db, 'certificates', d.id));
    }
    for (const c of CERTIFICATIONS) {
      await setDoc(doc(db, 'certificates', c.id), { ...c, createdAt: serverTimestamp() });
    }

    // 4. Clean and reset Skills
    const sSnap = await getDocs(collection(db, 'skills'));
    for (const d of sSnap.docs) {
      await deleteDoc(doc(db, 'skills', d.id));
    }
    for (const [idx, s] of SKILL_CATEGORIES.entries()) {
      await setDoc(doc(db, 'skills', `skill-cat-${idx}`), { ...s, createdAt: serverTimestamp() });
    }

    // 5. Clean and reset Achievements
    const aSnap = await getDocs(collection(db, 'achievements'));
    for (const d of aSnap.docs) {
      await deleteDoc(doc(db, 'achievements', d.id));
    }
    for (const a of ACHIEVEMENTS) {
      await setDoc(doc(db, 'achievements', a.id), { ...a, createdAt: serverTimestamp() });
    }

    // 6. Clean and reset Education
    const eSnap = await getDocs(collection(db, 'education'));
    for (const d of eSnap.docs) {
      await deleteDoc(doc(db, 'education', d.id));
    }
    for (const e of EDUCATION) {
      await setDoc(doc(db, 'education', e.id), { ...e, createdAt: serverTimestamp() });
    }

    // 7. Reset Social Links
    await setDoc(
      doc(db, 'socialLinks', 'list'),
      {
        links: SOCIAL_LINKS,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Error resetting Firestore data:', err);
    throw err;
  }
};

export const seedInitialFirestoreData = resetToAkashResumeDefaults;

// 9. ANALYTICS
export const recordPageView = async (): Promise<void> => {
  try {
    const docRef = doc(db, 'analytics', 'views');
    await setDoc(
      docRef,
      {
        totalViews: increment(1),
        lastVisited: serverTimestamp(),
      },
      { merge: true }
    );
  } catch {
    // Ignore analytics write error
  }
};

export const getAnalyticsMetrics = async () => {
  try {
    const docRef = doc(db, 'analytics', 'views');
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : { totalViews: 1240 };
  } catch {
    return { totalViews: 1240 };
  }
};
