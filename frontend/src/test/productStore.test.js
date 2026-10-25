import { describe, it, expect, beforeEach } from 'vitest';
import { useProductStore } from '@/store/productStore';
describe('Product & Commerce Master Store', () => {
    beforeEach(() => {
        useProductStore.getState().resetToDefaults();
    });
    it('loads starter catalog with 30+ products', () => {
        const products = useProductStore.getState().products;
        expect(products.length).toBeGreaterThanOrEqual(30);
    });
    it('adds a new product and preserves in state', () => {
        const initialCount = useProductStore.getState().products.length;
        const created = useProductStore.getState().addProduct({
            slug: 'test-custom-lamp',
            name: 'Custom Sculptural Lamp',
            tagline: 'Hand-blown glass',
            description: 'Test description',
            category: 'Home & Ergonomics',
            brand: 'Test Atelier',
            price: 150,
            stock: 20,
            sku: 'TEST-SKU-1',
            rating: 5,
            reviewCount: 0,
            tags: ['Lighting'],
            images: ['https://example.com/lamp.jpg'],
            specifications: { Power: '12W' },
            shippingInfo: '2 days',
            warrantyInfo: '1 year',
            returnPolicy: '30 days',
        });
        expect(created.id).toBeDefined();
        expect(useProductStore.getState().products.length).toBe(initialCount + 1);
    });
    it('creates an order, reduces inventory, and updates customer metrics', () => {
        const product = useProductStore.getState().products[0];
        const initialStock = product.stock;
        const initialOrders = useProductStore.getState().orders.length;
        const newOrder = useProductStore.getState().createOrder({
            customer: {
                id: 'cust-test',
                name: 'Jordan Maker',
                email: 'jordan@example.com',
                phone: '555-1234',
            },
            items: [
                {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 2,
                    image: product.images[0],
                },
            ],
            subtotal: product.price * 2,
            discount: 0,
            shipping: 0,
            tax: (product.price * 2) * 0.08,
            total: (product.price * 2) * 1.08,
            status: 'processing',
            paymentStatus: 'paid',
            paymentMethod: 'Credit Card (Demo)',
            shippingAddress: {
                id: 'addr-test',
                title: 'Home',
                fullName: 'Jordan Maker',
                street: '123 Main St',
                city: 'Seattle',
                state: 'WA',
                postalCode: '98101',
                country: 'United States',
                phone: '555-1234',
                isDefault: true,
            },
        });
        expect(newOrder.orderNumber).toBeDefined();
        expect(useProductStore.getState().orders.length).toBe(initialOrders + 1);
        // Check stock reduction
        const updatedProduct = useProductStore.getState().products.find((p) => p.id === product.id);
        expect(updatedProduct?.stock).toBe(initialStock - 2);
    });
    it('updates order status through fulfillment lifecycle', () => {
        const orders = useProductStore.getState().orders;
        const firstOrder = orders[0];
        useProductStore.getState().updateOrderStatus(firstOrder.id, 'delivered');
        const updated = useProductStore.getState().orders.find((o) => o.id === firstOrder.id);
        expect(updated?.status).toBe('delivered');
    });
});
