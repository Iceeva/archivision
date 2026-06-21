import { useState } from 'react';
import { Download, FileJson, FileImage, FileCode, Box, Loader2, Check } from 'lucide-react';
import { exportAPI } from '@/lib/api';
import { useProjectStore } from '@/store/projectStore';
import toast from 'react-hot-toast';

const FORMATS = [
  { id: 'json', label: 'JSON', desc: 'Données complètes du projet', icon: FileJson, ext: '.json', free: true },
  { id: 'svg', label: 'SVG', desc: 'Plan vectoriel 2D', icon: FileImage, ext: '.svg', free: true },
  { id: 'dxf', label: 'DXF', desc: 'Compatible AutoCAD', icon: FileCode, ext: '.dxf', free: false },
  { id: 'obj', label: 'OBJ', desc: 'Modèle 3D', icon: Box, ext: '.obj', free: false },
];

export default function ExportPanel() {
  const { currentProject, activePlan, materials, budgets } = useProjectStore();
  const [exporting, setExporting] = useState<string | null>(null);
  const [exported, setExported] = useState<Set<string>>(new Set());

  const handleExport = async (format: string) => {
    if (!activePlan) return toast.error('Sélectionnez un plan d\'abord');
    setExporting(format);

    try {
      const { data } = await exportAPI.download(format, {
        project: currentProject,
        plan: activePlan,
        materials,
        budget: budgets,
      });

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject?.name || 'projet'}.${format}`;
      a.click();
      URL.revokeObjectURL(url);

      setExported(prev => new Set(prev).add(format));
      toast.success(`Export ${format.toUpperCase()} téléchargé !`);
    } catch (err: any) {
      toast.error(`Erreur d'export: ${err.message}`);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
        <Download size={14} className="text-brand-400" /> Exporter
      </h3>

      <div className="space-y-3">
        {FORMATS.map(fmt => (
          <button
            key={fmt.id}
            onClick={() => handleExport(fmt.id)}
            disabled={exporting === fmt.id}
            className="w-full card hover:border-brand-500/50 flex items-center gap-3 p-3 text-left transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center flex-shrink-0">
              <fmt.icon size={18} className="text-dark-200" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{fmt.label}</span>
                {!fmt.free && <span className="badge-yellow">Pro</span>}
                {exported.has(fmt.id) && <Check size={12} className="text-brand-400" />}
              </div>
              <p className="text-[11px] text-dark-300">{fmt.desc}</p>
            </div>
            {exporting === fmt.id ? (
              <Loader2 size={16} className="animate-spin text-brand-400" />
            ) : (
              <Download size={14} className="text-dark-300" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 bg-dark-700/50 rounded-xl p-3 border border-dark-500/30">
        <p className="text-[11px] text-dark-300">
          💡 Passez au plan <strong className="text-brand-400">Pro</strong> pour accéder aux exports DXF, OBJ, IFC, STL et plus.
        </p>
      </div>
    </div>
  );
}
