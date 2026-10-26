import * as React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Check, Eye, Scale } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { Badge } from '@/components/ui/badge';
import { QuickViewModal } from './QuickViewModal';
import { showSnackbar } from '@/lib/snackbar';

export function ProductCard({ product }) {
    const [isAdded, setIsAdded] = React.useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false);
    const { isInWishlist, toggleWishlist } = useWishlistStore();
    const addItem = useCartStore((state) => state.addItem);
    const { isInCompare, toggleCompare } = useProductStore();
    const inWishlist = isInWishlist(product?.id);
    const inCompare = isInCompare(product?.id);
    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Add default variant choices if exists
        const defaultColor = product?.variants?.colors?.[0];
        const defaultSize = product?.variants?.sizes?.[0];
        const defaultConfig = product?.variants?.configurations?.[0];
        addItem(product, {
            color: defaultColor,
            size: defaultSize,
            config: defaultConfig,
            quantity: 1,
        });
        setIsAdded(true);
        const variantSuffix = [defaultColor, defaultSize, defaultConfig].filter(Boolean).join('-');
        const addedItemId = variantSuffix ? `${product.id}-${variantSuffix}` : product.id;
        showSnackbar(`Added ${product?.name} to Cart`, {
            description: 'Item reserved in your shopping bag.',
            onUndo: () => {
                useCartStore.getState().removeItem(addedItemId);
            },
        });
        setTimeout(() => setIsAdded(false), 1500);
    };
    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };
    const handleCompareToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCompare(product);
    };
    const handleOpenQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsQuickViewOpen(true);
    };
    // Calculate discount percent
    const discountPercent = product?.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
    return (<>
      <div className="group relative flex flex-col rounded-2xl border border-border/80 dark:border-white/15 bg-card text-card-foreground shadow-soft hover:shadow-soft-md dark:hover:border-white/30 transition-all duration-300 overflow-hidden">
        {/* Product Image Area with Dark Mode Frame and Anti-Glare */}
        <Link to={`/product/${product?.slug}`} className="relative aspect-square w-full overflow-hidden bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-border/50 dark:border-white/10 p-6 flex items-center justify-center block">
          <img src={product?.images?.[0] || product?.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'} alt={product?.name || 'Product'} loading="lazy" onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80';
        }} className="h-full w-full max-h-full max-w-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-sm dark:brightness-[0.96] dark:contrast-[0.98]"/>

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {product.bestseller && (<Badge variant="brand" className="text-[10px] font-bold shadow-sm pointer-events-auto">
                Best Seller
              </Badge>)}
            {product.newArrival && (<Badge variant="success" className="text-[10px] font-bold shadow-sm pointer-events-auto">
                New Arrival
              </Badge>)}
            {discountPercent > 0 && (<Badge variant="destructive" className="text-[10px] font-bold shadow-sm pointer-events-auto">
                Save {discountPercent}%
              </Badge>)}
          </div>

          {/* Top Right Floating Action Group: Wishlist & Compare */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
            <button onClick={handleWishlistToggle} aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'} className={`h-8 w-8 rounded-lg border shadow-sm flex items-center justify-center transition-all ${inWishlist
            ? 'bg-zinc-950 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white'
            : 'bg-background/80 backdrop-blur-md border-border/80 text-muted-foreground hover:text-foreground hover:bg-background'}`} title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}>
              <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current text-white dark:text-zinc-950' : ''}`}/>
            </button>

            <button onClick={handleCompareToggle} aria-label={inCompare ? 'Remove from comparison' : 'Compare product'} className={`h-8 w-8 rounded-lg border shadow-sm flex items-center justify-center transition-all ${inCompare
            ? 'bg-primary text-primary-foreground border-primary shadow-md'
            : 'bg-background/80 backdrop-blur-md border-border/80 text-muted-foreground hover:text-foreground hover:bg-background opacity-70 group-hover:opacity-100 transition-opacity'}`} title={inCompare ? 'In Comparison Matrix' : 'Compare specifications'}>
              <Scale className="h-4 w-4"/>
            </button>
          </div>

          {/* Bottom Floating Quick Actions: Quick View & Quick Add */}
          <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex gap-2">
            <button onClick={handleOpenQuickView} className="flex-1 py-2 rounded-xl font-semibold text-xs shadow-lg backdrop-blur-md bg-background/90 hover:bg-background text-foreground border flex items-center justify-center gap-1.5 transition-all">
              <Eye className="h-3.5 w-3.5 text-primary"/>
              <span>Quick View</span>
            </button>

            <button onClick={handleQuickAdd} disabled={product.stock <= 0} className={`flex-1 py-2 rounded-xl font-semibold text-xs shadow-lg backdrop-blur-md flex items-center justify-center gap-1.5 transition-all ${isAdded
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'bg-zinc-950/90 hover:bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100'}`}>
              {isAdded ? (<>
                  <Check className="h-3.5 w-3.5"/> Added!
                </>) : product.stock <= 0 ? ('Sold Out') : (<>
                  <ShoppingBag className="h-3.5 w-3.5"/> Quick Add
                </>)}
            </button>
          </div>
        </Link>

        {/* Product Content Details */}
        <div className="p-4 flex flex-1 flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
              <span className="uppercase tracking-wider truncate">{product.brand}</span>
              <div className="flex items-center gap-1 text-foreground font-semibold shrink-0">
                <Star className="h-3 w-3 fill-current"/>
                <span>{product.rating}</span>
                <span className="text-muted-foreground font-normal">({product.reviewCount})</span>
              </div>
            </div>

            <Link to={`/product/${product.slug}`} className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1 block group-hover:text-primary">
              {product.name}
            </Link>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {product.tagline}
            </p>
          </div>

          {/* Pricing & Mobile Quick Controls */}
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (<span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>)}
            </div>

            <div className="sm:hidden flex items-center gap-1">
              <button onClick={handleOpenQuickView} className="p-1.5 rounded-lg border bg-muted/40 text-muted-foreground" aria-label="Quick view">
                <Eye className="h-3.5 w-3.5"/>
              </button>
              <button onClick={handleQuickAdd} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Add to cart">
                <ShoppingBag className="h-3.5 w-3.5"/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal Dialog */}
      <QuickViewModal product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)}/>
    </>);
}
