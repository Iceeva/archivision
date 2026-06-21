import { useEffect } from 'react';
import { Loader2, Package } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { formatCurrency } from '@/lib/utils';
import { MATERIAL_CATEGORIES } from '@/config/materials';

export default function MaterialEstimate() {
  const { materials, budgets, calculateEstimates, activePlan, isLoading } = useProjectStore();

  const grouped = materials.reduce((acc, m) => {
    const cat = m.category || 'Autre';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(m);
    return acc;
  }, {} as Record<string, typeof materials>);

  const total = materials.reduce((sum, m) => sum + m.totalPrice, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Package size={14} className="text-brand-400" /> Matériaux
        </h3>
        <button onClick={calculateEstimates} disabled={!activePlan}
          className="btn-ghost text-xs flex items-center gap-1">
          {isLoading ? <Loader2 size={12} className="animate-spin" /> : '🔄'} Calculer
        </button>
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-8 text-xs text-dark-300">
          <p>Cliquez "Calculer" pour estimer les matériaux</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([cat, items]) => {
            const catInfo = MATERIAL_CATEGORIES.find(c => c.name === cat);
            return (
              <div key={cat}>
                <h4 className="text-xs font-medium text-dark-200 mb-2 flex items-center gap-2">
                  <span>{catInfo?.icon || '📦'}</span> {cat}
                </h4>
                <div className="space-y-1">
                  {items.map((m, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] py-1.5 px-2 rounded-lg hover:bg-dark-700">
                      <span className="text-dark-200 flex-1">{m.name}</span>
                      <span className="text-dark-300 w-16 text-right">{m.quantity} {m.unit}</span>
                      <span className="text-white w-16 text-right font-medium">{formatCurrency(m.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="border-t border-dark-500 pt-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Total matériaux</span>
            <span className="text-lg font-bold text-brand-400">{formatCurrency(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
