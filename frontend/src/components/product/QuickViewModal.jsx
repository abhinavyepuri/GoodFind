import * as React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Check, Plus, Minus, ExternalLink, X, } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
export function QuickViewModal({ product, isOpen, onClose }) {
    const [selectedColor, setSelectedColor] = React.useState('');
    const [selectedSize, setSelectedSize] = React.useState('');
    const [selectedConfig, setSelectedConfig] = React.useState('');
    const [quantity, setQuantity] = React.useState(1);
    const [isAdded, setIsAdded] = React.useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const { isInWishlist, toggleWishlist } = useWishlistStore();
    // Initialize options when product changes
    React.useEffect(() => {
        if (product) {
            setSelectedColor(product.variants?.colors?.[0] || '');
            setSelectedSize(product.variants?.sizes?.[0] || '');
            setSelectedConfig(product.variants?.configurations?.[0] || '');
            setQuantity(1);
            setIsAdded(false);
        }
    }, [product]);
    // Keydown ESC to close
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen)
                onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);
    if (!product)
        return null;
    const inWishlist = isInWishlist(product.id);
    const handleAddToCart = () => {
        addItem(product, {
            color: selectedColor || undefined,
            size: selectedSize || undefined,
            config: selectedConfig || undefined,
            quantity,
        });
        setIsAdded(true);
        toast.success('Added to Shopping Bag', {
            description: `${quantity}x ${product.name} ready in your cart.`,
        });
        setTimeout(() => setIsAdded(false), 2000);
    };
    const discountPercent = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
    return (<AnimatePresence>
      {isOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm"/>

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="relative z-50 w-full max-w-3xl rounded-3xl border bg-background shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
            {/* Close Icon */}
            <button onClick={onClose} className="absolute top-4 right-4 z-20 h-8 w-8 rounded-lg bg-background/80 backdrop-blur-md border text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors" aria-label="Close modal">
              <X className="h-4 w-4"/>
            </button>

            {/* Left: Product Showcase Image */}
            <div className="md:w-1/2 p-6 flex flex-col justify-center bg-muted/20 border-b md:border-b-0 md:border-r">
              <div className="relative aspect-square rounded-2xl overflow-hidden border bg-zinc-50/70 dark:bg-zinc-900/40 shadow-sm flex items-center justify-center p-6">
                <img src={product.images[0]} alt={product.name} onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80';
            }} className="w-full h-full max-h-full max-w-full object-contain object-center drop-shadow-sm"/>
                {discountPercent > 0 && (<Badge variant="destructive" className="absolute top-3 left-3 text-[10px] font-bold">
                    Save {discountPercent}%
                  </Badge>)}
              </div>
            </div>

            {/* Right: Product Details & Controls */}
            <div className="md:w-1/2 p-6 flex-1 overflow-y-auto space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold uppercase tracking-wider text-primary">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-1 text-foreground font-semibold">
                    <Star className="h-3 w-3 fill-current"/>
                    <span>{product.rating}</span>
                    <span className="text-muted-foreground font-normal">({product.reviewCount})</span>
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-foreground tracking-tight mt-1">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {product.tagline}
                </p>
              </div>

              {/* Price & Stock Badge */}
              <div className="flex items-baseline gap-2.5 p-3 rounded-xl bg-muted/40 border">
                <span className="text-2xl font-extrabold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (<span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>)}
                <Badge variant={product.stock > 15 ? 'success' : 'warning'} className="ml-auto text-[10px]">
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </Badge>
              </div>

              {/* Color Variant picker */}
              {product.variants?.colors && product.variants.colors.length > 0 && (<div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Color: <span className="text-foreground">{selectedColor}</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.variants.colors.map((color) => (<button key={color} onClick={() => setSelectedColor(color)} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${selectedColor === color
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-border bg-background hover:bg-muted text-foreground'}`}>
                        {color}
                      </button>))}
                  </div>
                </div>)}

              {/* Size Variant picker */}
              {product.variants?.sizes && product.variants.sizes.length > 0 && (<div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Size: <span className="text-foreground">{selectedSize}</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.variants.sizes.map((size) => (<button key={size} onClick={() => setSelectedSize(size)} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-border bg-background hover:bg-muted text-foreground'}`}>
                        {size}
                      </button>))}
                  </div>
                </div>)}

              {/* Quantity & Add to Cart */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-xl overflow-hidden bg-background h-10">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} className="px-2.5 h-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
                      <Minus className="h-3 w-3"/>
                    </button>
                    <span className="px-3 text-xs font-bold select-none">{quantity}</span>
                    <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock} className="px-2.5 h-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
                      <Plus className="h-3 w-3"/>
                    </button>
                  </div>

                  <Button onClick={handleAddToCart} disabled={product.stock <= 0} variant={isAdded ? 'default' : 'brand'} className="flex-1 h-10 text-xs font-semibold shadow-md gap-1.5">
                    {isAdded ? (<>
                        <Check className="h-3.5 w-3.5"/> Added!
                      </>) : (<>
                        <ShoppingBag className="h-3.5 w-3.5"/> Add to Bag
                      </>)}
                  </Button>

                  <button onClick={() => toggleWishlist(product)} className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-colors shrink-0 ${inWishlist
                ? 'bg-zinc-950 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white'
                : 'bg-background hover:bg-muted text-muted-foreground'}`} aria-label="Toggle wishlist">
                    <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current text-white dark:text-zinc-950' : ''}`}/>
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <Link to={`/product/${product.slug}`} onClick={onClose} className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                    <span>View Complete Product Details & Reviews</span>
                    <ExternalLink className="h-3 w-3"/>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>)}
    </AnimatePresence>);
}
