import * as React from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, ArrowRight, Ban, Wallet, CreditCard } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { CANCELLATION_REASONS, REFUND_METHODS, isOrderCancellable } from '../types';

export function CancelOrderModal({ order, isOpen, onClose, onConfirmCancel }) {
  const [selectedReason, setSelectedReason] = React.useState(CANCELLATION_REASONS[0].id);
  const [refundMethod, setRefundMethod] = React.useState('original');
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedReason(CANCELLATION_REASONS[0].id);
      setRefundMethod('original');
      setIsConfirmed(false);
      setIsSubmitting(false);
    }
  }, [isOpen, order]);

  if (!order) return null;

  const eligible = isOrderCancellable(order);
  const refundAmount = order.total || 0;
  const storeCreditAmount = refundAmount * 1.05; // 5% bonus

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reasonObj = CANCELLATION_REASONS.find((r) => r.id === selectedReason);
    const methodObj = REFUND_METHODS.find((m) => m.id === refundMethod);

    setTimeout(() => {
      onConfirmCancel(order.id || order.orderNumber, {
        reason: reasonObj?.label || selectedReason,
        refundMethod: methodObj?.title || refundMethod,
      });
      setIsConfirmed(true);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogClose onClose={onClose} />

      {!eligible ? (
        <div className="space-y-4 text-center py-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle>Order Ineligible for Cancellation</DialogTitle>
          <DialogDescription>
            Order #{order.orderNumber} is currently in <strong>{order.status}</strong> status and has already entered fulfillment dispatch.
          </DialogDescription>
          <div className="p-4 rounded-xl border bg-muted/40 text-xs text-muted-foreground text-left space-y-2">
            <p>
              • <strong>In Transit or Shipped Orders:</strong> Packages currently with the carrier cannot be recalled mid-flight.
            </p>
            <p>
              • <strong>Easy Returns Guarantee:</strong> Once your shipment arrives, you can initiate a hassle-free, prepaid return directly from your orders page.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="brand" className="w-full" onClick={onClose}>
              Understood
            </Button>
          </div>
        </div>
      ) : isConfirmed ? (
        <div className="space-y-5 text-center py-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-sm">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold">Cancellation Confirmed</DialogTitle>
            <DialogDescription className="mt-1">
              Order #{order.orderNumber} has been successfully cancelled.
            </DialogDescription>
          </div>

          <div className="p-4 rounded-xl border bg-muted/40 text-left space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground font-medium">Refund Amount:</span>
              <span className="font-bold text-foreground text-sm">
                {formatPrice(refundMethod === 'store_credit' ? storeCreditAmount : refundAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Destination:</span>
              <span className="font-semibold text-foreground">
                {refundMethod === 'store_credit' ? 'GoodFind Store Credit (+5% added)' : 'Original Payment Method'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Estimated Arrival:</span>
              <span className="text-foreground">
                {refundMethod === 'store_credit' ? 'Immediate Deposit' : '3–5 Business Days'}
              </span>
            </div>
          </div>

          <Button variant="brand" className="w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Ban className="h-4 w-4" />
              </div>
              <DialogTitle>Cancel Order #{order.orderNumber}</DialogTitle>
            </div>
            <DialogDescription>
              We are sorry to see you cancel. Please let us know why you are cancelling so we can improve.
            </DialogDescription>
          </DialogHeader>

          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Reason for Cancellation
            </label>
            <Select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="text-xs font-medium"
            >
              {CANCELLATION_REASONS.map((reason) => (
                <option key={reason.id} value={reason.id}>
                  {reason.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Refund Method Target Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Refund Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REFUND_METHODS.map((method) => {
                const isSelected = refundMethod === method.id;
                const isBonus = method.id === 'store_credit';
                return (
                  <div
                    key={method.id}
                    onClick={() => setRefundMethod(method.id)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border/80 hover:border-primary/40 bg-card'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                          {isBonus ? <Wallet className="h-3.5 w-3.5 text-primary" /> : <CreditCard className="h-3.5 w-3.5" />}
                          <span>{method.title}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {method.description}
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-foreground">
                        {formatPrice(isBonus ? storeCreditAmount : refundAmount)}
                      </span>
                      {isBonus && (
                        <Badge variant="brand" className="text-[9px] py-0 px-1.5 font-semibold">
                          +5% Extra
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safety Notice */}
          <div className="p-3 bg-muted/50 rounded-xl text-[11px] text-muted-foreground flex items-start gap-2 border">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              Once confirmed, cancellation is permanent. Any discounts or promotional voucher redemptions will be restored to your account.
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1 text-xs" onClick={onClose}>
              Nevermind, Keep Order
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1 text-xs gap-1.5 bg-rose-600 hover:bg-rose-700 text-white"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
