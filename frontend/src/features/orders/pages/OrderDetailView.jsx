import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  ArrowLeft,
  FileText,
  RotateCcw,
  XCircle,
  Repeat,
  Headphones,
  ShoppingBag,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { useOrders } from '../hooks/useOrders';
import { OrderStatusStepper } from '../components/OrderStatusStepper';
import { OrderSplitShipments } from '../components/OrderSplitShipments';
import { OrderSummaryPanels } from '../components/OrderSummaryPanels';
import { OrderExceptionBanner } from '../components/OrderExceptionBanner';
import { CancelOrderModal } from '../components/CancelOrderModal';
import { ReturnOrderModal } from '../components/ReturnOrderModal';
import { InvoiceModal } from '../components/InvoiceModal';
import {
  ORDER_STATUS_CONFIG,
  STATUS_BADGE_VARIANTS,
  isOrderCancellable,
  isOrderReturnable,
} from '../types';

export function OrderDetailView() {
  const { orderId } = useParams();
  const { getOrderById, handleBuyAgain, cancelOrder, requestReturn } = useOrders();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="h-16 w-16 mx-auto rounded-3xl bg-muted/60 border border-border/60 flex items-center justify-center text-muted-foreground">
          <Package className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Order Not Found</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          We could not locate an order matching ID &ldquo;{orderId}&rdquo;. It may have been placed under a different account or removed.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/account/orders">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Orders</span>
            </Button>
          </Link>
          <Link to="/catalog">
            <Button variant="brand" size="sm" className="text-xs">
              Browse Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = ORDER_STATUS_CONFIG[order.status] || {
    label: order.status,
    description: '',
  };
  const badgeVariant = STATUS_BADGE_VARIANTS[order.status] || 'secondary';

  const cancellable = isOrderCancellable(order);
  const returnable = isOrderReturnable(order);
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* 1. Breadcrumbs */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/account/orders" className="hover:text-foreground transition-colors">Orders</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-semibold">Order #{order.orderNumber || order.id}</span>
        </nav>

        {/* 2. Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Order #{order.orderNumber || order.id}
              </h1>
              <Badge variant={badgeVariant} className="text-xs font-semibold capitalize">
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Placed on {formatDate(order.createdAt)} • Payment via {order.paymentMethod || 'Credit Card'}
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsInvoiceModalOpen(true)}
              className="text-xs font-semibold gap-1.5"
            >
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Invoice</span>
            </Button>

            <Button
              type="button"
              variant="brand"
              size="sm"
              onClick={() => handleBuyAgain(order)}
              className="text-xs font-semibold gap-1.5 shadow-sm"
            >
              <Repeat className="h-3.5 w-3.5" />
              <span>Buy Order Again</span>
            </Button>

            {cancellable && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCancelModalOpen(true)}
                className="text-xs font-medium text-destructive hover:bg-destructive/10 border-destructive/30"
              >
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Cancel Order
              </Button>
            )}

            {returnable && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsReturnModalOpen(true)}
                className="text-xs font-medium text-foreground hover:bg-muted"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1 text-primary" />
                Return or Replace
              </Button>
            )}
          </div>
        </div>

        {/* 3. Delivery Exception Alert Banner (if delayed or exception present) */}
        <OrderExceptionBanner order={order} />

        {/* 4. Visual Status Stepper */}
        <OrderStatusStepper order={order} />

        {/* 5. Split Shipments Tracking (Packages) */}
        <OrderSplitShipments order={order} />

        {/* 6. Destination & Price Breakdown Panels */}
        <OrderSummaryPanels order={order} />

        {/* 7. Detailed Package Contents / Purchased Items Table */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-soft space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">
                All Items in this Order ({items.length})
              </h3>
              <p className="text-xs text-muted-foreground">
                Inspect items, verify specifications, or reorder individual goods
              </p>
            </div>
            <Link to="/catalog">
              <Button variant="ghost" size="sm" className="text-xs text-primary">
                Explore similar items
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-border/50">
            {items.map((item, idx) => (
              <div
                key={item.id || item.productId || idx}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <Link to={item.productId ? `/product/${item.productId}` : '/catalog'}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'}
                      alt={item.name}
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border bg-muted shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300';
                      }}
                    />
                  </Link>

                  <div className="space-y-1">
                    <Link
                      to={item.productId ? `/product/${item.productId}` : '/catalog'}
                      className="text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[11px] text-muted-foreground">
                      Quantity: <strong className="text-foreground">{item.quantity || 1}</strong>
                      {item.variant ? ` • Option: ${item.variant}` : ''}
                      {item.brand ? ` • Brand: ${item.brand}` : ''}
                    </p>
                    <p className="text-xs font-semibold text-foreground">
                      Unit: {formatPrice(item.price)} • Total: {formatPrice(item.price * (item.quantity || 1))}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleBuyAgain(item)}
                    className="h-8 text-xs font-medium gap-1.5"
                  >
                    <Repeat className="h-3.5 w-3.5 text-primary" />
                    <span>Buy Again</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Help & Customer Support Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/40">
          <Link to="/account/orders" className="hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to all orders</span>
          </Link>

          <Link to="/contact" className="hover:text-primary inline-flex items-center gap-1">
            <Headphones className="h-3.5 w-3.5" />
            <span>Need assistance with this shipment?</span>
          </Link>
        </div>

        {/* Self-service modals */}
        <CancelOrderModal
          order={order}
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirmCancel={cancelOrder}
        />

        <ReturnOrderModal
          order={order}
          isOpen={isReturnModalOpen}
          onClose={() => setIsReturnModalOpen(false)}
          onConfirmReturn={requestReturn}
        />

        <InvoiceModal
          order={order}
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
        />
      </div>
    </div>
  );
}
export default OrderDetailView;
