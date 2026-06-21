import { Check } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/config/materials';
import { cn } from '@/lib/utils';

export default function SubscriptionPlans() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">Plans d'abonnement</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUBSCRIPTION_PLANS.map(plan => (
          <div key={plan.id}
            className={cn(
              'card relative',
              plan.popular ? 'ring-2 ring-brand-500 border-brand-500/50' : ''
            )}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-green px-3 py-1">
                Populaire
              </div>
            )}

            <h4 className="text-lg font-bold mb-1">{plan.name}</h4>
            <div className="mb-4">
              <span className="text-3xl font-bold">{plan.price}€</span>
              {plan.price > 0 && <span className="text-sm text-dark-300">/mois</span>}
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-dark-200">
                  <Check size={12} className="text-brand-400 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button className={cn(
              'w-full py-2.5 rounded-xl text-sm font-medium transition-all',
              plan.popular ? 'btn-primary' : 'btn-secondary'
            )}>
              {plan.price === 0 ? 'Plan actuel' : 'Choisir'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
