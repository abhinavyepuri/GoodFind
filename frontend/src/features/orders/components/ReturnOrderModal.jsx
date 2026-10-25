import * as React from 'react';
import {
  RotateCcw,
  CheckCircle2,
  UploadCloud,
  FileText,
  Printer,
  Download,
  QrCode,
  ShieldCheck,
  AlertCircle,
  X,
  PackageCheck,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { RETURN_REASONS, RETURN_RESOLUTIONS, isOrderReturnable } from '../types';

export function ReturnOrderModal({ order, isOpen, onClose, onConfirmReturn }) {
  const [selectedItems, setSelectedItems] = React.useState({});
  const [selectedReason, setSelectedReason] = React.useState(RETURN_REASONS[0].id);
  const [selectedResolution, setSelectedResolution] = React.useState(RETURN_RESOLUTIONS[0].id);
  const [comments, setComments] = React.useState('');
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [returnResult, setReturnResult] = React.useState(null);

  React.useEffect(() => {
    if (isOpen && order?.items) {
      // Default: select all items
      const initial = {};
      order.items.forEach((item) => {
        initial[item.productId] = item.quantity || 1;
      });
      setSelectedItems(initial);
      setSelectedReason(RETURN_REASONS[0].id);
      setSelectedResolution(RETURN_RESOLUTIONS[0].id);
      setComments('');
      setUploadedFiles([]);
      setIsSubmitting(false);
      setReturnResult(null);
    }
  }, [isOpen, order]);

  if (!order) return null;

  const eligible = isOrderReturnable(order);

  const toggleItem = (productId, maxQty) => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      if (next[productId]) {
        delete next[productId];
      } else {
        next[productId] = maxQty || 1;
      }
      return next;
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      const newEntries = files.map((f) => ({
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
      }));
      setUploadedFiles((prev) => [...prev, ...newEntries]);
    }
  };

  const removeFile = (idx) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(selectedItems).length === 0) return;

    setIsSubmitting(true);
    const reasonObj = RETURN_REASONS.find((r) => r.id === selectedReason);
    const resolutionObj = RETURN_RESOLUTIONS.find((res) => res.id === selectedResolution);

    const returnedItemsList = order.items.filter((i) => selectedItems[i.productId]).map((i) => ({
      ...i,
      quantity: selectedItems[i.productId],
    }));

    setTimeout(() => {
      const result = onConfirmReturn(order.id || order.orderNumber, {
        items: returnedItemsList,
        reason: reasonObj?.label || selectedReason,
        resolution: resolutionObj?.title || selectedResolution,
        comments,
        images: uploadedFiles.map((f) => f.name),
      });
      setReturnResult(result || { rmaNumber: `RMA-${order.orderNumber}-01`, trackingNumber: 'GF-RET-99214X' });
      setIsSubmitting(false);
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogClose onClose={onClose} />

      {!eligible ? (
        <div className="space-y-4 text-center py-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center">
            <AlertCircle className="h-6 w-6" />
          </div>
          <DialogTitle>Return Window Expired or Not Delivered</DialogTitle>
          <DialogDescription>
            Returns can only be requested for orders in <strong>Delivered</strong> status within our 30-day satisfaction window.
          </DialogDescription>
          <div className="p-4 rounded-xl border bg-muted/40 text-xs text-muted-foreground text-left space-y-2">
            <p>• <strong>Order Status:</strong> Currently {order.status}.</p>
            <p>• <strong>Need special assistance?</strong> Contact our Concierge Support team for warranty replacements or shipping inquiries.</p>
          </div>
          <div className="pt-2">
            <Button variant="brand" className="w-full" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : returnResult ? (
        /* Return Label & Confirmation View */
        <div className="space-y-5 py-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Return Authorized & Prepaid Label Ready</DialogTitle>
              <DialogDescription className="text-xs">
                RMA #{returnResult.rmaNumber} • Tracking: {returnResult.trackingNumber}
              </DialogDescription>
            </div>
          </div>

          {/* Prepaid Label Mock Card */}
          <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl p-5 space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between border-b pb-3 font-sans">
              <div>
                <span className="font-extrabold text-sm tracking-tight text-foreground">FedEx Ground Return</span>
                <p className="text-[10px] text-muted-foreground">Prepaid Commercial Return Services</p>
              </div>
              <Badge variant="brand" className="text-[10px]">
                PREPAID NO CHARGE
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground font-sans">Ship From:</span>
                <p className="font-semibold text-foreground">{order.customer?.name || 'Customer'}</p>
                <p className="text-muted-foreground">{order.shippingAddress?.street || '450 West 14th St'}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress?.city || 'New York'}, {order.shippingAddress?.postalCode || '10014'}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground font-sans">Ship To:</span>
                <p className="font-semibold text-foreground">GoodFind Returns Hub</p>
                <p className="text-muted-foreground">Dock 4A - Inspection Center</p>
                <p className="text-muted-foreground">Brooklyn, NY 11201</p>
              </div>
            </div>

            {/* QR Code and Barcode Simulator */}
            <div className="border-t pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 bg-background p-3 rounded-xl border">
              <div className="flex items-center gap-3">
                <div className="p-2 border rounded-lg bg-white text-zinc-950">
                  <QrCode className="h-10 w-10" />
                </div>
                <div className="font-sans">
                  <span className="text-[11px] font-bold text-foreground">Mobile Drop-off QR Code</span>
                  <p className="text-[10px] text-muted-foreground">
                    Show this QR at any FedEx depot or drop box for instant free printing.
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold tracking-widest text-muted-foreground border px-2 py-1 rounded bg-muted">
                {returnResult.trackingNumber}
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-1.5 text-xs text-muted-foreground font-medium">
            <p>1. Repack items safely in original or protective packaging.</p>
            <p>2. Affix the printed label or present the digital QR code at any drop-off station.</p>
            <p>3. Your refund or replacement initiates automatically when scanned by the carrier.</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 text-xs gap-1.5" onClick={handlePrint}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Label</span>
            </Button>
            <Button variant="brand" className="flex-1 text-xs gap-1.5" onClick={onClose}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Done</span>
            </Button>
          </div>
        </div>
      ) : (
        /* Return Request Form */
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[85vh] overflow-y-auto pr-1">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <RotateCcw className="h-4 w-4" />
              </div>
              <DialogTitle>Return & Exchange Request</DialogTitle>
            </div>
            <DialogDescription>
              Order #{order.orderNumber} • 30-Day Complimentary Return Policy
            </DialogDescription>
          </DialogHeader>

          {/* 1. Item Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Items to Return
            </label>
            <div className="space-y-2">
              {order.items?.map((item) => {
                const isChecked = Boolean(selectedItems[item.productId]);
                return (
                  <div
                    key={item.productId}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isChecked ? 'border-primary bg-primary/5' : 'border-border/80 bg-card opacity-60'
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleItem(item.productId, item.quantity)}
                        className="rounded border-zinc-400 text-primary focus:ring-primary h-4 w-4"
                      />
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-10 w-10 rounded-lg object-cover border bg-muted"
                      />
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground leading-snug line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {item.variant ? `${item.variant} • ` : ''}Qty: {item.quantity} • {formatPrice(item.price)}
                        </p>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Reason Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Reason for Return
            </label>
            <Select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="text-xs font-medium"
            >
              {RETURN_REASONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </Select>
          </div>

          {/* 3. Preferred Resolution */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Desired Outcome
            </label>
            <Select
              value={selectedResolution}
              onChange={(e) => setSelectedResolution(e.target.value)}
              className="text-xs font-medium"
            >
              {RETURN_RESOLUTIONS.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.title}
                </option>
              ))}
            </Select>
          </div>

          {/* 4. Optional Photo Upload Mock */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Supporting Photos (Optional)
            </label>
            <div className="border border-dashed rounded-xl p-3 text-center bg-muted/20 hover:bg-muted/40 transition-colors">
              <input
                type="file"
                id="return-photo-upload"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="return-photo-upload"
                className="cursor-pointer flex flex-col items-center gap-1 text-xs text-muted-foreground"
              >
                <UploadCloud className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Click to upload photos</span>
                <span className="text-[10px]">JPEG, PNG up to 10MB</span>
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {uploadedFiles.map((file, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] bg-muted border text-foreground"
                  >
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button type="button" variant="outline" className="flex-1 text-xs" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="brand"
              className="flex-1 text-xs gap-1.5"
              disabled={isSubmitting || Object.keys(selectedItems).length === 0}
            >
              <span>{isSubmitting ? 'Generating Label...' : 'Generate Prepaid Label'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
