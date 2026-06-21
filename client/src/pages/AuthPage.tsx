import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2 } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark-800 to-dark-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px]" />

        <div className="relative text-center space-y-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-brand-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-brand-500/20">
            <Building2 size={36} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black mb-3">
              ArchiVision <span className="gradient-text">AI</span>
            </h1>
            <p className="text-dark-200 text-lg max-w-md mx-auto leading-relaxed">
              Concevez votre maison de rêve avec l'intelligence artificielle
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8">
            {[
              { emoji: '🏠', label: 'Plans IA', desc: '4 variantes' },
              { emoji: '📐', label: 'Vue 3D', desc: 'Visite virtuelle' },
              { emoji: '💰', label: 'Budget', desc: '7 pays' },
            ].map(f => (
              <div key={f.label} className="text-center">
                <div className="text-3xl mb-2">{f.emoji}</div>
                <p className="text-sm font-medium">{f.label}</p>
                <p className="text-[10px] text-dark-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-emerald-500 flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold">ArchiVision AI</span>
          </div>

          <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Content de vous revoir !' : 'Créer un compte'}</h2>
          <p className="text-sm text-dark-200 mb-8">
            {isLogin ? 'Connectez-vous pour accéder à vos projets' : 'Commencez à concevoir votre projet'}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {isLogin
                ? <LoginForm onSwitch={() => setIsLogin(false)} />
                : <RegisterForm onSwitch={() => setIsLogin(true)} />
              }
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
