import { useState } from 'react';
import { Users, Plus, Mail, Trash2, Shield, Eye, Edit } from 'lucide-react';
import { projectAPI } from '@/lib/api';
import { useProjectStore } from '@/store/projectStore';
import toast from 'react-hot-toast';

const ROLES = [
  { id: 'VIEWER', label: 'Lecteur', icon: Eye, desc: 'Peut voir le projet' },
  { id: 'EDITOR', label: 'Éditeur', icon: Edit, desc: 'Peut modifier le projet' },
  { id: 'ADMIN', label: 'Admin', icon: Shield, desc: 'Gestion complète' },
];

export default function CollabPanel() {
  const { currentProject } = useProjectStore();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('VIEWER');
  const [collaborators, setCollaborators] = useState<any[]>([]);

  const handleAdd = async () => {
    if (!email.trim() || !currentProject) return;
    try {
      const { data } = await projectAPI.addCollaborator(currentProject.id, { email, role });
      setCollaborators(prev => [...prev, data]);
      setEmail('');
      toast.success('Collaborateur ajouté !');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
        <Users size={14} className="text-brand-400" /> Collaboration
      </h3>

      {/* Add collaborator */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-300" />
          <input value={email} onChange={e => setEmail(e.target.value)}
            className="input pl-9 py-2 text-sm" placeholder="Email du collaborateur" />
        </div>

        <div className="flex gap-1">
          {ROLES.map(r => (
            <button key={r.id} onClick={() => setRole(r.id)}
              className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all border
                ${role === r.id
                  ? 'bg-brand-500/10 border-brand-500/50 text-brand-400'
                  : 'bg-dark-700 border-dark-500 text-dark-300'}`}>
              {r.label}
            </button>
          ))}
        </div>

        <button onClick={handleAdd} disabled={!email.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2">
          <Plus size={14} /> Inviter
        </button>
      </div>

      {/* Collaborators list */}
      <div className="space-y-2">
        {collaborators.length === 0 ? (
          <div className="text-center py-8">
            <Users size={32} className="text-dark-400 mx-auto mb-2" />
            <p className="text-xs text-dark-300">Aucun collaborateur</p>
            <p className="text-[10px] text-dark-400 mt-1">
              Invitez des architectes ou clients pour travailler ensemble
            </p>
          </div>
        ) : (
          collaborators.map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-dark-700">
              <div className="w-8 h-8 rounded-full bg-dark-500 flex items-center justify-center">
                <span className="text-[11px] font-semibold">{(c.user?.name || c.email)?.[0]?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{c.user?.name || c.email}</p>
                <p className="text-[10px] text-dark-300">{ROLES.find(r => r.id === c.role)?.label}</p>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-dark-600 text-dark-300">
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 bg-dark-700/50 rounded-xl p-3 border border-dark-500/30">
        <p className="text-[11px] text-dark-300">
          🔒 La collaboration en temps réel est disponible dans le plan <strong className="text-brand-400">Architecte</strong>.
        </p>
      </div>
    </div>
  );
}
