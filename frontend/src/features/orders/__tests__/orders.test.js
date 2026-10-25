import { describe, it, expect } from 'vitest';
import {
  ORDER_STATUS_CONFIG,
  STATUS_BADGE_VARIANTS,
  isOrderCancellable,
  isOrderReturnable,
} from '../types';
import { deriveShipments } from '../components/OrderSplitShipments';

describe('Orders Feature - Types & Logic', () => {
  it('should have valid configurations for all core order statuses', () => {
    const statuses = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];
    statuses.forEach((status) => {
      expect(ORDER_STATUS_CONFIG[status]).toBeDefined();
      expect(ORDER_STATUS_CONFIG[status].label).toBeTruthy();
      expect(STATUS_BADGE_VARIANTS[status]).toBeDefined();
    });
  });

  describe('isOrderCancellable', () => {
    it('returns true for placed and processing orders', () => {
      expect(isOrderCancellable({ status: 'placed' })).toBe(true);
      expect(isOrderCancellable({ status: 'processing' })).toBe(true);
    });

    it('returns false for shipped, delivered, cancelled, and returned orders', () => {
      expect(isOrderCancellable({ status: 'shipped' })).toBe(false);
      expect(isOrderCancellable({ status: 'delivered' })).toBe(false);
      expect(isOrderCancellable({ status: 'cancelled' })).toBe(false);
      expect(isOrderCancellable({ status: 'returned' })).toBe(false);
    });

    it('handles null or undefined order gracefully', () => {
      expect(isOrderCancellable(null)).toBe(false);
      expect(isOrderCancellable(undefined)).toBe(false);
    });
  });

  describe('isOrderReturnable', () => {
    it('returns true for delivered order within 30 days', () => {
      const recentOrder = {
        status: 'delivered',
        deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      };
      expect(isOrderReturnable(recentOrder, 30)).toBe(true);
    });

    it('returns false for delivered order older than 30 days', () => {
      const oldOrder = {
        status: 'delivered',
        deliveredAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      };
      expect(isOrderReturnable(oldOrder, 30)).toBe(false);
    });

    it('returns false for non-delivered orders', () => {
      expect(isOrderReturnable({ status: 'placed' })).toBe(false);
      expect(isOrderReturnable({ status: 'processing' })).toBe(false);
      expect(isOrderReturnable({ status: 'shipped' })).toBe(false);
      expect(isOrderReturnable({ status: 'cancelled' })).toBe(false);
      expect(isOrderReturnable({ status: 'returned' })).toBe(false);
    });

    it('handles null or undefined order gracefully', () => {
      expect(isOrderReturnable(null)).toBe(false);
      expect(isOrderReturnable(undefined)).toBe(false);
    });
  });

  describe('deriveShipments', () => {
    it('returns empty array when order has no items or is null', () => {
      expect(deriveShipments(null)).toEqual([]);
      expect(deriveShipments({ items: [] })).toEqual([]);
    });

    it('returns explicit shipments if present on order', () => {
      const customShipments = [{ id: 'custom-1', trackingNumber: 'TRK-123' }];
      const order = { shipments: customShipments, items: [{ name: 'Item 1' }] };
      expect(deriveShipments(order)).toBe(customShipments);
    });

    it('synthesizes split shipments for multi-item shipped orders', () => {
      const multiItemOrder = {
        id: 'ord-test',
        status: 'shipped',
        trackingNumber: 'TRK-999',
        items: [
          { productId: 'p1', name: 'Product A', price: 100, quantity: 1 },
          { productId: 'p2', name: 'Product B', price: 50, quantity: 2 },
        ],
      };
      const shipments = deriveShipments(multiItemOrder);
      expect(shipments.length).toBe(2);
      expect(shipments[0].shipmentNumber).toBe(1);
      expect(shipments[0].totalShipments).toBe(2);
      expect(shipments[0].items.length).toBe(1);
      expect(shipments[1].shipmentNumber).toBe(2);
      expect(shipments[1].items.length).toBe(1);
    });

    it('returns single shipment for single-item order', () => {
      const singleItemOrder = {
        id: 'ord-single',
        status: 'shipped',
        trackingNumber: 'TRK-SINGLE',
        items: [{ productId: 'p1', name: 'Product A', price: 100, quantity: 1 }],
      };
      const shipments = deriveShipments(singleItemOrder);
      expect(shipments.length).toBe(1);
      expect(shipments[0].shipmentNumber).toBe(1);
      expect(shipments[0].totalShipments).toBe(1);
      expect(shipments[0].trackingNumber).toBe('TRK-SINGLE');
    });
  });
});
