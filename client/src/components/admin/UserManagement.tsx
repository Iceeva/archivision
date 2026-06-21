import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Shield, User, Ban, Check } from 'lucide-react';
import { adminAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminAPI.users(page).then(({ data }) => {
      setUsers(data.users);
      setTotalPages(data.pages);
    }).catch(() => {});
  }, [page]);

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await adminAPI.updateUser(id, { isActive: !isActive });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !isActive } : u));
      toast.success(`Utilisateur ${!isActive ? 'activé' : 'désactivé'}`);
    } catch {
      toast.error('Erreur');
    }
  };

  const handleChangeRole = async (id: string, role: string) => {
    try {
      await adminAPI.updateUser(id, { role });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      toast.success('Rôle mis à jour');
    } catch {
      toast.error('Erreur');
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-300" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-9 py-2 text-sm" placeholder="Rechercher un utilisateur..." />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-500">
              <th className="text-left text-xs font-medium text-dark-300 py-3 px-4">Utilisateur</th>
              <th className="text-left text-xs font-medium text-dark-300 py-3 px-4">Rôle</th>
              <th className="text-left text-xs font-medium text-dark-300 py-3 px-4">Plan</th>
              <th className="text-left text-xs font-medium text-dark-300 py-3 px-4">Projets</th>
              <th className="text-left text-xs font-medium text-dark-300 py-3 px-4">Inscrit</th>
              <th className="text-right text-xs font-medium text-dark-300 py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className="border-b border-dark-500/30 hover:bg-dark-700/30">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-dark-500 flex items-center justify-center">
                      <User size={14} className="text-dark-200" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-[11px] text-dark-300">{user.email}</p>
                    </div>
                    {!user.isActive && <span className="badge-red">Désactivé</span>}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <select value={user.role} onChange={e => handleChangeRole(user.id, e.target.value)}
                    className="select text-xs py-1 px-2 w-28">
                    <option value="USER">User</option>
                    <option value="ARCHITECT">Architecte</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="py-3 px-4"><span className="badge-blue">{user.plan}</span></td>
                <td className="py-3 px-4 text-sm text-dark-200">{user._count?.projects || 0}</td>
                <td className="py-3 px-4 text-xs text-dark-300">{formatDate(user.createdAt)}</td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => handleToggleActive(user.id, user.isActive)}
                    className={`p-1.5 rounded-lg ${user.isActive ? 'hover:bg-red-500/10 text-dark-300 hover:text-red-400' : 'hover:bg-green-500/10 text-dark-300 hover:text-green-400'}`}>
                    {user.isActive ? <Ban size={14} /> : <Check size={14} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
          className="btn-ghost flex items-center gap-1 text-sm">
          <ChevronLeft size={14} /> Précédent
        </button>
        <span className="text-sm text-dark-200">Page {page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
          className="btn-ghost flex items-center gap-1 text-sm">
          Suivant <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
