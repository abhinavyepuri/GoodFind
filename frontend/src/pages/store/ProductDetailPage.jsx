import * as React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Truck, ShieldCheck, RotateCcw, Check, ChevronRight, Plus, Minus, Sparkles, MessageSquare, Clock, Eye, Flame, } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AccordionItem } from '@/components/ui/accordion';
import { ProductCard } from '@/components/product/ProductCard';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
export function ProductDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { products, reviews, addReview } = useProductStore();
    const addItem = useCartStore((state) => state.addItem);
    const { isInWishlist, toggleWishlist, addToRecentlyViewed, recentlyViewed } = useWishlistStore();
    // Find product by slug or id
    const product = products.find((p) => p.slug === slug || p.id === slug);
    // Variant States
    const [selectedColor, setSelectedColor] = React.useState('');
    const [selectedSize, setSelectedSize] = React.useState('');
    const [selectedConfig, setSelectedConfig] = React.useState('');
    const [quantity, setQuantity] = React.useState(1);
    const [isAddedFeedback, setIsAddedFeedback] = React.useState(false);
    // Sticky Buy Bar State
    const [showStickyBar, setShowStickyBar] = React.useState(false);
    const mainBuyBoxRef = React.useRef(null);
    // Real-time Delivery Countdown Timer
    const [timeLeft, setTimeLeft] = React.useState({
        hours: 3,
        minutes: 42,
        seconds: 15,
    });
    // Review Modal State
    const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
    const [reviewAuthor, setReviewAuthor] = React.useState('');
    const [reviewRating, setReviewRating] = React.useState(5);
    const [reviewTitle, setReviewTitle] = React.useState('');
    const [reviewComment, setReviewComment] = React.useState('');
    // Initialize variant defaults when product loads
    React.useEffect(() => {
        if (product) {
            setSelectedColor(product.variants?.colors?.[0] || '');
            setSelectedSize(product.variants?.sizes?.[0] || '');
            setSelectedConfig(product.variants?.configurations?.[0] || '');
            setQuantity(1);
            addToRecentlyViewed(product);
            window.scrollTo(0, 0);
        }
    }, [product, addToRecentlyViewed]);
    // Countdown timer tick
    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0)
                    return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0)
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0)
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 4, minutes: 0, seconds: 0 }; // reset cycle
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    // Scroll observer for Sticky Buy Bar
    React.useEffect(() => {
        const handleScroll = () => {
            if (!mainBuyBoxRef.current)
                return;
            const rect = mainBuyBoxRef.current.getBoundingClientRect();
            // If the primary buy box has scrolled past top
            if (rect.bottom < 0) {
                setShowStickyBar(true);
            }
            else {
                setShowStickyBar(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    if (!product) {
        return (<div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-foreground">Product Not Found</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          The requested product may have been discontinued or moved.
        </p>
        <Link to="/catalog">
          <Button variant="brand">Browse Catalog</Button>
        </Link>
      </div>);
    }
    const inWishlist = isInWishlist(product.id);
    const productReviews = reviews.filter((r) => r.productId === product.id);
    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
    const discountPercent = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
    const handleAddToCart = () => {
        addItem(product, {
            color: selectedColor || undefined,
            size: selectedSize || undefined,
            config: selectedConfig || undefined,
            quantity,
        });
        setIsAddedFeedback(true);
        toast.success('Added to Bag', {
            description: `${quantity}x ${product.name} is ready in your cart.`,
        });
        setTimeout(() => setIsAddedFeedback(false), 2000);
    };
    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/checkout');
    };
    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!reviewAuthor || !reviewComment)
            return;
        addReview({
            productId: product.id,
            author: reviewAuthor,
            avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
            rating: reviewRating,
            title: reviewTitle || 'Exceptional Quality',
            comment: reviewComment,
            verified: true,
        });
        toast.success('Review Published', {
            description: 'Thank you for contributing to the community evaluation.',
        });
        setIsReviewModalOpen(false);
        setReviewAuthor('');
        setReviewTitle('');
        setReviewComment('');
        setReviewRating(5);
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-24">
      {/* Breadcrumb Trail */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5"/>
        <Link to="/catalog" className="hover:text-foreground transition-colors">Catalog</Link>
        <ChevronRight className="h-3.5 w-3.5"/>
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Product Showcase Image */}
        <div className="lg:col-span-7">
          {/* Main Large Display Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden border bg-zinc-50/70 dark:bg-zinc-900/40 shadow-soft flex items-center justify-center p-8 sm:p-12">
            <img src={product?.images?.[0] || product?.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'} alt={product?.name || 'Product'} onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80';
        }} className="w-full h-full max-h-full max-w-full object-contain object-center transition-all duration-300 drop-shadow-sm"/>
            {discountPercent > 0 && (<Badge variant="destructive" className="absolute top-4 left-4 text-xs font-bold">
                Save {discountPercent}%
              </Badge>)}
          </div>
        </div>

        {/* Right: Product Actions & Variants */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand & Title */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {product.brand}
              </span>
              <div className="flex items-center gap-1 text-xs text-foreground font-semibold">
                <Star className="h-3.5 w-3.5 fill-current"/>
                <span>{product.rating}</span>
                <span className="text-muted-foreground font-normal">
                  ({product.reviewCount} customer reviews)
                </span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
              {product.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {product.tagline}
            </p>
          </div>

          {/* Price & Scarcity Indicator */}
          <div className="space-y-3 p-4 bg-muted/40 rounded-2xl border">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (<span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>)}
              <Badge variant={product.stock > 15 ? 'success' : 'warning'} className="ml-auto text-xs">
                {product.stock > 0 ? `${product.stock} Units In Stock` : 'Out of Stock'}
              </Badge>
            </div>

            {/* Social Proof & Live Scarcity Pulse */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-border/60">
              <span className="flex items-center gap-1.5 text-foreground font-medium">
                <Flame className="h-4 w-4 fill-current text-foreground animate-bounce"/>
                {product.stock <= 15 ? `Only ${product.stock} units left at this price` : 'High demand item'}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Eye className="h-3.5 w-3.5 text-primary"/>
                16 shoppers viewing now
              </span>
            </div>

            {/* Guaranteed Delivery Cutoff Countdown */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-background border text-xs font-medium text-foreground">
              <Clock className="h-4 w-4 text-primary shrink-0"/>
              <span>
                Order within{' '}
                <span className="font-mono font-bold text-primary">
                  {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                </span>{' '}
                for Free Guaranteed Delivery by Tuesday
              </span>
            </div>
          </div>

          {/* Color Variants */}
          {product?.variants?.colors && product.variants.colors.length > 0 && (<div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Color: <span className="text-foreground">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {(product?.variants?.colors || []).map((color) => (<button key={color} onClick={() => setSelectedColor(color)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${selectedColor === color
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-background hover:bg-muted text-foreground'}`}>
                    {color}
                  </button>))}
              </div>
            </div>)}

          {/* Size Variants */}
          {product?.variants?.sizes && product.variants.sizes.length > 0 && (<div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Size: <span className="text-foreground">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {(product?.variants?.sizes || []).map((size) => (<button key={size} onClick={() => setSelectedSize(size)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${selectedSize === size
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-background hover:bg-muted text-foreground'}`}>
                    {size}
                  </button>))}
              </div>
            </div>)}

          {/* Configuration Variants */}
          {product?.variants?.configurations && product.variants.configurations.length > 0 && (<div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Configuration: <span className="text-foreground">{selectedConfig}</span>
              </label>
              <div className="space-y-1.5">
                {(product?.variants?.configurations || []).map((cfg) => (<button key={cfg} onClick={() => setSelectedConfig(cfg)} className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-between ${selectedConfig === cfg
                    ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm'
                    : 'border-border bg-background hover:bg-muted text-foreground'}`}>
                    <span>{cfg}</span>
                    {selectedConfig === cfg && <Check className="h-4 w-4 text-primary"/>}
                  </button>))}
              </div>
            </div>)}

          {/* Primary Buy Box Controls with Ref */}
          <div ref={mainBuyBoxRef} className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-xl overflow-hidden bg-background h-12">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} className="px-3.5 h-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30" aria-label="Decrease quantity">
                  <Minus className="h-4 w-4"/>
                </button>
                <span className="px-4 text-sm font-bold select-none">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock} className="px-3.5 h-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30" aria-label="Increase quantity">
                  <Plus className="h-4 w-4"/>
                </button>
              </div>

              {/* Add to Bag CTA */}
              <Button onClick={handleAddToCart} disabled={product.stock <= 0} variant={isAddedFeedback ? 'default' : 'brand'} className="flex-1 h-12 rounded-xl text-sm font-semibold shadow-md gap-2">
                {isAddedFeedback ? (<>
                    <Check className="h-4 w-4"/> Added to Shopping Bag!
                  </>) : (<>
                    <ShoppingBag className="h-4 w-4"/> Add to Bag
                  </>)}
              </Button>

              {/* Wishlist Button */}
              <button onClick={() => toggleWishlist(product)} aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'} className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all shrink-0 ${inWishlist
            ? 'bg-zinc-950 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white'
            : 'bg-background hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current text-white dark:text-zinc-950' : ''}`}/>
              </button>
            </div>

            {/* Instant Buy Now Button */}
            <Button onClick={handleBuyNow} disabled={product.stock <= 0} variant="secondary" className="w-full h-11 rounded-xl text-xs font-semibold">
              Instant Express Checkout
            </Button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t text-[11px] text-muted-foreground text-center">
            <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/30">
              <Truck className="h-4 w-4 text-primary"/>
              <span>Complimentary 2-Day Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/30">
              <RotateCcw className="h-4 w-4 text-primary"/>
              <span>30-Day Open Box Guarantee</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/30">
              <ShieldCheck className="h-4 w-4 text-primary"/>
              <span>2-Year Full Coverage</span>
            </div>
          </div>

          {/* Accordion Details */}
          <div className="pt-4 border-t space-y-1">
            <AccordionItem title="Full Product Description" defaultOpen={true}>
              <p className="leading-relaxed whitespace-pre-line">{product.description}</p>
            </AccordionItem>

            <AccordionItem title="Technical Specifications">
              <div className="divide-y divide-border/60">
                {Object.entries(product?.specifications || {}).map(([key, val]) => (<div key={key} className="py-2 flex justify-between gap-4 text-xs">
                    <span className="font-semibold text-foreground">{key}</span>
                    <span className="text-muted-foreground text-right">{val}</span>
                  </div>))}
              </div>
            </AccordionItem>

            <AccordionItem title="Shipping & Returns Policy">
              <div className="space-y-2 text-xs">
                <p><strong>Shipping:</strong> {product?.shippingInfo}</p>
                <p><strong>Warranty:</strong> {product?.warrantyInfo}</p>
                <p><strong>Return Policy:</strong> {product?.returnPolicy}</p>
              </div>
            </AccordionItem>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-10 border-t space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Customer Reviews ({(productReviews || []).length})
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified experiences from real owners.
            </p>
          </div>
          <Button onClick={() => setIsReviewModalOpen(true)} variant="outline" size="sm" className="text-xs gap-1.5">
            <MessageSquare className="h-3.5 w-3.5"/>
            <span>Write a Review</span>
          </Button>
        </div>

        {(productReviews || []).length === 0 ? (<div className="py-8 text-center bg-muted/20 rounded-2xl border p-6">
            <p className="text-sm font-medium text-foreground">No reviews yet for this product.</p>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              Be the first to share your thoughts on quality, design, and ergonomics.
            </p>
            <Button onClick={() => setIsReviewModalOpen(true)} variant="brand" size="sm" className="text-xs">
              Write First Review
            </Button>
          </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(productReviews || []).map((rev) => (<div key={rev?.id || Math.random()} className="p-5 rounded-2xl border bg-card/60 shadow-soft space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={rev?.avatar} alt={rev?.author || 'Reviewer'} className="h-9 w-9 rounded-full object-cover"/>
                    <div>
                      <h5 className="text-xs font-bold text-foreground">{rev?.author}</h5>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Verified Purchase
                      </span>
                    </div>
                  </div>
                  <div className="flex text-foreground">
                    {[...Array(5)].map((_, i) => (<Star key={i} className={`h-3 w-3 ${i < (rev?.rating || 0) ? 'fill-current' : 'text-muted stroke-muted'}`}/>))}
                  </div>
                </div>
                <h6 className="text-xs font-bold text-foreground">{rev?.title}</h6>
                <p className="text-xs text-muted-foreground leading-relaxed">{rev?.comment}</p>
                <p className="text-[10px] text-muted-foreground pt-1 border-t">
                  Posted on {formatDate(rev?.createdAt)}
                </p>
              </div>))}
          </div>)}
      </section>

      {/* Related Products Grid */}
      {(relatedProducts || []).length > 0 && (<section className="pt-10 border-t space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">You Might Also Admire</h3>
            <Link to={`/category/${product?.category ? product.category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-') : ''}`} className="text-xs font-semibold text-primary hover:underline">
              View More in {product?.category}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {(relatedProducts || []).map((p) => (<ProductCard key={p?.id} product={p}/>))}
          </div>
        </section>)}

      {/* Recently Viewed Products */}
      {(recentlyViewed || []).filter((p) => p?.id !== product?.id).length > 0 && (<section className="pt-10 border-t space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-foreground"/>
            <h3 className="text-xl font-bold text-foreground">Recently Viewed</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {(recentlyViewed || [])
                .filter((p) => p?.id !== product?.id)
                .slice(0, 4)
                .map((p) => (<ProductCard key={p?.id} product={p}/>))}
          </div>
        </section>)}

      {/* Write a Review Modal Dialog */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogHeader>
          <DialogTitle>Write a Product Review</DialogTitle>
          <DialogDescription>
            Share your feedback on &quot;{product.name}&quot; with our collector community.
          </DialogDescription>
          <DialogClose onClose={() => setIsReviewModalOpen(false)}/>
        </DialogHeader>

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Your Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (<button type="button" key={star} onClick={() => setReviewRating(star)} className="p-1 text-foreground hover:scale-110 transition-transform">
                  <Star className={`h-6 w-6 ${star <= reviewRating ? 'fill-current' : 'text-muted-foreground/30'}`}/>
                </button>))}
              <span className="text-xs font-semibold text-foreground ml-2">
                {reviewRating} out of 5 stars
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Your Name
            </label>
            <Input value={reviewAuthor} onChange={(e) => setReviewAuthor(e.target.value)} placeholder="e.g. Jordan Hayes" required/>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Headline Title
            </label>
            <Input value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} placeholder="e.g. Exceptional craftsmanship and finish" required/>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Review Comments
            </label>
            <Textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Describe material feel, fit, performance, and durability..." rows={4} required/>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" size="sm">
              Submit Review
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Slide-In Bottom Sticky Buy Bar on Scroll */}
      <AnimatePresence>
        {showStickyBar && (<motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 350 }} className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 border-t bg-background/95 backdrop-blur-xl shadow-2xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img src={product.images[0]} alt={product.name} className="h-12 w-12 rounded-xl object-contain p-1 border bg-zinc-50 dark:bg-zinc-900/40 shrink-0 hidden sm:block"/>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-foreground truncate">{product.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-extrabold text-foreground">{formatPrice(product.price)}</span>
                    {(selectedColor || selectedSize || selectedConfig) && (<span className="hidden md:inline text-[11px] bg-muted px-2 py-0.5 rounded-md">
                        {[selectedColor, selectedSize, selectedConfig].filter(Boolean).join(' • ')}
                      </span>)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button onClick={handleAddToCart} disabled={product.stock <= 0} variant={isAddedFeedback ? 'default' : 'brand'} className="h-10 text-xs sm:text-sm font-semibold shadow-md px-6 gap-1.5">
                  {isAddedFeedback ? (<>
                      <Check className="h-4 w-4"/> Added!
                    </>) : (<>
                      <ShoppingBag className="h-4 w-4"/> Add to Bag
                    </>)}
                </Button>
                <Button onClick={handleBuyNow} disabled={product.stock <= 0} variant="secondary" className="h-10 text-xs font-semibold hidden sm:inline-flex">
                  Buy Now
                </Button>
              </div>
            </div>
          </motion.div>)}
      </AnimatePresence>
    </div>);
}
