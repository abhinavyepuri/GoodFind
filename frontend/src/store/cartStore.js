import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockCoupons } from '@/data/mockData';
export const useCartStore = create(persist((set, get) => ({
    items: [],
    isOpen: false,
    appliedCoupon: null,
    couponError: null,
    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    addItem: (product, options) => {
        const { color, size, config, quantity = 1 } = options || {};
        const items = get().items;
        // Generate a deterministic cart item id based on product and variant choices
        const variantSuffix = [color, size, config].filter(Boolean).join('-');
        const itemId = variantSuffix ? `${product.id}-${variantSuffix}` : product.id;
        const existingIndex = items.findIndex((i) => i.id === itemId);
        if (existingIndex > -1) {
            const updated = [...items];
            updated[existingIndex].quantity = Math.min(updated[existingIndex].quantity + quantity, product.stock);
            set({ items: updated, isOpen: true });
        }
        else {
            const newItem = {
                id: itemId,
                product,
                quantity: Math.min(quantity, product.stock),
                selectedColor: color,
                selectedSize: size,
                selectedConfig: config,
            };
            set({ items: [...items, newItem], isOpen: true });
        }
    },
    removeItem: (itemId) => {
        set((state) => ({
            items: state.items.filter((i) => i.id !== itemId),
        }));
    },
    updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(itemId);
            return;
        }
        set((state) => ({
            items: state.items.map((i) => i.id === itemId
                ? { ...i, quantity: Math.min(quantity, i.product.stock) }
                : i),
        }));
    },
    clearCart: () => {
        set({ items: [], appliedCoupon: null, couponError: null });
    },
    applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const subtotal = get().getSubtotal();
        const found = mockCoupons.find((c) => c.code.toUpperCase() === cleanCode && c.active);
        if (!found) {
            set({ couponError: 'Invalid or expired promotional code.' });
            return false;
        }
        if (subtotal < found.minSpend) {
            set({
                couponError: `This code requires a minimum purchase of $${found.minSpend}.`,
            });
            return false;
        }
        set({ appliedCoupon: found, couponError: null });
        return true;
    },
    removeCoupon: () => {
        set({ appliedCoupon: null, couponError: null });
    },
    getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
    },
    getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    },
    getDiscount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().appliedCoupon;
        if (!coupon)
            return 0;
        if (coupon.discountAmount) {
            return Math.min(coupon.discountAmount, subtotal);
        }
        if (coupon.discountPercent) {
            return (subtotal * coupon.discountPercent) / 100;
        }
        return 0;
    },
    getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0)
            return 0;
        // Free shipping on orders over $150
        return subtotal >= 150 ? 0 : 15;
    },
    getTax: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const taxable = Math.max(0, subtotal - discount);
        // Standard 8% simulated tax
        return taxable * 0.08;
    },
    getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0)
            return 0;
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        const tax = get().getTax();
        return Math.max(0, subtotal - discount + shipping + tax);
    },
}), {
    name: 'goodfind-cart-storage',
    partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
    }),
}));
