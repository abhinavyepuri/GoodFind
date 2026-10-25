import React, { useState } from 'react';
import { MapPin, CreditCard, ShieldCheck, Truck, ExternalLink, Copy, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

export function OrderSummaryPanels({ order }) {
  const [copiedTracking, setCopiedTracking] = useState(false);

  if (!order) return null;

  const address = order.shippingAddress || {};
  const trackingNumber = order.trackingNumber;
  const isTrackingAvailable = trackingNumber && trackingNumber !== 'PENDING';

  const handleCopyTracking = () => {
    if (!isTrackingAvailable) return;
    navigator.clipboard.writeText(trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const getCarrierUrl = (trk) => {
    if (!trk || trk === 'PENDING') return null;
    if (trk.startsWith('1Z')) return `https://www.ups.com/track?tracknum=${trk}`;
    return `https://www.fedex.com/fedextrack/?trknbr=${trk}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Delivery Details Panel */}
      <div className="p-6 rounded-3xl border bg-card/60 backdrop-blur-sm shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Delivery Information</h3>
              <p className="text-[11px] text-muted-foreground">Recipient & logistics routing</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[11px] font-medium">
            Verified Address
          </Badge>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
              Shipping Destination
            </span>
            <p className="font-bold text-foreground text-sm mt-0.5">
              {address.fullName || order.customer?.name || 'Valued Customer'}
            </p>
            <p className="text-muted-foreground mt-0.5 leading-relaxed">
              {address.street} {address.apartment ? `, ${address.apartment}` : ''}
              <br />
              {address.city ? `${address.city}, ` : ''}
              {address.state || ''} {address.postalCode || ''}
              <br />
              {address.country || 'United States'}
            </p>
            {address.phone && (
              <p className="text-muted-foreground pt-1 text-[11px]">
                Phone: <span className="font-medium text-foreground">{address.phone}</span>
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-border/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-primary" />
                Shipping Speed
              </span>
              <span className="font-semibold text-foreground">
                {order.shippingSpeed || 'Express Courier (2-3 Business Days)'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Carrier / Tracking</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-medium text-foreground">
                  {trackingNumber || 'Pending dispatch'}
                </span>
                {isTrackingAvailable && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={handleCopyTracking}
                    title="Copy tracking number"
                  >
                    {copiedTracking ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            {isTrackingAvailable && getCarrierUrl(trackingNumber) && (
              <div className="pt-1 text-right">
                <a
                  href={getCarrierUrl(trackingNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Track package with carrier</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Price & Payment Breakdown Panel */}
      <div className="p-6 rounded-3xl border bg-card/60 backdrop-blur-sm shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Payment Summary</h3>
              <p className="text-[11px] text-muted-foreground">Charges, taxes, and settlement</p>
            </div>
          </div>
          <Badge
            variant={order.paymentStatus === 'paid' ? 'success' : 'secondary'}
            className="text-[11px] font-semibold capitalize"
          >
            {order.paymentStatus || 'Paid'}
          </Badge>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-medium text-foreground">{formatPrice(order.subtotal || 0)}</span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="flex items-center gap-1">
                Discount {order.couponCode ? `(${order.couponCode})` : ''}
              </span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-muted-foreground">
            <span>Estimated Shipping</span>
            <span className="font-medium text-foreground">
              {order.shipping === 0 ? 'Complimentary' : formatPrice(order.shipping || 0)}
            </span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Sales & Duties Tax</span>
            <span className="font-medium text-foreground">{formatPrice(order.tax || 0)}</span>
          </div>

          <div className="border-t border-border/60 pt-3 flex justify-between items-baseline">
            <div>
              <span className="text-sm font-bold text-foreground">Grand Total</span>
              <span className="block text-[11px] text-muted-foreground">USD including all fees</span>
            </div>
            <span className="text-lg font-extrabold text-foreground tracking-tight">
              {formatPrice(order.total || 0)}
            </span>
          </div>

          <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Payment Method</span>
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>{order.paymentMethod || 'Credit Card •••• 4242'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
