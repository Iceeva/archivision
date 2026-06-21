import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
  showSidebar?: boolean;
  title?: string;
}

export default function AppShell({ children, showSidebar = true, title }: AppShellProps) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="h-screen flex overflow-hidden bg-dark-900">
      {showSidebar && <Sidebar />}
      <main className={cn(
        'flex-1 flex flex-col overflow-hidden transition-all duration-300',
        showSidebar && sidebarOpen ? 'ml-0' : ''
      )}>
        <Header title={title} />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
