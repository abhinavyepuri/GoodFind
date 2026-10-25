import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Truck,
  RotateCcw,
  XCircle,
  FileText,
  Repeat,
  ChevronRight,
  MapPin,
  Calendar,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  ORDER_STATUS_CONFIG,
  STATUS_BADGE_VARIANTS,
  isOrderCancellable,
  isOrderReturnable,
} from '../types';

export function OrderCard({
  order,
  onOpenCancelModal,
  onOpenReturnModal,
  onOpenInvoiceModal,
  onBuyAgain,
}) {
  if (!order) return null;

  const statusConfig = ORDER_STATUS_CONFIG[order.status] || {
    label: order.status,
    description: '',
  };
  const badgeVariant = STATUS_BADGE_VARIANTS[order.status] || 'secondary';

  const cancellable = isOrderCancellable(order);
  const returnable = isOrderReturnable(order);

  const address = order.shippingAddress || {};
  const items = Array.isArray(order.items) ? order.items : [];
  const totalItemCount = items.reduce((sum, itm) => sum + (itm.quantity || 1), 0);

  // Address summary line
  const addressSummary = address.city && address.state
    ? `${address.fullName || 'Recipient'} • ${address.city}, ${address.state}`
    : address.fullName || 'Standard Shipping';

  return (
    <article className="group rounded-3xl border border-border/80 bg-card/70 backdrop-blur-sm shadow-soft hover:shadow-card hover:border-primary/30 transition-all duration-200 overflow-hidden">
      {/* 1. Order Card Header Bar */}
      <div className="bg-muted/30 border-b border-border/60 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 text-xs">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Order Placed
            </span>
            <span className="font-semibold text-foreground mt-0.5 block">
              {formatDate(order.createdAt)}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Amount
            </span>
            <span className="font-bold text-foreground mt-0.5 block">
              {formatPrice(order.total || 0)}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Ship To
            </span>
            <span className="font-medium text-foreground truncate max-w-[200px] mt-0.5 block" title={addressSummary}>
              {addressSummary}
            </span>
          </div>
        </div>

        {/* Order ID & Link */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
          <div className="text-left sm:text-right">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Order #
            </span>
            <span className="font-mono text-xs font-bold text-foreground">
              {order.orderNumber || order.id}
            </span>
          </div>

          <Link to={`/account/orders/${order.orderNumber || order.id}`}>
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1">
              <span>View Details</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Order Card Body & Items List */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Status Callout Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-muted/20 p-3 rounded-2xl border border-border/40">
          <div className="flex items-center gap-2.5">
            <Badge variant={badgeVariant} className="text-xs font-semibold capitalize shrink-0">
              {statusConfig.label}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              {order.status === 'delivered'
                ? 'Delivered to your selected destination'
                : order.status === 'shipped'
                ? `In transit • Tracking: ${order.trackingNumber || 'Active'}`
                : order.status === 'cancelled'
                ? 'Order has been cancelled & refunded'
                : order.status === 'returned'
                ? 'Return package inspected & credited'
                : 'Fulfillment center preparing dispatch'}
            </span>
          </div>

          {order.trackingNumber && order.trackingNumber !== 'PENDING' && (
            <span className="text-[11px] font-mono text-muted-foreground">
              Trk: {order.trackingNumber}
            </span>
          )}
        </div>

        {/* Item Rows with Thumbnails, Variant, Quantity, and Brand */}
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={item.id || item.productId || idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-4">
                <Link
                  to={item.productId ? `/product/${item.productId}` : '/catalog'}
                  className="shrink-0 group/img"
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'}
                    alt={item.name}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border bg-muted group-hover/img:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300';
                    }}
                  />
                </Link>

                <div className="space-y-1 min-w-0">
                  <Link
                    to={item.productId ? `/product/${item.productId}` : '/catalog'}
                    className="font-bold text-xs sm:text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span>Qty: <strong className="text-foreground">{item.quantity || 1}</strong></span>
                    {item.variant && (
                      <>
                        <span>•</span>
                        <span>Option: <strong className="text-foreground">{item.variant}</strong></span>
                      </>
                    )}
                    {item.brand && (
                      <>
                        <span>•</span>
                        <span className="text-muted-foreground">Brand: {item.brand}</span>
                      </>
                    )}
                  </p>
                  <span className="text-xs font-semibold text-foreground">
                    {formatPrice(item.price * (item.quantity || 1))}
                  </span>
                </div>
              </div>

              {/* Single item quick action (e.g. Buy this item again) */}
              <div className="sm:self-center shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onBuyAgain && onBuyAgain(item)}
                  className="h-8 text-xs text-primary hover:bg-primary/10"
                >
                  <Repeat className="h-3.5 w-3.5 mr-1.5" />
                  Buy Item Again
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Dynamic Quick Action Button Bar */}
      <div className="bg-muted/15 border-t border-border/60 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Track Package CTA */}
          {order.trackingNumber && order.trackingNumber !== 'PENDING' && (
            <Link to={`/account/orders/${order.orderNumber || order.id}`}>
              <Button size="sm" variant="brand" className="h-8 text-xs font-semibold gap-1.5 shadow-sm">
                <Truck className="h-3.5 w-3.5" />
                <span>Track Package</span>
              </Button>
            </Link>
          )}

          {/* Buy Order Again (all items) */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onBuyAgain && onBuyAgain(order)}
            className="h-8 text-xs font-semibold gap-1.5"
          >
            <Repeat className="h-3.5 w-3.5" />
            <span>Buy Again ({totalItemCount})</span>
          </Button>

          {/* Download Invoice */}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onOpenInvoiceModal && onOpenInvoiceModal(order)}
            className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Invoice</span>
          </Button>
        </div>

        {/* Self-service actions: Cancel / Return */}
        <div className="flex items-center gap-2">
          {cancellable && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onOpenCancelModal && onOpenCancelModal(order)}
              className="h-8 text-xs font-medium text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <XCircle className="h-3.5 w-3.5 mr-1" />
              Cancel Order
            </Button>
          )}

          {returnable && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onOpenReturnModal && onOpenReturnModal(order)}
              className="h-8 text-xs font-medium text-foreground hover:bg-muted"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1 text-primary" />
              Return or Replace
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
