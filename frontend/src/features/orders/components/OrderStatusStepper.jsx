import * as React from 'react';
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Home,
  AlertTriangle,
  RotateCcw,
  Ban,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ORDER_STATUS_CONFIG } from '../types';

const STANDARD_STEPS = [
  { key: 'placed', label: 'Order Placed', icon: Package },
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

export function OrderStatusStepper({ order }) {
  if (!order) return null;

  const currentStatus = (order.status || 'placed').toLowerCase();
  const isCancelled = currentStatus === 'cancelled';
  const isReturned = currentStatus === 'returned';

  // Determine current active index in standard flow
  let activeIndex = 0;
  if (currentStatus === 'processing') activeIndex = 1;
  else if (currentStatus === 'shipped') activeIndex = 2;
  else if (currentStatus === 'out_for_delivery') activeIndex = 3;
  else if (currentStatus === 'delivered') activeIndex = 4;

  const config = ORDER_STATUS_CONFIG[currentStatus] || ORDER_STATUS_CONFIG.placed;

  return (
    <div className="p-6 sm:p-8 rounded-3xl border bg-card shadow-soft space-y-6">
      {/* Header with Title and Current Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">Fulfillment & Delivery Stepper</h2>
            <Badge variant={config.badgeVariant} className="capitalize text-xs font-bold">
              {config.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
        </div>

        {order.trackingNumber && !isCancelled && (
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-lg border">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Tracking #{order.trackingNumber}</span>
          </div>
        )}
      </div>

      {/* Special State Callout: Cancelled */}
      {isCancelled ? (
        <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 flex items-start gap-3 text-rose-900 dark:text-rose-200">
          <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 shrink-0">
            <Ban className="h-5 w-5" />
          </div>
          <div className="space-y-1 text-xs">
            <span className="font-extrabold text-sm block">Order Cancelled & Refunded</span>
            <p className="text-rose-700 dark:text-rose-300">
              {order.cancellationDetails?.reason
                ? `Reason: ${order.cancellationDetails.reason}. `
                : 'This order was cancelled before carrier dispatch. '}
              Your refund of <strong>{order.cancellationDetails?.refundMethod || 'original payment'}</strong> has been initiated.
            </p>
          </div>
        </div>
      ) : isReturned ? (
        /* Special State Callout: Returned */
        <div className="p-4 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/80 dark:bg-purple-950/30 flex items-start gap-3 text-purple-900 dark:text-purple-200">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 shrink-0">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div className="space-y-1 text-xs">
            <span className="font-extrabold text-sm block">Return Authorized & In Progress</span>
            <p className="text-purple-700 dark:text-purple-300">
              Prepaid return tracking <strong>{order.returnDetails?.returnTrackingNumber || 'GF-RET'}</strong> is active.
              Resolution requested: {order.returnDetails?.resolution || 'Refund'}.
            </p>
          </div>
        </div>
      ) : (
        /* Standard 5-Step Horizontal Stepper */
        <div className="pt-2 pb-4">
          <div className="relative">
            {/* Connecting Track Line */}
            <div className="absolute top-5 left-6 right-6 h-0.5 bg-muted-foreground/20 -z-0" />
            <div
              className="absolute top-5 left-6 h-0.5 bg-primary transition-all duration-500 -z-0"
              style={{
                width: `${Math.min(100, Math.max(0, (activeIndex / (STANDARD_STEPS.length - 1)) * 100))}%`,
              }}
            />

            {/* Steps Container */}
            <div className="relative z-10 flex items-start justify-between">
              {STANDARD_STEPS.map((step, idx) => {
                const isCompleted = idx <= activeIndex;
                const isCurrent = idx === activeIndex;
                const StepIcon = step.icon;

                // Match timeline timestamp if available
                const timelineMatch = order.timeline?.find(
                  (t) => (t.status || '').toLowerCase() === step.key
                );

                return (
                  <div key={step.key} className="flex flex-col items-center text-center group max-w-[100px]">
                    {/* Circle Node */}
                    <div
                      className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                          : 'bg-background border-muted-foreground/30 text-muted-foreground'
                      } ${isCurrent ? 'ring-4 ring-primary/20 scale-105' : ''}`}
                    >
                      {isCompleted && !isCurrent ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>

                    {/* Step Label */}
                    <span
                      className={`text-xs mt-2.5 font-bold leading-tight ${
                        isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </span>

                    {/* Timestamp */}
                    <span className="text-[10px] text-muted-foreground font-mono mt-0.5 hidden sm:block">
                      {timelineMatch?.timestamp || (isCompleted ? 'Completed' : 'Upcoming')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Vertical Timeline Activity Log Accordion / List */}
      {order.timeline && order.timeline.length > 0 && (
        <div className="border-t pt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Official Milestone Tracking Journal
          </h3>
          <div className="relative pl-6 sm:pl-8 border-l-2 border-primary/20 space-y-6 ml-3">
            {order.timeline.map((event, idx) => (
              <div key={idx} className="relative group">
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    event.completed
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-background border-muted-foreground/30 text-muted-foreground'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-foreground">{event.title}</span>
                    <span className="text-[11px] text-muted-foreground font-mono">{event.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
