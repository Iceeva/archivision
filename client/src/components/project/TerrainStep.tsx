import { Ruler, Compass, Mountain } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { TERRAIN_TYPE_LABELS } from '@/lib/utils';

const ORIENTATIONS = ['Nord', 'Sud', 'Est', 'Ouest', 'Nord-Est', 'Nord-Ouest', 'Sud-Est', 'Sud-Ouest'];

export default function TerrainStep() {
  const { terrainConfig, setTerrainConfig } = useProjectStore();

  return (
    <div className="space-y-6">
      <p className="text-sm text-dark-200 mb-4">
        Définissez les dimensions de votre terrain. Seule une dimension minimale est requise — le reste est facultatif.
      </p>

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label flex items-center gap-2"><Ruler size={12} /> Longueur (m)</label>
          <input type="number" value={terrainConfig.length || ''} min={5} max={200}
            onChange={e => setTerrainConfig({ length: parseFloat(e.target.value) || undefined })}
            className="input" placeholder="ex: 20" />
        </div>
        <div>
          <label className="label flex items-center gap-2"><Ruler size={12} /> Largeur (m)</label>
          <input type="number" value={terrainConfig.width || ''} min={5} max={200}
            onChange={e => setTerrainConfig({ width: parseFloat(e.target.value) || undefined })}
            className="input" placeholder="ex: 15" />
        </div>
      </div>

      {/* Surface calculée */}
      {terrainConfig.length && terrainConfig.width && (
        <div className="bg-brand-500/10 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
            <span className="text-brand-400 font-bold text-sm">{Math.round(terrainConfig.length * terrainConfig.width)}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-brand-400">Surface calculée</p>
            <p className="text-xs text-dark-200">{terrainConfig.length}m × {terrainConfig.width}m = {Math.round(terrainConfig.length * terrainConfig.width)} m²</p>
          </div>
        </div>
      )}

      {/* Orientation */}
      <div>
        <label className="label flex items-center gap-2"><Compass size={12} /> Orientation (facultatif)</label>
        <div className="grid grid-cols-4 gap-2">
          {ORIENTATIONS.map(o => (
            <button key={o} onClick={() => setTerrainConfig({ orientation: o })}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border
                ${terrainConfig.orientation === o
                  ? 'bg-brand-500/10 border-brand-500/50 text-brand-400'
                  : 'bg-dark-700 border-dark-500 text-dark-200 hover:border-dark-400'}`}>
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Type de terrain */}
      <div>
        <label className="label flex items-center gap-2"><Mountain size={12} /> Type de terrain (facultatif)</label>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(TERRAIN_TYPE_LABELS).map(([key, label]) => (
            <button key={key} onClick={() => setTerrainConfig({ type: key as any })}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all border
                ${terrainConfig.type === key
                  ? 'bg-brand-500/10 border-brand-500/50 text-brand-400'
                  : 'bg-dark-700 border-dark-500 text-dark-200 hover:border-dark-400'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
