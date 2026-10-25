import * as React from 'react';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

/**
 * Custom Hook for Order History management, filtering, and self-service actions
 */
export function useOrders() {
  const orders = useProductStore((state) => state.orders) || [];
  const products = useProductStore((state) => state.products) || [];
  const cancelOrderAction = useProductStore((state) => state.cancelOrder);
  const requestReturnAction = useProductStore((state) => state.requestReturn);
  const updateOrderAction = useProductStore((state) => state.updateOrder);
  const addItemToCart = useCartStore((state) => state.addItem);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('all');
  const [dateRange, setDateRange] = React.useState('all');

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
    (orderId, details) => {
      if (cancelOrderAction) {
        cancelOrderAction(orderId, details);
        toast.success(`Order #${orderId} was cancelled successfully. Refund initiated.`);
      }
    },
    [cancelOrderAction]
  );

  const requestReturn = React.useCallback(
    (orderId, details) => {
      if (requestReturnAction) {
        const res = requestReturnAction(orderId, details);
        toast.success(`Return authorized. Prepaid shipping label ${res.trackingNumber} generated.`);
        return res;
      }
      return null;
    },
    [requestReturnAction]
  );

  return {
    orders,
    filteredOrders,
    statusCounts,
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
  };
}
