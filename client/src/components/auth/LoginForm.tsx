import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface Props { onSwitch: () => void; }

export default function LoginForm({ onSwitch }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur de connexion');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Email</label>
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="input pl-11" placeholder="votre@email.com" required />
        </div>
      </div>
      <div>
        <label className="label">Mot de passe</label>
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" />
          <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
            className="input pl-11 pr-11" placeholder="••••••••" required />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-300 hover:text-white">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
        Se connecter
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-500" /></div>
        <div className="relative flex justify-center"><span className="bg-dark-800 px-4 text-xs text-dark-300">ou</span></div>
      </div>

      <button type="button" className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
        <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
        Continuer avec Google
      </button>

      <p className="text-center text-sm text-dark-200">
        Pas encore de compte ?{' '}
        <button type="button" onClick={onSwitch} className="text-brand-400 hover:text-brand-300 font-medium">
          S'inscrire
        </button>
      </p>
    </form>
  );
}
