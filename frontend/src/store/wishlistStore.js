import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useWishlistStore = create(persist((set, get) => ({
    items: [],
    recentlyViewed: [],
    toggleWishlist: (product) => {
        const exists = get().items.some((p) => p.id === product.id);
        if (exists) {
            set((state) => ({
                items: state.items.filter((p) => p.id !== product.id),
            }));
        }
        else {
            set((state) => ({
                items: [product, ...state.items],
            }));
        }
    },
    isInWishlist: (productId) => {
        return get().items.some((p) => p.id === productId);
    },
    removeFromWishlist: (productId) => {
        set((state) => ({
            items: state.items.filter((p) => p.id !== productId),
        }));
    },
    clearWishlist: () => set({ items: [] }),
    addToRecentlyViewed: (product) => {
        const filtered = get().recentlyViewed.filter((p) => p.id !== product.id);
        set({
            recentlyViewed: [product, ...filtered].slice(0, 10),
        });
    },
}), {
    name: 'goodfind-wishlist-storage',
}));
