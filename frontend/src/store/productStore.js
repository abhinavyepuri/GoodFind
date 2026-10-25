import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { mockProducts, mockCategories, mockOrders, mockReviews, mockCoupons, initialStoreSettings, mockCustomer, } from '@/data/mockData';
export const useProductStore = create(persist((set, get) => ({
    products: mockProducts,
    categories: mockCategories,
    orders: mockOrders,
    reviews: mockReviews,
    coupons: mockCoupons,
    settings: initialStoreSettings,
    currentUser: mockCustomer,
    compareItems: [],
    activeRole: 'customer',
    setActiveRole: (role) => set({ activeRole: role }),
    addProduct: (newProductData) => {
        const id = `prod-${Date.now()}`;
        const newProduct = {
            ...newProductData,
            id,
            createdAt: new Date().toISOString(),
        };
        set((state) => ({
            products: [newProduct, ...state.products],
        }));
        return newProduct;
    },
    updateProduct: (id, updates) => {
        set((state) => ({
            products: state.products.map((p) => p.id === id ? { ...p, ...updates } : p),
        }));
    },
    deleteProduct: (id) => {
        set((state) => ({
            products: state.products.filter((p) => p.id !== id),
        }));
    },
    addCategory: (newCatData) => {
        const id = `cat-${Date.now()}`;
        const newCategory = {
            ...newCatData,
            id,
        };
        set((state) => ({
            categories: [...state.categories, newCategory],
        }));
        return newCategory;
    },
    updateCategory: (id, updates) => {
        set((state) => ({
            categories: state.categories.map((c) => c.id === id ? { ...c, ...updates } : c),
        }));
    },
    deleteCategory: (id) => {
        set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
        }));
    },
    createOrder: (orderData) => {
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const orderId = `ord-${Date.now()}`;
        const orderNumber = `GF-${randomNum}`;
        const now = new Date();
        const newOrder = {
            ...orderData,
            id: orderId,
            orderNumber,
            createdAt: now.toISOString(),
            trackingNumber: `GFTRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            timeline: [
                {
                    status: 'placed',
                    title: 'Order Placed',
                    description: 'Payment authorized and receipt dispatched to email.',
                    timestamp: now.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                    }),
                    completed: true,
                },
                {
                    status: 'processing',
                    title: 'Preparing for Shipment',
                    description: 'Items being picked and packed at the distribution hub.',
                    timestamp: 'Pending',
                    completed: false,
                },
            ],
        };
        // Deduct inventory
        const currentProducts = get().products;
        const updatedProducts = currentProducts.map((prod) => {
            const orderedItem = orderData.items.find((item) => item.productId === prod.id);
            if (orderedItem) {
                return {
                    ...prod,
                    stock: Math.max(0, prod.stock - orderedItem.quantity),
                };
            }
            return prod;
        });
        // Increment coupon usage count if used
        let updatedCoupons = get().coupons;
        if (orderData.couponCode) {
            updatedCoupons = updatedCoupons.map((c) => c.code.toUpperCase() === orderData.couponCode?.toUpperCase()
                ? { ...c, usageCount: c.usageCount + 1 }
                : c);
        }
        set((state) => ({
            orders: [newOrder, ...state.orders],
            products: updatedProducts,
            coupons: updatedCoupons,
            currentUser: {
                ...state.currentUser,
                totalOrders: state.currentUser.totalOrders + 1,
                totalSpent: state.currentUser.totalSpent + newOrder.total,
            },
        }));
        return newOrder;
    },
    updateOrderStatus: (orderId, status) => {
        set((state) => ({
            orders: state.orders.map((o) => {
                if (o.id !== orderId)
                    return o;
                const nowStr = new Date().toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                });
                const updatedTimeline = [...o.timeline];
                const existingIdx = updatedTimeline.findIndex((t) => t.status === status);
                if (existingIdx > -1) {
                    updatedTimeline[existingIdx].completed = true;
                    updatedTimeline[existingIdx].timestamp = nowStr;
                }
                else {
                    updatedTimeline.push({
                        status,
                        title: `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                        description: `Order milestone reached on ${nowStr}`,
                        timestamp: nowStr,
                        completed: true,
                    });
                }
                return {
                    ...o,
                    status,
                    timeline: updatedTimeline,
                };
            }),
        }));
    },
    cancelOrder: (orderId, { reason, refundMethod } = {}) => {
        const nowStr = new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
        set((state) => ({
            orders: state.orders.map((o) => {
                if (o.id !== orderId && o.orderNumber !== orderId)
                    return o;
                const updatedTimeline = [
                    ...o.timeline,
                    {
                        status: 'cancelled',
                        title: 'Order Cancelled',
                        description: `Cancelled by customer. Reason: ${reason || 'Customer request'}. Refund: ${refundMethod || 'Original Payment'}.`,
                        timestamp: nowStr,
                        completed: true,
                    },
                ];
                return {
                    ...o,
                    status: 'cancelled',
                    paymentStatus: 'refunded',
                    cancellationDetails: {
                        cancelledAt: new Date().toISOString(),
                        reason: reason || 'Customer request',
                        refundMethod: refundMethod || 'Original payment',
                    },
                    timeline: updatedTimeline,
                };
            }),
        }));
    },
    requestReturn: (orderId, { items, reason, resolution, returnTrackingNumber, images } = {}) => {
        const nowStr = new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
        const rmaNumber = `RMA-${String(orderId).replace(/^ord-/, 'GF-')}-${Math.floor(100 + Math.random() * 900)}`;
        const trackingNumber = returnTrackingNumber || `GF-RET-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        set((state) => ({
            orders: state.orders.map((o) => {
                if (o.id !== orderId && o.orderNumber !== orderId)
                    return o;
                const updatedTimeline = [
                    ...o.timeline,
                    {
                        status: 'returned',
                        title: 'Return Request Authorized',
                        description: `Prepaid label generated (${trackingNumber}). Reason: ${reason || 'Customer return'}. Resolution: ${resolution || 'Refund'}.`,
                        timestamp: nowStr,
                        completed: true,
                    },
                ];
                return {
                    ...o,
                    status: 'returned',
                    returnDetails: {
                        rmaNumber,
                        returnTrackingNumber: trackingNumber,
                        requestedAt: new Date().toISOString(),
                        reason: reason || 'Customer return',
                        resolution: resolution || 'Refund to original payment',
                        returnedItems: items || o.items,
                        images: images || [],
                    },
                    timeline: updatedTimeline,
                };
            }),
        }));
        return { rmaNumber, trackingNumber };
    },
    updateOrder: (orderId, updates) => {
        set((state) => ({
            orders: state.orders.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, ...updates } : o)),
        }));
    },
    addReview: (reviewData) => {
        const newReview = {
            ...reviewData,
            id: `rev-${Date.now()}`,
            createdAt: new Date().toISOString(),
            helpfulCount: 0,
        };
        // Recalculate average rating for product
        const allProductReviews = [
            newReview,
            ...get().reviews.filter((r) => r.productId === reviewData.productId),
        ];
        const avg = allProductReviews.reduce((sum, r) => sum + r.rating, 0) /
            allProductReviews.length;
        set((state) => ({
            reviews: [newReview, ...state.reviews],
            products: state.products.map((p) => p.id === reviewData.productId
                ? {
                    ...p,
                    rating: Math.round(avg * 10) / 10,
                    reviewCount: p.reviewCount + 1,
                }
                : p),
        }));
    },
    deleteReview: (reviewId) => {
        set((state) => ({
            reviews: state.reviews.filter((r) => r.id !== reviewId),
        }));
    },
    addCoupon: (couponData) => {
        const newCoupon = {
            ...couponData,
            id: `c-${Date.now()}`,
            usageCount: 0,
        };
        set((state) => ({
            coupons: [newCoupon, ...state.coupons],
        }));
    },
    toggleCouponActive: (couponId) => {
        set((state) => ({
            coupons: state.coupons.map((c) => c.id === couponId ? { ...c, active: !c.active } : c),
        }));
    },
    deleteCoupon: (couponId) => {
        set((state) => ({
            coupons: state.coupons.filter((c) => c.id !== couponId),
        }));
    },
    updateSettings: (updates) => {
        set((state) => ({
            settings: { ...state.settings, ...updates },
        }));
    },
    updateAppearance: (appearanceUpdates) => {
        set((state) => ({
            settings: {
                ...state.settings,
                appearance: {
                    ...state.settings.appearance,
                    ...appearanceUpdates,
                },
            },
        }));
    },
    updateAnnouncement: (announcementUpdates) => {
        set((state) => ({
            settings: {
                ...state.settings,
                announcement: {
                    ...state.settings.announcement,
                    ...announcementUpdates,
                },
            },
        }));
    },
    updateUserProfile: (updates) => {
        set((state) => ({
            currentUser: { ...state.currentUser, ...updates },
        }));
    },
    addAddress: (addr) => {
        const newAddress = {
            ...addr,
            id: `addr-${Date.now()}`,
        };
        set((state) => ({
            currentUser: {
                ...state.currentUser,
                addresses: [...state.currentUser.addresses, newAddress],
            },
        }));
    },
    deleteAddress: (id) => {
        set((state) => ({
            currentUser: {
                ...state.currentUser,
                addresses: state.currentUser.addresses.filter((a) => a.id !== id),
            },
        }));
    },
    setDefaultAddress: (id) => {
        set((state) => ({
            currentUser: {
                ...state.currentUser,
                addresses: state.currentUser.addresses.map((a) => ({
                    ...a,
                    isDefault: a.id === id,
                })),
            },
        }));
    },
    addToCompare: (product) => {
        const current = get().compareItems || [];
        if (current.some((p) => p.id === product.id)) {
            return false;
        }
        if (current.length >= 4) {
            toast.error('Comparison limit reached', {
                description: 'You can compare up to 4 products simultaneously.',
            });
            return false;
        }
        set({ compareItems: [...current, product] });
        toast.success(`Added ${product.name} to comparison`, {
            description: `${current.length + 1} of 4 slots filled.`,
        });
        return true;
    },
    removeFromCompare: (productId) => {
        set((state) => ({
            compareItems: (state.compareItems || []).filter((p) => p.id !== productId),
        }));
    },
    toggleCompare: (product) => {
        const inList = (get().compareItems || []).some((p) => p.id === product.id);
        if (inList) {
            get().removeFromCompare(product.id);
        } else {
            get().addToCompare(product);
        }
    },
    isInCompare: (productId) => {
        return (get().compareItems || []).some((p) => p.id === productId);
    },
    clearCompare: () => set({ compareItems: [] }),
    resetToDefaults: () => {
        set({
            products: mockProducts,
            categories: mockCategories,
            orders: mockOrders,
            reviews: mockReviews,
            coupons: mockCoupons,
            settings: initialStoreSettings,
            currentUser: mockCustomer,
            compareItems: [],
        });
    },
}), {
    name: 'goodfind-commerce-storage',
}));
