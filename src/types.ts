export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'AI / ML' | 'Full Stack' | 'Cloud & Systems' | 'Mobile & Web3';
  image: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  featured: boolean;
  githubUrl: string;
  liveUrl: string;
  highlights: string[];
  architecture?: string;
}

export interface SkillCategory {
  id?: string;
  name: string;
  icon: string;
  description: string;
  skills: {
    name: string;
    level: number; // 0-100
    experience: string;
    icon?: string;
    popular?: boolean;
  }[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  credentialUrl: string;
  badgeColor: string;
  skills: string[];
  description: string;
  iconName: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  grade: string;
  status: string;
  highlights: string[];
  coursework: string[];
}

export interface Achievement {
  id: string;
  title: string;
  category: 'Hackathon' | 'Research' | 'Open Source' | 'Academics';
  date: string;
  organization: string;
  metric: string;
  metricLabel: string;
  description: string;
  badge: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  handle: string;
  color: string;
}
