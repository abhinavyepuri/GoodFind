import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Sparkles, Tag, CheckCircle2, Truck, } from 'lucide-react';
import { Sheet, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
export function MiniCartSheet() {
    const navigate = useNavigate();
    const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getDiscount, getShipping, getTotal, appliedCoupon, applyCoupon, removeCoupon, couponError, } = useCartStore();
    const [couponInput, setCouponInput] = React.useState('');
    const [couponSuccess, setCouponSuccess] = React.useState(false);
    const subtotal = getSubtotal();
    const discount = getDiscount();
    const shipping = getShipping();
    const total = getTotal();
    const freeShippingThreshold = 150;
    const freeShippingLeft = Math.max(0, freeShippingThreshold - subtotal);
    const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
    const handleApplyCoupon = (e) => {
        e.preventDefault();
        if (!couponInput.trim())
            return;
        const success = applyCoupon(couponInput);
        if (success) {
            setCouponSuccess(true);
            setCouponInput('');
            setTimeout(() => setCouponSuccess(false), 3000);
        }
    };
    const handleCheckout = () => {
        closeCart();
        navigate('/checkout');
    };
    return (<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()} side="right">
      <SheetHeader>
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary"/>
          <SheetTitle>Your Bag ({items.length})</SheetTitle>
        </div>
        <SheetClose onClose={closeCart}/>
      </SheetHeader>

      {/* Free Shipping Progress Indicator */}
      {items.length > 0 && (<div className="bg-muted/50 rounded-xl p-3.5 border mb-4">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span className="flex items-center gap-1.5 text-foreground">
              <Truck className="h-4 w-4 text-foreground"/>
              {freeShippingLeft === 0
                ? 'You qualify for Free Express Shipping!'
                : `Add ${formatPrice(freeShippingLeft)} more for Free Shipping`}
            </span>
            <span className="text-muted-foreground">{Math.round(shippingProgress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-zinc-950 dark:bg-white rounded-full transition-all duration-500 ease-out" style={{ width: `${shippingProgress}%` }}/>
          </div>
        </div>)}

      {/* Items list */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {items.length === 0 ? (<div className="py-16 text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <ShoppingBag className="h-10 w-10 stroke-[1.5]"/>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground">Your bag is empty</h4>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                Explore our curated collection of luxury hardware, apparel, and design objects.
              </p>
            </div>
            <Button onClick={() => {
                closeCart();
                navigate('/catalog');
            }} variant="brand" className="mt-2">
              Start Shopping
            </Button>
          </div>) : ((items || []).map((item) => (<div key={item?.id || Math.random()} className="flex gap-3.5 p-3 rounded-xl border bg-card/60 hover:bg-card transition-colors group">
              <img src={item?.product?.images?.[0] || item?.product?.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'} alt={item?.product?.name || 'Item'} onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80';
            }} className="h-20 w-20 rounded-lg object-contain p-1.5 bg-zinc-50 dark:bg-zinc-900/40 shrink-0 border"/>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <Link to={`/product/${item?.product?.slug || ''}`} onClick={closeCart} className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                      {item?.product?.name || 'Product'}
                    </Link>
                    <button onClick={() => removeItem(item?.id)} className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors" aria-label="Remove item">
                      <Trash2 className="h-4 w-4"/>
                    </button>
                  </div>

                  <div className="text-xs text-muted-foreground mt-0.5 space-x-1.5">
                    {item?.selectedColor && (<span className="inline-block bg-muted px-1.5 py-0.5 rounded">
                        {item.selectedColor}
                      </span>)}
                    {item?.selectedSize && (<span className="inline-block bg-muted px-1.5 py-0.5 rounded">
                        Size: {item.selectedSize}
                      </span>)}
                    {item?.selectedConfig && (<span className="inline-block bg-muted px-1.5 py-0.5 rounded">
                        {item.selectedConfig}
                      </span>)}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                  <div className="flex items-center border rounded-lg overflow-hidden bg-background">
                    <button onClick={() => updateQuantity(item?.id, (item?.quantity || 1) - 1)} className="px-2 py-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30" disabled={(item?.quantity || 1) <= 1} aria-label="Decrease quantity">
                      <Minus className="h-3.5 w-3.5"/>
                    </button>
                    <span className="px-2.5 py-0.5 text-xs font-semibold select-none">
                      {item?.quantity || 1}
                    </span>
                    <button onClick={() => updateQuantity(item?.id, (item?.quantity || 1) + 1)} className="px-2 py-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30" disabled={(item?.quantity || 1) >= (item?.product?.stock || 99)} aria-label="Increase quantity">
                      <Plus className="h-3.5 w-3.5"/>
                    </button>
                  </div>

                  <span className="text-sm font-bold text-foreground">
                    {formatPrice((item?.product?.price || 0) * (item?.quantity || 1))}
                  </span>
                </div>
              </div>
            </div>)))}
      </div>

      {/* Cart Footer */}
      {items.length > 0 && (<div className="pt-4 border-t space-y-3 shrink-0">
          {/* Coupon input */}
          {appliedCoupon ? (<div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-900 border border-border rounded-lg p-2.5 text-xs text-foreground">
              <span className="flex items-center gap-1.5 font-semibold">
                <Tag className="h-3.5 w-3.5 text-foreground"/>
                Code &quot;{appliedCoupon.code}&quot; applied (-{formatPrice(discount)})
              </span>
              <button onClick={removeCoupon} className="text-xs font-medium underline hover:text-destructive transition-colors ml-2">
                Remove
              </button>
            </div>) : (<form onSubmit={handleApplyCoupon} className="flex gap-2">
              <Input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Discount code (e.g. WELCOME10)" className="h-9 text-xs"/>
              <Button type="submit" variant="secondary" size="sm" className="h-9 shrink-0">
                Apply
              </Button>
            </form>)}

          {couponError && <p className="text-xs text-destructive">{couponError}</p>}
          {couponSuccess && (<p className="text-xs text-foreground font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5"/> Coupon code applied successfully!
            </p>)}

          {/* Pricing summary */}
          <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (<div className="flex justify-between text-foreground font-medium">
                <span>Promotional Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>)}
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="text-foreground font-medium">
                {shipping === 0 ? (<span className="text-foreground font-semibold">Free</span>) : (formatPrice(shipping))}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-foreground pt-1.5 border-t">
              <span>Estimated Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-1">
            <Button onClick={handleCheckout} variant="brand" className="w-full h-11 text-sm font-semibold flex items-center justify-center gap-2 shadow-md">
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4"/>
            </Button>
            <Button onClick={() => {
                closeCart();
                navigate('/cart');
            }} variant="outline" className="w-full h-9 text-xs">
              View Full Shopping Bag
            </Button>
          </div>

          <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3 text-brand-500"/>
            Complimentary 30-day returns & insured shipping
          </p>
        </div>)}
    </Sheet>);
}
