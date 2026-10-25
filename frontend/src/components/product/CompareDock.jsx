import { motion, AnimatePresence } from 'framer-motion';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { Button } from '@/components/ui/button';

export function CompareDock({ onOpenModal }) {
  const items = useProductStore((state) => state.compareItems) || [];
  const removeFromCompare = useProductStore((state) => state.removeFromCompare);
  const clearCompare = useProductStore((state) => state.clearCompare);

  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-xl w-full"
      >
        <div className="p-3.5 rounded-2xl border bg-background/95 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-4 border-primary/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Scale className="h-4 w-4" />
            </div>

            {/* Product Thumbnails Dock */}
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              {items.map((p) => (
                <div key={p.id} className="relative group shrink-0">
                  <img
                    src={p?.images?.[0] || p?.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80';
                    }}
                    className="h-10 w-10 rounded-lg object-contain p-1 border bg-zinc-50 dark:bg-zinc-900/40 ring-1 ring-border"
                  />
                  <button
                    onClick={() => removeFromCompare(p.id)}
                    className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-destructive transition-colors text-[10px]"
                    title="Remove from comparison"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
              {items.length < 4 && (
                <div className="h-10 px-2.5 rounded-lg border border-dashed border-muted-foreground/30 flex items-center justify-center text-[10px] text-muted-foreground whitespace-nowrap">
                  + {4 - items.length} slot{4 - items.length > 1 ? 's' : ''} left
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={onOpenModal}
              variant="brand"
              size="sm"
              className="text-xs shadow-md gap-1.5 h-9"
            >
              <span>Compare ({items.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <button
              onClick={clearCompare}
              className="p-1.5 text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors"
              title="Clear all"
            >
              Clear
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
