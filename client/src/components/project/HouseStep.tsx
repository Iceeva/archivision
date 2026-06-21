import { Building2, BedDouble, Bath, UtensilsCrossed, Sofa, Car, Waves, TreePine, Fence } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { HOUSE_TYPE_LABELS } from '@/lib/utils';
import type { HouseType } from '@/types';

const HOUSE_ICONS: Record<string, string> = {
  VILLA: '🏡', DUPLEX: '🏘️', TRIPLEX: '🏗️', BUILDING: '🏢', RESIDENCE: '🏛️',
  MODERN: '🏠', LUXURY: '💎', TRADITIONAL: '🏚️', BUNGALOW: '🛖',
};

export default function HouseStep() {
  const { houseConfig, setHouseConfig } = useProjectStore();

  const NumberInput = ({ label, icon: Icon, value, onChange, min = 0, max = 20 }: any) => (
    <div>
      <label className="label flex items-center gap-2"><Icon size={12} /> {label}</label>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(min, (value || 0) - 1))}
          className="w-9 h-9 rounded-xl bg-dark-600 hover:bg-dark-500 flex items-center justify-center text-lg">−</button>
        <input type="number" value={value || ''} min={min} max={max}
          onChange={e => onChange(parseInt(e.target.value) || undefined)}
          className="input text-center w-16 py-2" />
        <button onClick={() => onChange(Math.min(max, (value || 0) + 1))}
          className="w-9 h-9 rounded-xl bg-dark-600 hover:bg-dark-500 flex items-center justify-center text-lg">+</button>
      </div>
    </div>
  );

  const Toggle = ({ label, icon: Icon, value, onChange }: any) => (
    <button onClick={() => onChange(!value)}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all
        ${value
          ? 'bg-brand-500/10 border-brand-500/50 text-brand-400'
          : 'bg-dark-700 border-dark-500 text-dark-200 hover:border-dark-400'}`}>
      <Icon size={14} /> {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <p className="text-sm text-dark-200">Tous les champs sont facultatifs. L'IA complétera intelligemment.</p>

      {/* Type de maison */}
      <div>
        <label className="label">Type de maison</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(HOUSE_TYPE_LABELS).map(([key, label]) => (
            <button key={key} onClick={() => setHouseConfig({ houseType: key as HouseType })}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all
                ${houseConfig.houseType === key
                  ? 'bg-brand-500/10 border-brand-500/50 text-brand-400'
                  : 'bg-dark-700 border-dark-500 text-dark-200 hover:border-dark-400'}`}>
              <span>{HOUSE_ICONS[key]}</span> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Nombres */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <NumberInput label="Étages" icon={Building2} value={houseConfig.floors} onChange={(v: number) => setHouseConfig({ floors: v })} min={1} max={10} />
        <NumberInput label="Chambres" icon={BedDouble} value={houseConfig.bedrooms} onChange={(v: number) => setHouseConfig({ bedrooms: v })} max={15} />
        <NumberInput label="Salons" icon={Sofa} value={houseConfig.livingRooms} onChange={(v: number) => setHouseConfig({ livingRooms: v })} max={5} />
        <NumberInput label="Cuisines" icon={UtensilsCrossed} value={houseConfig.kitchens} onChange={(v: number) => setHouseConfig({ kitchens: v })} max={5} />
        <NumberInput label="Salles de bain" icon={Bath} value={houseConfig.bathrooms} onChange={(v: number) => setHouseConfig({ bathrooms: v })} max={10} />
      </div>

      {/* Options */}
      <div>
        <label className="label">Options</label>
        <div className="flex flex-wrap gap-2">
          <Toggle label="Garage" icon={Car} value={houseConfig.hasGarage} onChange={(v: boolean) => setHouseConfig({ hasGarage: v })} />
          <Toggle label="Piscine" icon={Waves} value={houseConfig.hasPool} onChange={(v: boolean) => setHouseConfig({ hasPool: v })} />
          <Toggle label="Terrasse" icon={Fence} value={houseConfig.hasTerrace} onChange={(v: boolean) => setHouseConfig({ hasTerrace: v })} />
          <Toggle label="Balcon" icon={Building2} value={houseConfig.hasBalcony} onChange={(v: boolean) => setHouseConfig({ hasBalcony: v })} />
          <Toggle label="Jardin" icon={TreePine} value={houseConfig.hasGarden} onChange={(v: boolean) => setHouseConfig({ hasGarden: v })} />
        </div>
      </div>
    </div>
  );
}
