import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
export function WishlistPage() {
    const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
    const addItem = useCartStore((state) => state.addItem);
    const handleMoveToCart = (product) => {
        addItem(product);
        removeFromWishlist(product.id);
    };
    if (items.length === 0) {
        return (<div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="h-24 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800 text-foreground flex items-center justify-center mx-auto mb-6">
          <Heart className="h-12 w-12 stroke-[1.5]"/>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Your Wishlist is Empty
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mt-2 mb-8">
          Save your favorite audio instruments, cashmere knitwear, and architectural decor for future acquisitions.
        </p>
        <Link to="/catalog">
          <Button variant="brand" size="lg" className="rounded-xl px-8 shadow-md">
            <span>Discover Objects</span>
            <ArrowRight className="h-4 w-4 ml-2"/>
          </Button>
        </Link>
      </div>);
    }
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Saved Wishlist ({items.length})
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your private collection of desired products.
          </p>
        </div>
        <Button onClick={clearWishlist} variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive gap-1 self-start sm:self-auto">
          <Trash2 className="h-3.5 w-3.5"/>
          <span>Clear Wishlist</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(items || []).map((product) => (<div key={product?.id} className="group relative flex flex-col rounded-2xl border bg-card shadow-soft hover:shadow-soft-md transition-all overflow-hidden">
            <Link to={`/product/${product?.slug || ''}`} className="relative aspect-square w-full overflow-hidden bg-zinc-50/70 dark:bg-zinc-900/40 p-6 flex items-center justify-center block">
              <img src={product?.images?.[0] || product?.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'} alt={product?.name || 'Product'} onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80';
            }} className="h-full w-full max-h-full max-w-full object-contain object-center transition-transform duration-500 group-hover:scale-105 drop-shadow-sm"/>
            </Link>

            <button onClick={() => removeFromWishlist(product?.id)} className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-background/80 backdrop-blur-md border text-foreground hover:opacity-75 flex items-center justify-center transition-colors" aria-label="Remove from wishlist">
              <Heart className="h-4 w-4 fill-current"/>
            </button>

            <div className="p-4 flex flex-1 flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {product?.brand}
                </span>
                <Link to={`/product/${product?.slug || ''}`} className="font-bold text-sm text-foreground hover:text-primary transition-colors block line-clamp-1">
                  {product?.name}
                </Link>
                <p className="text-xs font-bold text-foreground mt-1">
                  {formatPrice(product?.price || 0)}
                </p>
              </div>

              <Button onClick={() => handleMoveToCart(product)} variant="brand" size="sm" className="w-full text-xs gap-1.5 shadow-sm">
                <ShoppingBag className="h-3.5 w-3.5"/>
                <span>Move to Shopping Bag</span>
              </Button>
            </div>
          </div>))}
      </div>
    </div>);
}
