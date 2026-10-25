import React, { useState } from 'react';
import { AlertTriangle, Clock, ChevronRight, X, Headphones, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function OrderExceptionBanner({ order }) {
  const [dismissed, setDismissed] = useState(false);

  if (!order || dismissed) return null;

  // Determine if this order has an exception
  const hasExplicitException = Boolean(order.exception || order.deliveryException || order.isDelayed);
  
  // If order is shipped with a simulated delay or explicit flag
  const isEligible = hasExplicitException || order.status === 'delayed' || (order.status === 'shipped' && order.delayNotice);

  if (!isEligible) return null;

  const defaultTitle = 'Logistics Exception: Inclement Weather Transit Delay';
  const defaultMessage =
    order.delayNotice ||
    'Due to severe regional winter weather along the transportation corridor, package dispatch was temporarily rerouted. Your revised delivery estimate is protected by our On-Time Guarantee.';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-5 shadow-sm text-foreground">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-amber-700 dark:text-amber-300">
                {order.exceptionTitle || defaultTitle}
              </h4>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                Carrier Alert
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              {order.exceptionMessage || defaultMessage}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link to="/contact">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-amber-500/30 hover:bg-amber-500/10 text-amber-800 dark:text-amber-200"
                >
                  <Headphones className="h-3.5 w-3.5 mr-1" />
                  Priority Concierge Help
                </Button>
              </Link>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Updated 2 hours ago
              </span>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setDismissed(true)}
          className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
          title="Dismiss notice"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
