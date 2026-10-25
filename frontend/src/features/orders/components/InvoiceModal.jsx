import * as React from 'react';
import { Printer, Download, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';

export function InvoiceModal({ order, isOpen, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${order.orderNumber || '0000'}`;
  const invoiceDate = formatDate(order.createdAt || Date.now());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogClose onClose={onClose} />

      <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-1 text-foreground print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tighter text-foreground font-sans">
                GOODFIND<span>.</span>
              </span>
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest">
                Official Tax Receipt
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              GoodFind Luxury Commerce Inc. • GSTIN / EIN Registered
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="text-base font-extrabold text-foreground font-mono">{invoiceNumber}</span>
            <p className="text-xs text-muted-foreground">Issued: {invoiceDate}</p>
          </div>
        </div>

        {/* Billed To / Shipped To Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-muted/30 border text-xs">
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
              Customer & Billed To
            </span>
            <p className="font-bold text-foreground text-sm">
              {order.customer?.name || order.shippingAddress?.fullName || 'Valued Customer'}
            </p>
            <p className="text-muted-foreground">{order.customer?.email || 'customer@goodfind.io'}</p>
            <p className="text-muted-foreground">{order.customer?.phone || order.shippingAddress?.phone}</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
              Destination Address
            </span>
            <p className="font-bold text-foreground">
              {order.shippingAddress?.fullName || order.customer?.name}
            </p>
            <p className="text-muted-foreground">
              {order.shippingAddress?.street}
              {order.shippingAddress?.apartment ? `, ${order.shippingAddress.apartment}` : ''}
            </p>
            <p className="text-muted-foreground">
              {order.shippingAddress?.city}, {order.shippingAddress?.state || ''} {order.shippingAddress?.postalCode || ''}
            </p>
            <p className="text-muted-foreground">{order.shippingAddress?.country || 'United States'}</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border rounded-2xl overflow-hidden bg-card">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b bg-muted/40 font-bold text-muted-foreground">
                <th className="p-3">Item Description</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {order.items?.map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/10 transition-colors">
                  <td className="p-3">
                    <span className="font-bold text-foreground block">{item.name}</span>
                    {item.variant && (
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Variant: {item.variant}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center font-semibold text-foreground">{item.quantity || 1}</td>
                  <td className="p-3 text-right font-mono text-muted-foreground">
                    {formatPrice(item.price)}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-foreground">
                    {formatPrice((item.price || 0) * (item.quantity || 1))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 p-4 rounded-2xl bg-muted/30 border">
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
              Payment & Settlement
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-[10px] font-bold">
                PAID IN FULL
              </Badge>
              <span className="font-medium text-foreground text-xs">
                {order.paymentMethod || 'Authorized Payment'}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              Tracking: {order.trackingNumber || 'Standard Delivery'}
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-1.5 text-xs text-right">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal:</span>
              <span className="font-mono">{formatPrice(order.subtotal || 0)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Discount ({order.couponCode || 'Promo'}):</span>
                <span className="font-mono">-{formatPrice(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground">
              <span>Insured Delivery:</span>
              <span className="font-mono">{order.shipping === 0 ? 'Free' : formatPrice(order.shipping || 0)}</span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Estimated Tax:</span>
              <span className="font-mono">{formatPrice(order.tax || 0)}</span>
            </div>

            <div className="flex justify-between pt-2 border-t font-extrabold text-sm text-foreground">
              <span>Total Paid:</span>
              <span className="font-mono text-base">{formatPrice(order.total || 0)}</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-2 pt-2 border-t print:hidden">
          <Button variant="outline" className="flex-1 text-xs gap-1.5" onClick={onClose}>
            Close
          </Button>
          <Button variant="brand" className="flex-1 text-xs gap-1.5" onClick={handlePrint}>
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Save PDF</span>
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
