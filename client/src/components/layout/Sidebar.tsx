import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, FolderOpen, Plus, Settings, BarChart3, CreditCard, ChevronLeft, Building2, Star, LogOut, User } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const { projects } = useProjectStore();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BarChart3, label: 'Admin', path: '/admin', adminOnly: true },
    { icon: CreditCard, label: 'Abonnement', path: '/pricing' },
  ];

  const favoriteProjects = projects.filter(p => p.isFavorite).slice(0, 5);
  const recentProjects = projects.filter(p => !p.isFavorite).slice(0, 5);

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-screen bg-dark-800 border-r border-dark-500/50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-dark-500/30">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-emerald-500 flex items-center justify-center">
                <Building2 size={18} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-sm">ArchiVision</h1>
                <p className="text-[10px] text-dark-200">Architecture IA</p>
              </div>
            </Link>
            <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-dark-600 text-dark-200">
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* New Project */}
          <div className="p-3">
            <button
              onClick={() => navigate('/dashboard?new=1')}
              className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 text-sm"
            >
              <Plus size={16} /> Nouveau Projet
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-0.5">
            {navItems
              .filter(item => !item.adminOnly || user?.role === 'ADMIN')
              .map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all',
                    location.pathname === item.path
                      ? 'bg-brand-500/10 text-brand-400'
                      : 'text-dark-200 hover:bg-dark-600 hover:text-white'
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              ))}
          </nav>

          {/* Favorites */}
          {favoriteProjects.length > 0 && (
            <div className="px-3 mt-6">
              <h3 className="px-3 text-[11px] font-semibold text-dark-300 uppercase tracking-wider mb-2">
                <Star size={10} className="inline mr-1" /> Favoris
              </h3>
              {favoriteProjects.map(p => (
                <Link
                  key={p.id}
                  to={`/project/${p.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-dark-200 hover:bg-dark-600 hover:text-white truncate"
                >
                  <FolderOpen size={12} />
                  <span className="truncate">{p.name}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Recent */}
          {recentProjects.length > 0 && (
            <div className="px-3 mt-4 flex-1 overflow-y-auto">
              <h3 className="px-3 text-[11px] font-semibold text-dark-300 uppercase tracking-wider mb-2">
                Récents
              </h3>
              {recentProjects.map(p => (
                <Link
                  key={p.id}
                  to={`/project/${p.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-dark-200 hover:bg-dark-600 hover:text-white truncate"
                >
                  <FolderOpen size={12} />
                  <span className="truncate">{p.name}</span>
                </Link>
              ))}
            </div>
          )}

          {/* User */}
          <div className="p-3 border-t border-dark-500/30 mt-auto">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-dark-500 flex items-center justify-center">
                <User size={14} className="text-dark-200" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-[10px] text-dark-300 truncate">{user?.email}</p>
              </div>
              <button onClick={() => logout()} className="p-1.5 rounded-lg hover:bg-dark-600 text-dark-300">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
