import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { useProjects } from '@/hooks/useProject';
import StatsCards from './StatsCards';
import ProjectCard from './ProjectCard';
import ProjectWizard from '@/components/project/ProjectWizard';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { projects, isLoading, deleteProject, duplicateProject, toggleFavorite } = useProjects();
  const [showWizard, setShowWizard] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = projects
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => filter === 'all' || (filter === 'favorites' ? p.isFavorite : p.status === filter));

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return;
    await deleteProject(id);
    toast.success('Projet supprimé');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <StatsCards projects={projects} />

      <div className="flex items-center justify-between mt-8 mb-6">
        <h2 className="section-title mb-0">Mes Projets</h2>
        <button onClick={() => setShowWizard(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nouveau Projet
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-300" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-9 py-2 text-sm" placeholder="Rechercher..." />
        </div>
        <div className="flex gap-1 bg-dark-700 rounded-xl p-1">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'favorites', label: '⭐ Favoris' },
            { id: 'READY', label: 'Prêts' },
            { id: 'DRAFT', label: 'Brouillons' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${filter === f.id ? 'bg-dark-500 text-white' : 'text-dark-300 hover:text-white'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-dark-700 rounded-xl p-1">
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-dark-500' : ''}`}>
            <Grid3X3 size={14} />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-dark-500' : ''}`}>
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-36 bg-dark-600 rounded-xl mb-4" />
              <div className="h-4 bg-dark-600 rounded-lg w-2/3 mb-2" />
              <div className="h-3 bg-dark-600 rounded-lg w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto bg-dark-700 rounded-3xl flex items-center justify-center mb-4">
            <Plus size={32} className="text-dark-300" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Aucun projet</h3>
          <p className="text-dark-300 text-sm mb-6">Créez votre premier projet d'architecture</p>
          <button onClick={() => setShowWizard(true)} className="btn-primary">
            Créer un projet
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-3'}>
          {filtered.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDelete}
              onDuplicate={duplicateProject}
              onFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Wizard Modal */}
      {showWizard && <ProjectWizard onClose={() => setShowWizard(false)} />}
    </div>
  );
}
