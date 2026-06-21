import { FolderOpen, Star, Clock, Sparkles } from 'lucide-react';
import type { Project } from '@/types';

interface Props { projects: Project[]; }

export default function StatsCards({ projects }: Props) {
  const stats = [
    { icon: FolderOpen, label: 'Total Projets', value: projects.length, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { icon: Star, label: 'Favoris', value: projects.filter(p => p.isFavorite).length, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { icon: Sparkles, label: 'Plans Générés', value: projects.filter(p => p.status === 'READY' || p.status === 'MODIFIED').length, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: Clock, label: 'En cours', value: projects.filter(p => p.status === 'GENERATING' || p.status === 'DRAFT').length, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(s => (
        <div key={s.label} className="card-glow">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon size={18} className={s.color} />
            </div>
          </div>
          <p className="text-2xl font-bold">{s.value}</p>
          <p className="text-xs text-dark-200 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
