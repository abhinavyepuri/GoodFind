import assert from 'node:assert';
import {
  ORDER_STATUS_CONFIG,
  STATUS_BADGE_VARIANTS,
  isOrderCancellable,
  isOrderReturnable,
  DATE_RANGE_FILTERS,
  deriveShipments,
} from '../types.js';

console.log('Running Orders System Verification Self-Check...');

// 1. Verify Status configurations
const requiredStatuses = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];
for (const status of requiredStatuses) {
  assert.ok(ORDER_STATUS_CONFIG[status], `Missing ORDER_STATUS_CONFIG for ${status}`);
  assert.ok(ORDER_STATUS_CONFIG[status].label, `Missing label for ${status}`);
  assert.ok(STATUS_BADGE_VARIANTS[status], `Missing STATUS_BADGE_VARIANTS for ${status}`);
}
console.log('✔ All 7 Order statuses validated with badges & descriptions.');

// 2. Cancellation eligibility rules
assert.strictEqual(isOrderCancellable({ status: 'placed' }), true, 'placed should be cancellable');
assert.strictEqual(isOrderCancellable({ status: 'processing' }), true, 'processing should be cancellable');
assert.strictEqual(isOrderCancellable({ status: 'shipped' }), false, 'shipped should NOT be cancellable');
assert.strictEqual(isOrderCancellable({ status: 'delivered' }), false, 'delivered should NOT be cancellable');
assert.strictEqual(isOrderCancellable({ status: 'cancelled' }), false, 'already cancelled should NOT be cancellable');
assert.strictEqual(isOrderCancellable(null), false, 'null order should return false');
console.log('✔ Cancellation eligibility rules passed.');

// 3. Return eligibility rules (30-day policy window for delivered items)
const recentDelivered = {
  status: 'delivered',
  createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
};
const expiredDelivered = {
  status: 'delivered',
  createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
};
assert.strictEqual(isOrderReturnable(recentDelivered), true, 'recent delivered order should be returnable');
assert.strictEqual(isOrderReturnable(expiredDelivered), false, 'delivered order past 30 days should NOT be returnable');
assert.strictEqual(isOrderReturnable({ status: 'processing' }), false, 'processing order should NOT be returnable');
assert.strictEqual(isOrderReturnable({ status: 'shipped' }), false, 'shipped order should NOT be returnable');
assert.strictEqual(isOrderReturnable(null), false, 'null order should return false');
console.log('✔ Return & replacement 30-day window eligibility rules passed.');

// 4. Split shipment derivations
const multiItemOrder = {
  id: 'ord-multi-test',
  status: 'shipped',
  trackingNumber: 'TRK-987654',
  items: [
    { productId: 'p1', name: 'Premium Headphones', price: 299, quantity: 1 },
    { productId: 'p2', name: 'Coffee Beans', price: 25, quantity: 2 },
  ],
};
const splitShipments = deriveShipments(multiItemOrder);
assert.strictEqual(splitShipments.length, 2, 'multi-item order should produce 2 split shipments');
assert.strictEqual(splitShipments[0].shipmentNumber, 1);
assert.strictEqual(splitShipments[0].totalShipments, 2);
assert.strictEqual(splitShipments[0].carrierCode, 'FEDEX');
assert.strictEqual(splitShipments[1].shipmentNumber, 2);
assert.strictEqual(splitShipments[1].carrierCode, 'UPS');
console.log('✔ Split shipment multi-package derivation passed.');

// 5. Date filter options
assert.ok(DATE_RANGE_FILTERS.length >= 5, 'DATE_RANGE_FILTERS should have all standard presets');
console.log('✔ Date range filter options verified.');

console.log('\n========================================');
console.log('ALL ORDERS SYSTEM LOGIC CHECKS PASSED ✔');
console.log('========================================');
