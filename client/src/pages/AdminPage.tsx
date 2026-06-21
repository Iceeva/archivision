import AppShell from '@/components/layout/AppShell';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { useAuth } from '@/hooks/useAuth';

export default function AdminPage() {
  const { user } = useAuth(true);

  if (user?.role !== 'ADMIN') {
    return (
      <AppShell title="Admin">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-4xl mb-4">🔒</p>
            <p className="text-dark-200">Accès réservé aux administrateurs</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Administration">
      <AdminDashboard />
    </AppShell>
  );
}

export default AdminPage;
