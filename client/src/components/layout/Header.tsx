import { Menu, Sun, Moon, Bell, Search, PanelLeft } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <header className="h-14 border-b border-dark-500/30 flex items-center justify-between px-4 glass">
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button onClick={toggleSidebar} className="p-2 rounded-xl hover:bg-dark-600 text-dark-200">
            <PanelLeft size={18} />
          </button>
        )}
        {title && <h2 className="text-sm font-semibold">{title}</h2>}
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl hover:bg-dark-600 text-dark-200">
          <Search size={16} />
        </button>
        <button className="p-2 rounded-xl hover:bg-dark-600 text-dark-200">
          <Bell size={16} />
        </button>
        <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-dark-600 text-dark-200">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
