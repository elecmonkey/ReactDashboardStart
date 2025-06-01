import { create } from 'zustand';

interface AppState {
  collapsed: boolean;
  theme: 'light' | 'dark';
  loading: boolean;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  collapsed: false,
  theme: 'light',
  loading: false,
  toggleSidebar: () => set((state) => ({ collapsed: !state.collapsed })),
  setTheme: (theme) => set({ theme }),
  setLoading: (loading) => set({ loading }),
})); 