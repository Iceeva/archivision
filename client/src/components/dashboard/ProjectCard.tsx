import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MoreVertical, Copy, Trash2, FolderOpen, MapPin, Layers } from 'lucide-react';
import type { Project } from '@/types';
import { cn, formatRelative, HOUSE_TYPE_LABELS, STATUS_LABELS } from '@/lib/utils';
import { useState } from 'react';

interface Props {
  project: Project;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onFavorite: (id: string) => void;
}

export default function ProjectCard({ project, onDelete, onDuplicate, onFavorite }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = STATUS_LABELS[project.status] || STATUS_LABELS.DRAFT;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glow group relative"
    >
      <Link to={`/project/${project.id}`} className="block">
        {/* Preview Area */}
        <div className="h-36 bg-dark-700 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
          <div className="text-center">
            <FolderOpen size={32} className="text-dark-400 mx-auto mb-2" />
            <p className="text-xs text-dark-300">{HOUSE_TYPE_LABELS[project.house?.houseType || 'MODERN'] || 'Projet'}</p>
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-sm truncate flex-1">{project.name}</h3>
            <span className={cn('ml-2 flex-shrink-0', status.color)}>{status.label}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-dark-300">
            {project.terrain?.length && project.terrain?.width && (
              <span className="flex items-center gap-1">
                <MapPin size={10} /> {project.terrain.length}×{project.terrain.width}m
              </span>
            )}
            {project.house?.floors && (
              <span className="flex items-center gap-1">
                <Layers size={10} /> {project.house.floors} étage{project.house.floors > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-[10px] text-dark-400 mt-2">{formatRelative(project.updatedAt)}</p>
        </div>
      </Link>

      {/* Actions */}
      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onFavorite(project.id)}
          className={cn('p-1.5 rounded-lg', project.isFavorite ? 'text-yellow-400' : 'text-dark-300 hover:text-white', 'hover:bg-dark-500')}>
          <Star size={14} fill={project.isFavorite ? 'currentColor' : 'none'} />
        </button>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 rounded-lg text-dark-300 hover:text-white hover:bg-dark-500">
            <MoreVertical size={14} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-dark-700 border border-dark-500 rounded-xl py-1 w-40 shadow-xl z-20">
              <button onClick={() => { onDuplicate(project.id); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-dark-600">
                <Copy size={12} /> Dupliquer
              </button>
              <button onClick={() => { onDelete(project.id); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-500/10">
                <Trash2 size={12} /> Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
