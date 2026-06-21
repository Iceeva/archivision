import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface Props { onSwitch: () => void; }

export default function RegisterForm({ onSwitch }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('Minimum 6 caractères');
    try {
      await register(email, password, name);
      toast.success('Compte créé !');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erreur d'inscription");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Nom complet</label>
        <div className="relative">
          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" />
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            className="input pl-11" placeholder="Votre nom" required />
        </div>
      </div>
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
            className="input pl-11 pr-11" placeholder="Minimum 6 caractères" required minLength={6} />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-300 hover:text-white">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
        Créer mon compte
      </button>

      <p className="text-center text-sm text-dark-200">
        Déjà inscrit ?{' '}
        <button type="button" onClick={onSwitch} className="text-brand-400 hover:text-brand-300 font-medium">
          Se connecter
        </button>
      </p>
    </form>
  );
}
