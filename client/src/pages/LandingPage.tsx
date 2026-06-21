import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Sparkles, Layers, Globe, Box, Cpu, ArrowRight, Play, Star, Users, FolderOpen, Check } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/config/materials';

const FEATURES = [
  { icon: Sparkles, title: 'IA Générative', desc: "Décrivez votre vision, l'IA génère 4 propositions de plans architecturaux.", color: 'text-brand-400' },
  { icon: Layers, title: 'Plans 2D Interactifs', desc: 'Visualisez et modifiez vos plans avec un éditeur professionnel.', color: 'text-blue-400' },
  { icon: Box, title: 'Modélisation 3D', desc: 'Passez du plan 2D à un modèle 3D en un clic.', color: 'text-purple-400' },
  { icon: Globe, title: 'Visite Virtuelle', desc: 'Explorez votre future maison pièce par pièce.', color: 'text-cyan-400' },
  { icon: Cpu, title: 'Estimation Budget', desc: 'Devis matériaux et budget par pays (Afrique, Europe, Amérique).', color: 'text-orange-400' },
  { icon: Users, title: 'Collaboration', desc: 'Travaillez en équipe avec vos architectes et clients.', color: 'text-pink-400' },
];

const STATS = [
  { value: '10K+', label: 'Plans générés' },
  { value: '2K+', label: 'Architectes' },
  { value: '7', label: 'Pays supportés' },
  { value: '4.9', label: 'Note moyenne' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-emerald-500 flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg">ArchiVision <span className="text-brand-400">AI</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-dark-200 hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="text-sm text-dark-200 hover:text-white transition-colors">Tarifs</a>
            <Link to="/auth" className="text-sm text-dark-200 hover:text-white transition-colors">Connexion</Link>
            <Link to="/auth" className="btn-primary text-sm py-2">Commencer gratuitement</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px]" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-6">
            <Sparkles size={12} /> Propulsé par l'Intelligence Artificielle
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Concevez votre <br />
            <span className="gradient-text">maison de rêve</span>
          </h1>
          <p className="text-lg text-dark-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            L'IA génère vos plans d'architecture, modèles 3D et estimations budgétaires.
            Du concept à la construction, en quelques minutes.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/auth" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
              Commencer gratuitement <ArrowRight size={16} />
            </Link>
            <button className="btn-secondary text-base px-8 py-4 flex items-center gap-2">
              <Play size={16} /> Voir la démo
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="max-w-3xl mx-auto mt-20 grid grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="text-2xl font-bold gradient-text">{s.value}</p>
              <p className="text-xs text-dark-300 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tout pour concevoir votre projet</h2>
            <p className="text-dark-200 max-w-2xl mx-auto">
              De la génération de plans IA à l'estimation budgétaire multi-pays, ArchiVision AI couvre tout le processus architectural.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-glow group">
                <div className="w-12 h-12 rounded-2xl bg-dark-700 flex items-center justify-center mb-4
                  group-hover:scale-110 transition-transform">
                  <f.icon size={22} className={f.color} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-dark-200 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-dark-800/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Des tarifs adaptés à chacun</h2>
          <p className="text-dark-200 mb-12">Commencez gratuitement, évoluez selon vos besoins.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {SUBSCRIPTION_PLANS.map(plan => (
              <div key={plan.id}
                className={`card relative ${plan.popular ? 'ring-2 ring-brand-500 border-brand-500/50 scale-[1.02]' : ''}`}>
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
                      <Check size={12} className="text-brand-400 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/auth"
                  className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-all
                    ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
                  {plan.price === 0 ? 'Commencer' : 'Choisir'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-400 to-emerald-500
            flex items-center justify-center mb-6 animate-float">
            <Building2 size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Prêt à concevoir votre projet ?</h2>
          <p className="text-dark-200 mb-8">Rejoignez des milliers d'architectes et particuliers qui utilisent ArchiVision AI.</p>
          <Link to="/auth" className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2">
            Créer mon compte <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-500/30 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Building2 size={20} className="text-brand-400" />
            <span className="font-bold">ArchiVision AI</span>
          </div>
          <p className="text-xs text-dark-300">© 2025 ArchiVision AI. Tous droits réservés.</p>
          <div className="flex gap-6 text-xs text-dark-300">
            <a href="#" className="hover:text-white">CGU</a>
            <a href="#" className="hover:text-white">Confidentialité</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
