import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, X, Star, ShoppingBag } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function CompareModal({ isOpen, onClose }) {
  const items = useProductStore((state) => state.compareItems) || [];
  const removeFromCompare = useProductStore((state) => state.removeFromCompare);
  const clearCompare = useProductStore((state) => state.clearCompare);
  const addItem = useCartStore((state) => state.addItem);

  // Extract all unique spec keys across compared items safely
  const allSpecKeys = React.useMemo(() => {
    const keys = new Set();
    (items || []).forEach((item) => {
      Object.keys(item?.specifications || {}).forEach((k) => keys.add(k));
    });
    return Array.from(keys);
  }, [items]);

  if (!isOpen) return null;

  const handleAdd = (p) => {
    if (!p) return;
    addItem(p);
    toast.success('Added to Bag', {
      description: `${p.name} added to your shopping cart.`,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-50 w-full max-w-5xl rounded-3xl border bg-background shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-card/60">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Product Comparison Matrix ({items.length} of 4)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Side-by-side engineering specifications, pricing, and warranty terms.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearCompare}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Matrix Content Area */}
          <div className="flex-1 overflow-x-auto p-6">
            <div className="min-w-[640px]">
              {/* Product Headers Row */}
              <div className="grid grid-cols-5 gap-4 pb-6 border-b">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground self-end pb-2">
                  Object Profile
                </div>
                {(items || []).map((p) => (
                  <div key={p.id} className="space-y-3 relative group">
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="absolute top-1 right-1 h-6 w-6 rounded-md bg-background/80 border text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors"
                      title="Remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <img
                      src={p?.images?.[0] || p?.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'}
                      alt={p.name}
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80';
                      }}
                      className="h-28 w-full rounded-2xl object-contain p-2 border bg-zinc-50 dark:bg-zinc-900/40"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {p.brand}
                      </span>
                      <Link
                        to={`/product/${p.slug}`}
                        onClick={onClose}
                        className="font-bold text-xs text-foreground hover:text-primary transition-colors block line-clamp-1"
                      >
                        {p.name}
                      </Link>
                      <p className="text-sm font-extrabold text-foreground mt-1">
                        {formatPrice(p.price)}
                      </p>
                    </div>

                    <Button
                      onClick={() => handleAdd(p)}
                      variant="brand"
                      size="sm"
                      className="w-full text-xs h-8 gap-1 shadow-sm"
                    >
                      <ShoppingBag className="h-3 w-3" />
                      <span>Add to Bag</span>
                    </Button>
                  </div>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-border/60 text-xs">
                {/* Rating */}
                <div className="grid grid-cols-5 gap-4 py-3 items-center">
                  <span className="font-semibold text-muted-foreground">Rating & Reviews</span>
                  {(items || []).map((p) => (
                    <div key={p.id} className="flex items-center gap-1 text-foreground font-bold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{p.rating}</span>
                      <span className="text-muted-foreground font-normal">({p.reviewCount})</span>
                    </div>
                  ))}
                </div>

                {/* Category */}
                <div className="grid grid-cols-5 gap-4 py-3 items-center">
                  <span className="font-semibold text-muted-foreground">Category</span>
                  {(items || []).map((p) => (
                    <span key={p.id} className="text-foreground">{p.category}</span>
                  ))}
                </div>

                {/* Stock Status */}
                <div className="grid grid-cols-5 gap-4 py-3 items-center">
                  <span className="font-semibold text-muted-foreground">Stock Status</span>
                  {(items || []).map((p) => (
                    <Badge
                      key={p.id}
                      variant={p.stock > 15 ? 'success' : 'warning'}
                      className="text-[10px] w-fit"
                    >
                      {p.stock > 0 ? `${p.stock} Available` : 'Out of Stock'}
                    </Badge>
                  ))}
                </div>

                {/* Dynamic Specifications */}
                {(allSpecKeys || []).map((key) => (
                  <div key={key} className="grid grid-cols-5 gap-4 py-3 items-center">
                    <span className="font-semibold text-muted-foreground">{key}</span>
                    {(items || []).map((p) => (
                      <span key={p.id} className="text-foreground">
                        {p?.specifications?.[key] || '—'}
                      </span>
                    ))}
                  </div>
                ))}

                {/* Warranty */}
                <div className="grid grid-cols-5 gap-4 py-3 items-center">
                  <span className="font-semibold text-muted-foreground">Warranty</span>
                  {(items || []).map((p) => (
                    <span key={p.id} className="text-muted-foreground text-[11px] leading-tight">
                      {p.warrantyInfo || 'Standard 1-Year Warranty'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
