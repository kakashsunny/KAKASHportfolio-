import React from 'react';
import {
  Home,
  User,
  Code2,
  Briefcase,
  Award,
  GraduationCap,
  Trophy,
  Mail,
} from 'lucide-react';

interface SidebarNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const SIDEBAR_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'certifications', label: 'Certificates', icon: Award },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeSection,
  onNavigate,
}) => {
  return (
    <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:block">
      <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl glass-nav shadow-[0_16px_40px_rgba(0,0,0,0.6)] border border-white/15">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              id={`sidebar-link-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-b from-sky-500/80 to-blue-600/90 text-white shadow-[0_0_20px_rgba(56,189,248,0.6)] border border-cyan-300/50'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/10'
              }`}
              title={item.label}
            >
              <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110 text-white' : 'group-hover:scale-110'}`} />
              <span className="text-[9px] font-medium tracking-tighter mt-0.5 opacity-90">
                {item.label}
              </span>

              {/* Tooltip on Hover */}
              <div className="absolute left-full ml-3.5 px-2.5 py-1 rounded-md glass-panel text-[11px] font-medium text-slate-100 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform -translate-x-1 group-hover:translate-x-0 shadow-lg border border-white/20">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
