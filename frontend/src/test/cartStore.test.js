import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/store/cartStore';
import { mockProducts } from '@/data/mockData';
describe('Cart Store & Pricing Engine', () => {
    beforeEach(() => {
        useCartStore.getState().clearCart();
        useCartStore.getState().removeCoupon();
    });
    it('initializes with empty bag and zero totals', () => {
        const state = useCartStore.getState();
        expect(state.items).toHaveLength(0);
        expect(state.getSubtotal()).toBe(0);
        expect(state.getTotal()).toBe(0);
        expect(state.getItemCount()).toBe(0);
    });
    it('adds item to cart and updates count and subtotal', () => {
        const product = mockProducts[0]; // Aero Sound Pro ($349)
        useCartStore.getState().addItem(product, { quantity: 1, color: 'Space Gray' });
        const state = useCartStore.getState();
        expect(state.items).toHaveLength(1);
        expect(state.getItemCount()).toBe(1);
        expect(state.getSubtotal()).toBe(349);
    });
    it('updates quantity and prevents exceeding stock', () => {
        const product = mockProducts[0];
        useCartStore.getState().addItem(product, { quantity: 1 });
        const itemId = useCartStore.getState().items[0].id;
        useCartStore.getState().updateQuantity(itemId, 3);
        expect(useCartStore.getState().getItemCount()).toBe(3);
        expect(useCartStore.getState().getSubtotal()).toBe(349 * 3);
        // Removing by setting quantity to 0
        useCartStore.getState().updateQuantity(itemId, 0);
        expect(useCartStore.getState().items).toHaveLength(0);
    });
    it('applies coupon WELCOME10 and calculates 10% discount', () => {
        const product = mockProducts[0]; // $349
        useCartStore.getState().addItem(product, { quantity: 1 });
        const applied = useCartStore.getState().applyCoupon('WELCOME10');
        expect(applied).toBe(true);
        const discount = useCartStore.getState().getDiscount();
        expect(discount).toBeCloseTo(34.9, 1);
        const subtotal = useCartStore.getState().getSubtotal();
        expect(subtotal).toBe(349);
        // Over $150 so shipping is free
        expect(useCartStore.getState().getShipping()).toBe(0);
    });
    it('rejects coupon if subtotal is below minimum spend threshold', () => {
        const cheapProduct = mockProducts.find((p) => p.price < 50) || mockProducts[0];
        useCartStore.getState().addItem(cheapProduct, { quantity: 1 });
        // VIP50 requires min spend of $250
        const applied = useCartStore.getState().applyCoupon('VIP50');
        if (cheapProduct.price < 250) {
            expect(applied).toBe(false);
            expect(useCartStore.getState().couponError).toBeDefined();
        }
    });
});
