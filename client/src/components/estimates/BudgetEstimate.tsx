import { useProjectStore } from '@/store/projectStore';
import { formatCurrency, formatArea } from '@/lib/utils';
import { COUNTRY_OPTIONS } from '@/lib/utils';
import { TrendingUp, MapPin } from 'lucide-react';

const LEVEL_COLORS: Record<string, string> = {
  economic: 'border-green-500/30 bg-green-500/5',
  standard: 'border-blue-500/30 bg-blue-500/5',
  premium: 'border-purple-500/30 bg-purple-500/5',
  luxury: 'border-yellow-500/30 bg-yellow-500/5',
};

const LEVEL_ICONS: Record<string, string> = {
  economic: '💚', standard: '💙', premium: '💎', luxury: '👑',
};

export default function BudgetEstimate() {
  const { budgets, currentProject } = useProjectStore();
  const country = COUNTRY_OPTIONS.find(c => c.code === currentProject?.country);

  if (budgets.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-1">
        <TrendingUp size={14} className="text-brand-400" /> Estimation Budget
      </h3>
      {country && (
        <p className="text-[11px] text-dark-300 mb-4 flex items-center gap-1">
          <MapPin size={10} /> {country.flag} {country.name}
        </p>
      )}

      <div className="space-y-3">
        {budgets.map(b => (
          <div key={b.level} className={`rounded-xl border p-3 ${LEVEL_COLORS[b.level] || 'border-dark-500'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span>{LEVEL_ICONS[b.level]}</span>
                <span className="text-xs font-semibold">{b.label}</span>
              </div>
              <span className="text-sm font-bold">{formatCurrency(b.totalCost, b.currency)}</span>
            </div>

            <div className="space-y-1 text-[10px] text-dark-300">
              <div className="flex justify-between">
                <span>Matériaux</span>
                <span>{formatCurrency(b.materials.reduce((s, m) => s + m.totalPrice, 0), b.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Main d'œuvre</span>
                <span>{formatCurrency(b.laborCost, b.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frais généraux</span>
                <span>{formatCurrency(b.overhead, b.currency)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-dark-500/30 text-dark-200">
                <span>Coût /m²</span>
                <span className="font-medium">{formatCurrency(b.costPerM2, b.currency)}/m²</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
