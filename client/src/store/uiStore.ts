import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  rightPanelTab: 'ai' | 'collab' | 'export' | 'estimate';
  viewMode: '2d' | '3d' | 'tour';
  activeFloor: number;

  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleRightPanel: () => void;
  setRightPanelTab: (tab: 'ai' | 'collab' | 'export' | 'estimate') => void;
  setViewMode: (mode: '2d' | '3d' | 'tour') => void;
  setActiveFloor: (floor: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: true,
      rightPanelOpen: true,
      rightPanelTab: 'ai',
      viewMode: '2d',
      activeFloor: 0,

      toggleTheme: () =>
        set((s) => {
          const next = s.theme === 'dark' ? 'light' : 'dark';
          document.documentElement.classList.toggle('dark', next === 'dark');
          return { theme: next };
        }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
      setRightPanelTab: (tab) => set({ rightPanelTab: tab, rightPanelOpen: true }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setActiveFloor: (floor) => set({ activeFloor: floor }),
    }),
    { name: 'archivision-ui', partialize: (s) => ({ theme: s.theme }) }
  )
);
