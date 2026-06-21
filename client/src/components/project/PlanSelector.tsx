import { motion } from 'framer-motion';
import { Check, Layers, Maximize, Eye } from 'lucide-react';
import type { GeneratedPlan } from '@/types';
import { cn, formatArea } from '@/lib/utils';

interface Props {
  plans: GeneratedPlan[];
  activePlan: GeneratedPlan | null;
  onSelect: (plan: GeneratedPlan) => void;
}

const PLAN_COLORS = ['from-brand-500 to-emerald-500', 'from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-orange-500 to-yellow-500'];

export default function PlanSelector({ plans, activePlan, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {plans.map((plan, i) => (
        <motion.button
          key={plan.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(plan)}
          className={cn(
            'relative card text-left transition-all',
            activePlan?.id === plan.id ? 'ring-2 ring-brand-500 border-brand-500/50' : ''
          )}
        >
          {/* Plan Preview */}
          <div className={cn(
            'h-28 rounded-xl bg-gradient-to-br mb-3 flex items-center justify-center opacity-20',
            PLAN_COLORS[i % 4]
          )}>
            <Layers size={32} />
          </div>

          {/* Plan mini-preview */}
          <div className="absolute top-3 left-3 right-3 h-[88px] flex items-center justify-center">
            <svg viewBox="0 0 100 80" className="w-full h-full">
              {plan.rooms.filter(r => r.floor === 0).map((room, ri) => {
                const scale = 4;
                return (
                  <g key={ri}>
                    <rect
                      x={room.x * scale + 2}
                      y={room.y * scale + 2}
                      width={room.width * scale}
                      height={room.length * scale}
                      fill={room.type === 'living' ? '#4CAF50' : room.type === 'bedroom' ? '#2196F3' : room.type === 'kitchen' ? '#FF9800' : '#9C27B0'}
                      fillOpacity={0.3}
                      stroke={room.type === 'living' ? '#4CAF50' : room.type === 'bedroom' ? '#2196F3' : room.type === 'kitchen' ? '#FF9800' : '#9C27B0'}
                      strokeWidth={0.5}
                      rx={1}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Info */}
          <h4 className="text-sm font-semibold mb-1 truncate">{plan.name}</h4>
          <p className="text-[10px] text-dark-300 line-clamp-2 mb-2">{plan.description}</p>

          <div className="flex items-center gap-3 text-[10px] text-dark-200">
            <span className="flex items-center gap-1"><Maximize size={8} /> {formatArea(plan.dimensions.builtArea)}</span>
            <span className="flex items-center gap-1"><Layers size={8} /> {plan.dimensions.floors}N</span>
            <span className="flex items-center gap-1"><Eye size={8} /> {plan.rooms.length} pcs</span>
          </div>

          {activePlan?.id === plan.id && (
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
              <Check size={12} className="text-white" />
            </div>
          )}
        </motion.button>
      ))}
    </div>
  );
}
