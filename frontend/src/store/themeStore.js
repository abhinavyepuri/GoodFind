import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useThemeStore = create(persist((set, get) => ({
    theme: 'light',
    toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(next);
    },
    setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
            const root = document.documentElement;
            if (theme === 'dark') {
                root.classList.add('dark');
            }
            else {
                root.classList.remove('dark');
            }
        }
    },
}), {
    name: 'goodfind-theme-storage',
    onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
            if (state.theme === 'dark') {
                document.documentElement.classList.add('dark');
            }
            else {
                document.documentElement.classList.remove('dark');
            }
        }
    },
}));
