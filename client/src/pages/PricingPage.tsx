import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Building2 } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/config/materials';
import { cn } from '@/lib/utils';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-dark-900 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-dark-200 hover:text-white mb-8">
          <ArrowLeft size={14} /> Retour au dashboard
        </Link>

        <div className="text-center mb-12">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-400 to-emerald-500 flex items-center justify-center mb-4">
            <Building2 size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Choisissez votre plan</h1>
          <p className="text-dark-200 max-w-lg mx-auto">
            Commencez gratuitement, passez à un plan supérieur quand vous en avez besoin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBSCRIPTION_PLANS.map(plan => (
            <div key={plan.id}
              className={cn(
                'card relative text-center',
                plan.popular ? 'ring-2 ring-brand-500 border-brand-500/50' : ''
              )}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-green px-3 py-1">
                  ⭐ Populaire
                </div>
              )}

              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-black">{plan.price}€</span>
                {plan.price > 0 && <span className="text-dark-300">/mois</span>}
              </div>

              <ul className="space-y-3 mb-8 text-left">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-dark-200">
                    <Check size={14} className="text-brand-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button className={cn(
                'w-full py-3 rounded-xl font-medium transition-all',
                plan.popular ? 'btn-primary' : 'btn-secondary'
              )}>
                {plan.price === 0 ? 'Plan actuel' : 'Souscrire'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-dark-300">
            Tous les prix sont en EUR. Annulation possible à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
}
