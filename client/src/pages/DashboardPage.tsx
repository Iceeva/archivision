import AppShell from '@/components/layout/AppShell';
import Dashboard from '@/components/dashboard/Dashboard';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  useAuth(true);

  return (
    <AppShell title="Dashboard">
      <Dashboard />
    </AppShell>
  );
}
