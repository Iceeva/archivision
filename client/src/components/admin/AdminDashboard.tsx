import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FolderOpen, Activity, TrendingUp, Shield } from 'lucide-react';
import { adminAPI } from '@/lib/api';
import UserManagement from './UserManagement';
import SubscriptionPlans from './SubscriptionPlans';
import { formatNumber, formatRelative } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [tab, setTab] = useState<'overview' | 'users' | 'plans'>('overview');

  useEffect(() => {
    adminAPI.stats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  const tabs = [
    { id: 'overview' as const, label: 'Vue générale', icon: TrendingUp },
    { id: 'users' as const, label: 'Utilisateurs', icon: Users },
    { id: 'plans' as const, label: 'Abonnements', icon: Shield },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Shield size={24} className="text-brand-400" /> Administration
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-800 rounded-xl p-1 mb-8 w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === t.id ? 'bg-dark-600 text-white' : 'text-dark-300 hover:text-white'}`}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-glow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Users size={18} className="text-brand-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatNumber(stats.users.total)}</p>
                  <p className="text-xs text-dark-300">Utilisateurs</p>
                </div>
              </div>
            </div>
            <div className="card-glow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <FolderOpen size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatNumber(stats.projects.total)}</p>
                  <p className="text-xs text-dark-300">Projets</p>
                </div>
              </div>
            </div>
            <div className="card-glow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Activity size={18} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatNumber(stats.projects.active)}</p>
                  <p className="text-xs text-dark-300">Projets actifs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent activities */}
          <div className="card">
            <h3 className="text-sm font-semibold mb-4">Activités récentes</h3>
            <div className="space-y-2">
              {(stats.recentActivities || []).slice(0, 10).map((a: any, i: number) => (
                <div key={i} className="flex items-center gap-3 py-2 text-xs border-b border-dark-500/20 last:border-0">
                  <Activity size={12} className="text-dark-300" />
                  <span className="text-dark-200 flex-1">{a.action}</span>
                  <span className="text-dark-400">{a.user?.name}</span>
                  <span className="text-dark-400">{formatRelative(a.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'users' && <UserManagement />}
      {tab === 'plans' && <SubscriptionPlans />}
    </div>
  );
}
