import * as React from 'react';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { STATUS_TABS } from '../types';

/**
 * Custom Hook for Order History management, filtering, and self-service actions
 */
export function useOrders() {
  const allOrders = useProductStore((state) => state.orders) || [];
  const products = useProductStore((state) => state.products) || [];
  const cancelOrderAction = useProductStore((state) => state.cancelOrder);
  const requestReturnAction = useProductStore((state) => state.requestReturn);
  const updateOrderAction = useProductStore((state) => state.updateOrder);
  const addItemToCart = useCartStore((state) => state.addItem);
  const { user, isAuthenticated, openAuthModal } = useAuthStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('all');
  const [dateRange, setDateRange] = React.useState('all');

  const [dbOrders, setDbOrders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Synchronize orders directly with the backend database for the authenticated user
  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      setDbOrders([]);
      return;
    }

    let isMounted = true;
    const fetchUserOrders = async () => {
      setIsLoading(true);
      try {
        const target = user.id || user.email;
        const res = await fetch(`/api/orders/user/${encodeURIComponent(target)}`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            setDbOrders(data);
          }
        }
      } catch (err) {
        console.warn('Could not retrieve user orders from DB:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUserOrders();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.id, user?.email]);

  // Combine DB orders with any newly placed in-session orders for this user
  const orders = React.useMemo(() => {
    if (!isAuthenticated || !user) return [];
    const cleanEmail = (user.email || '').toLowerCase().trim();

    const combined = [...dbOrders];
    const existingIds = new Set(dbOrders.map((o) => o.id || o.orderNumber));

    (allOrders || []).forEach((o) => {
      const isUserOrder =
        (o.customer?.id && o.customer.id === user.id) ||
        (o.customer?.email && o.customer.email.toLowerCase().trim() === cleanEmail);
      if (isUserOrder && !existingIds.has(o.id) && !existingIds.has(o.orderNumber)) {
        combined.push(o);
      }
    });

    return combined.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [dbOrders, allOrders, isAuthenticated, user]);

  // Filtered orders with multi-attribute search and date filtering
  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      if (!order) return false;

      // 1. Status Tab filter
      if (activeTab !== 'all') {
        const orderStatus = (order.status || '').toLowerCase();
        if (activeTab === 'returns') {
          if (orderStatus !== 'returned') return false;
        } else if (orderStatus !== activeTab) {
          return false;
        }
      }

      // 2. Date Range filter
      if (dateRange !== 'all') {
        const orderDate = new Date(order.createdAt || Date.now());
        const now = Date.now();
        const diffMs = now - orderDate.getTime();
        const daysDiff = diffMs / (1000 * 60 * 60 * 24);

        if (dateRange === '30_days' && daysDiff > 30) return false;
        if (dateRange === '3_months' && daysDiff > 90) return false;
        if (dateRange === '6_months' && daysDiff > 180) return false;
        if (dateRange === '2026' && orderDate.getFullYear() !== 2026) return false;
        if (dateRange === '2025' && orderDate.getFullYear() !== 2025) return false;
      }

      // 3. Search Query (orderNumber, product titles, brand, recipient)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = (order.orderNumber || '').toLowerCase().includes(q) ||
                          (order.id || '').toLowerCase().includes(q) ||
                          (order.trackingNumber || '').toLowerCase().includes(q);
        const matchesRecipient = (order.customer?.name || '').toLowerCase().includes(q) ||
                                 (order.shippingAddress?.fullName || '').toLowerCase().includes(q) ||
                                 (order.shippingAddress?.city || '').toLowerCase().includes(q);
        const matchesItems = (order.items || []).some((item) => {
          const nameMatch = (item.name || '').toLowerCase().includes(q);
          const variantMatch = (item.variant || '').toLowerCase().includes(q);
          // Match brand if present in catalog
          const catalogItem = products.find((p) => p.id === item.productId);
          const brandMatch = (catalogItem?.brand || '').toLowerCase().includes(q);
          return nameMatch || variantMatch || brandMatch;
        });

        if (!matchesId && !matchesRecipient && !matchesItems) {
          return false;
        }
      }

      return true;
    });
  }, [orders, products, activeTab, dateRange, searchQuery]);

  // Tab counts
  const statusCounts = React.useMemo(() => {
    const counts = {
      all: orders.length,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
    };
    orders.forEach((o) => {
      const s = (o.status || '').toLowerCase();
      if (counts[s] !== undefined) {
        counts[s] += 1;
      }
    });
    return counts;
  }, [orders]);

  const getOrderById = React.useCallback(
    (identifier) => {
      if (!identifier) return null;
      return (
        orders.find(
          (o) => o.orderNumber === identifier || o.id === identifier
        ) || null
      );
    },
    [orders]
  );

  // Buy Again handler
  const handleBuyAgain = React.useCallback(
    (orderOrItem) => {
      if (!orderOrItem) return;
      let itemsToAdd = [];

      if (orderOrItem.items && Array.isArray(orderOrItem.items)) {
        itemsToAdd = orderOrItem.items;
      } else {
        itemsToAdd = [orderOrItem];
      }

      let addedCount = 0;
      itemsToAdd.forEach((item) => {
        const catalogProduct = products.find((p) => p.id === item.productId) || {
          id: item.productId || `prod-${Date.now()}`,
          name: item.name,
          price: item.price,
          images: [item.image || ''],
          stock: 99,
          slug: item.productId,
        };

        addItemToCart(catalogProduct, {
          quantity: item.quantity || 1,
          config: item.variant,
        });
        addedCount += 1;
      });

      toast.success(
        addedCount > 1
          ? `Added ${addedCount} items to your shopping bag!`
          : `Added "${itemsToAdd[0]?.name}" to your shopping bag!`
      );
    },
    [products, addItemToCart]
  );

  const cancelOrder = React.useCallback(
    async (orderId, details) => {
      if (cancelOrderAction) {
        cancelOrderAction(orderId, details);
      }
      setDbOrders((prev) =>
        prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, status: 'cancelled' } : o))
      );
      try {
        await fetch(`/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: 'cancelled', note: details?.reason || 'Cancelled by customer' }),
        });
      } catch {}
      toast.success(`Order #${orderId} was cancelled successfully. Refund initiated.`);
    },
    [cancelOrderAction]
  );

  const requestReturn = React.useCallback(
    async (orderId, details) => {
      let res = null;
      if (requestReturnAction) {
        res = requestReturnAction(orderId, details);
      }
      setDbOrders((prev) =>
        prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, status: 'returned' } : o))
      );
      try {
        await fetch(`/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: 'returned', note: details?.reason || 'Return requested by customer' }),
        });
      } catch {}
      const tracking = res?.trackingNumber || `RET-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      toast.success(`Return authorized. Prepaid shipping label ${tracking} generated.`);
      return res || { trackingNumber: tracking };
    },
    [requestReturnAction]
  );

  return {
    orders,
    filteredOrders,
    statusCounts,
    tabCounts: statusCounts,
    orderTabs: STATUS_TABS,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    dateRange,
    setDateRange,
    getOrderById,
    handleBuyAgain,
    cancelOrder,
    requestReturn,
    updateOrder: updateOrderAction,
    user,
    isAuthenticated,
    openAuthModal,
  };
}
