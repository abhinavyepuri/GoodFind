import React, { useState } from 'react';
import { Truck, Package, ExternalLink, Copy, Check, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { ORDER_STATUS_CONFIG, deriveShipments } from '../types';
export { deriveShipments };

export function OrderSplitShipments({ order, onTrackShipment }) {
  const [copiedId, setCopiedId] = useState(null);
  const shipments = deriveShipments(order);

  if (!shipments || shipments.length === 0) return null;

  const handleCopy = (trackingNum, id) => {
    if (!trackingNum || trackingNum === 'PENDING') return;
    navigator.clipboard.writeText(trackingNum);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold text-foreground">
            {shipments.length > 1 ? `Split Shipments (${shipments.length} Packages)` : 'Shipment & Package Tracking'}
          </h3>
        </div>
        {shipments.length > 1 && (
          <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
            Items ship from separate fulfillment hubs
          </span>
        )}
      </div>

      <div className="space-y-4">
        {shipments.map((shipment) => {
          const isDelivered = shipment.status === 'delivered';
          const isPending = !shipment.trackingNumber || shipment.trackingNumber === 'PENDING';

          return (
            <div
              key={shipment.id}
              className="rounded-2xl border bg-card/60 backdrop-blur-sm p-5 sm:p-6 shadow-soft transition-all hover:border-primary/30 space-y-4"
            >
              {/* Shipment Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-foreground">
                        Shipment {shipment.shipmentNumber} of {shipment.totalShipments}
                      </span>
                      <Badge
                        variant={isDelivered ? 'success' : 'brand'}
                        className="text-[11px] font-semibold capitalize"
                      >
                        {shipment.statusLabel || shipment.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Carrier: <strong className="text-foreground font-medium">{shipment.carrier}</strong>
                      {shipment.originHub && ` • From ${shipment.originHub}`}
                    </p>
                  </div>
                </div>

                {/* Tracking Code and Quick Copy */}
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Tracking ID
                    </span>
                    <span className="text-xs font-mono font-medium text-foreground">
                      {shipment.trackingNumber || 'Pending Assignment'}
                    </span>
                  </div>

                  {!isPending && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(shipment.trackingNumber, shipment.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="Copy Tracking ID"
                    >
                      {copiedId === shipment.id ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}

                  {shipment.trackingUrl && (
                    <a
                      href={shipment.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline pl-1"
                    >
                      <span>Track</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Delivery ETA pill */}
              <div className="flex items-center gap-2 text-xs text-foreground bg-muted/40 p-2.5 rounded-xl border border-border/40">
                {isDelivered ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                )}
                <span>
                  <strong>Status:</strong> {shipment.estimatedDelivery}
                </span>
              </div>

              {/* Items in this specific shipment */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Items in this package ({shipment.items?.length || 0})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {shipment.items?.map((item, idx) => (
                    <div
                      key={item.id || item.productId || idx}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-background/80 border border-border/40"
                    >
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'}
                        alt={item.name}
                        className="h-12 w-12 rounded-lg object-cover border bg-muted shrink-0"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-foreground truncate">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Qty: {item.quantity || 1} {item.variant ? `• ${item.variant}` : ''}
                        </p>
                        <span className="text-xs font-semibold text-foreground">
                          {formatPrice(item.price * (item.quantity || 1))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
