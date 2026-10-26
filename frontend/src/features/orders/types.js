/**
 * Order System Types, Constants, and Eligibility Helpers
 * Isolated within @/features/orders
 */

export const ORDER_STATUSES = {
  PLACED: 'placed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
};

export const ORDER_STATUS_CONFIG = {
  placed: {
    label: 'Order Placed',
    description: 'Payment authorized and receipt dispatched.',
    badgeVariant: 'secondary',
    color: 'text-zinc-600 dark:text-zinc-300',
    bg: 'bg-zinc-100 dark:bg-zinc-800',
  },
  processing: {
    label: 'Processing',
    description: 'Items being picked, quality inspected, and packaged.',
    badgeVariant: 'warning',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
  },
  shipped: {
    label: 'Shipped',
    description: 'Carrier has picked up package and it is in transit.',
    badgeVariant: 'brand',
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    description: 'Carrier courier is out on route for final delivery today.',
    badgeVariant: 'brand',
    color: 'text-indigo-700 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
  },
  delivered: {
    label: 'Delivered',
    description: 'Package handed directly or safely deposited at destination.',
    badgeVariant: 'success',
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Order cancelled and funds refunded or credited.',
    badgeVariant: 'destructive',
    color: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
  },
  returned: {
    label: 'Return Requested',
    description: 'Return label issued. Awaiting item drop-off.',
    badgeVariant: 'outline',
    color: 'text-purple-700 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
  },
};

export const STATUS_BADGE_VARIANTS = {
  placed: 'secondary',
  processing: 'warning',
  shipped: 'brand',
  out_for_delivery: 'brand',
  delivered: 'success',
  cancelled: 'destructive',
  returned: 'outline',
};

export const CANCELLATION_REASONS = [
  { id: 'mistake', label: 'Order placed by mistake / change of mind' },
  { id: 'better_price', label: 'Found a more favorable price elsewhere' },
  { id: 'address_change', label: 'Need to modify destination shipping address' },
  { id: 'delivery_delay', label: 'Estimated delivery timeline is too long' },
  { id: 'item_switch', label: 'Want to switch items or configuration' },
  { id: 'other', label: 'Other reason' },
];

export const REFUND_METHODS = [
  {
    id: 'original',
    title: 'Original Payment Method',
    description: 'Refund released back to your card / payment provider within 3–5 business days.',
    badge: 'Standard',
  },
  {
    id: 'store_credit',
    title: 'Instant GoodFind Store Credit',
    description: 'Available immediately in your account wallet + 5% courtesy bonus credit.',
    badge: '+5% Bonus (Fastest)',
  },
];

export const RETURN_REASONS = [
  { id: 'defective', label: 'Defective or damaged during transit' },
  { id: 'differs', label: 'Item differs from website description / photos' },
  { id: 'wrong_size', label: 'Incorrect size, dimensions, or ergonomic fit' },
  { id: 'quality', label: 'Aesthetic or material quality not as expected' },
  { id: 'late', label: 'Package arrived significantly past estimated date' },
  { id: 'unwanted', label: 'Item no longer required' },
];

export const RETURN_RESOLUTIONS = [
  {
    id: 'refund_original',
    title: 'Refund to Original Payment',
    description: 'Credited within 3–5 days after carrier scan at return depot.',
  },
  {
    id: 'replacement',
    title: 'Exchange for Free Replacement',
    description: 'Identical new item expedited as soon as return label is scanned.',
  },
  {
    id: 'store_credit',
    title: 'Instant Store Credit (+5% bonus)',
    description: 'Credit balance deposited immediately with additional 5% credit.',
  },
];

export const DATE_RANGE_OPTIONS = [
  { id: 'all', label: 'All Orders' },
  { id: '30_days', label: 'Past 30 Days' },
  { id: '3_months', label: 'Past 3 Months' },
  { id: '6_months', label: 'Past 6 Months' },
  { id: '2026', label: 'Year 2026' },
  { id: '2025', label: 'Year 2025' },
];

export const DATE_RANGE_FILTERS = DATE_RANGE_OPTIONS;

export const STATUS_TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'In Transit' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'returned', label: 'Returns' },
];

/**
 * Checks if an order can be cancelled.
 * Eligible only during 'placed' or 'processing'.
 */
export function isOrderCancellable(order) {
  if (!order || !order.status) return false;
  const s = String(order.status).toLowerCase();
  return s === 'placed' || s === 'processing';
}

/**
 * Checks if an order is eligible for return.
 * Active for delivered orders within 30 days of creation/delivery.
 */
export function isOrderReturnable(order, windowDays = 30) {
  if (!order || !order.status) return false;
  const s = String(order.status).toLowerCase();
  if (s !== 'delivered') return false;

  const rawDate = order.deliveredAt || order.createdAt;
  if (!rawDate) return false;
  const orderDate = new Date(rawDate);
  const windowMs = (Number(windowDays) || 30) * 24 * 60 * 60 * 1000;
  return Date.now() - orderDate.getTime() <= windowMs;
}

/**
 * Derives split shipment groups from an order if not explicitly structured.
 */
export function deriveShipments(order) {
  if (!order) return [];

  // If explicit shipments array exists on the order, return it
  if (Array.isArray(order.shipments) && order.shipments.length > 0) {
    return order.shipments;
  }

  const items = Array.isArray(order.items) ? order.items : [];
  if (items.length === 0) return [];

  // If order has multiple items and status is shipped or delivered, synthesize split shipments
  if (items.length > 1 && (order.status === 'shipped' || order.status === 'delivered')) {
    const firstItem = items[0];
    const otherItems = items.slice(1);

    return [
      {
        id: `shp-${order.id || '01'}-1`,
        shipmentNumber: 1,
        totalShipments: 2,
        carrier: 'FedEx Priority Overnight',
        carrierCode: 'FEDEX',
        trackingNumber: order.trackingNumber || '789456123012',
        trackingUrl: `https://www.fedex.com/fedextrack/?trknbr=${order.trackingNumber || '789456123012'}`,
        status: order.status === 'delivered' ? 'delivered' : 'out_for_delivery',
        statusLabel: order.status === 'delivered' ? 'Delivered' : 'Out for Delivery Today',
        estimatedDelivery: 'Arriving Today by 4:30 PM',
        originHub: 'Fulfillment Center West (Ontario, CA)',
        items: [firstItem],
      },
      {
        id: `shp-${order.id || '01'}-2`,
        shipmentNumber: 2,
        totalShipments: 2,
        carrier: 'UPS Ground Commercial',
        carrierCode: 'UPS',
        trackingNumber: '1Z999AA10123456784',
        trackingUrl: 'https://www.ups.com/track?tracknum=1Z999AA10123456784',
        status: order.status === 'delivered' ? 'delivered' : 'shipped',
        statusLabel: order.status === 'delivered' ? 'Delivered' : 'In Transit (On Schedule)',
        estimatedDelivery: 'Arriving Tomorrow by 7:00 PM',
        originHub: 'Fulfillment Center East (Allentown, PA)',
        items: otherItems,
      },
    ];
  }

  // Single consolidated shipment
  return [
    {
      id: `shp-${order.id || '01'}-1`,
      shipmentNumber: 1,
      totalShipments: 1,
      carrier: order.carrier || 'FedEx Priority',
      carrierCode: 'FEDEX',
      trackingNumber: order.trackingNumber || 'PENDING',
      trackingUrl: order.trackingNumber && order.trackingNumber !== 'PENDING'
        ? `https://www.fedex.com/fedextrack/?trknbr=${order.trackingNumber}`
        : null,
      status: order.status,
      statusLabel: ORDER_STATUS_CONFIG[order.status]?.label || order.status,
      estimatedDelivery: order.status === 'delivered' ? 'Delivered Successfully' : 'Estimated within 2-4 business days',
      originHub: 'GoodFind Central Distribution (Brooklyn, NY)',
      items: items,
    },
  ];
}

