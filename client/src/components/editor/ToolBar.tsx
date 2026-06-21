import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import { Layout, Box, Video, Wand2, Move, Hand, Ruler, Pencil, Grid3X3 } from 'lucide-react';

export default function ToolBar() {
  const { viewMode, setViewMode } = useUIStore();

  const viewModes = [
    { id: '2d' as const, icon: Layout, label: 'Plan 2D' },
    { id: '3d' as const, icon: Box, label: 'Vue 3D' },
    { id: 'tour' as const, icon: Video, label: 'Visite' },
  ];

  const tools = [
    { icon: Hand, label: 'Déplacer' },
    { icon: Move, label: 'Sélectionner' },
    { icon: Ruler, label: 'Mesurer' },
    { icon: Pencil, label: 'Annoter' },
    { icon: Grid3X3, label: 'Grille' },
  ];

  return (
    <div className="w-12 bg-dark-800 border-r border-dark-500/30 flex flex-col items-center py-3 gap-3">
      {/* View Mode */}
      <div className="space-y-1">
        {viewModes.map(m => (
          <button key={m.id} onClick={() => setViewMode(m.id)} title={m.label}
            className={cn(
              'p-2 rounded-xl transition-all',
              viewMode === m.id ? 'bg-brand-500/10 text-brand-400' : 'text-dark-300 hover:bg-dark-600 hover:text-white'
            )}>
            <m.icon size={16} />
          </button>
        ))}
      </div>

      <div className="w-6 h-px bg-dark-500" />

      {/* Tools */}
      <div className="space-y-1">
        {tools.map((t, i) => (
          <button key={i} title={t.label}
            className="p-2 rounded-xl text-dark-300 hover:bg-dark-600 hover:text-white transition-all">
            <t.icon size={16} />
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* AI Modify */}
      <button title="Modifier avec l'IA"
        className="p-2 rounded-xl bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-all">
        <Wand2 size={16} />
      </button>
    </div>
  );
}
