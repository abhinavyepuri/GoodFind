import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, CheckCircle2, Truck, RotateCcw, } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
export function CartPage() {
    const navigate = useNavigate();
    const { items, removeItem, updateQuantity, clearCart, getSubtotal, getDiscount, getShipping, getTax, getTotal, appliedCoupon, applyCoupon, removeCoupon, couponError, } = useCartStore();
    const [couponCode, setCouponCode] = React.useState('');
    const [couponAppliedSuccess, setCouponAppliedSuccess] = React.useState(false);
    const subtotal = getSubtotal();
    const discount = getDiscount();
    const shipping = getShipping();
    const tax = getTax();
    const total = getTotal();
    const freeShippingThreshold = 150;
    const freeShippingLeft = Math.max(0, freeShippingThreshold - subtotal);
    const shippingPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
    const handleApplyCoupon = (e) => {
        e.preventDefault();
        if (!couponCode.trim())
            return;
        const success = applyCoupon(couponCode);
        if (success) {
            setCouponAppliedSuccess(true);
            setCouponCode('');
            setTimeout(() => setCouponAppliedSuccess(false), 3000);
        }
    };
    if (items.length === 0) {
        return (<div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="h-24 w-24 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground mb-6">
          <ShoppingBag className="h-12 w-12 stroke-[1.5]"/>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mt-2 mb-8">
          Explore our collection of mechanical desk setups, high-fidelity audio, organic wool knitwear, and single-origin coffee.
        </p>
        <Link to="/catalog">
          <Button variant="brand" size="lg" className="rounded-xl px-8 shadow-md">
            <span>Explore Catalog</span>
            <ArrowRight className="h-4 w-4 ml-2"/>
          </Button>
        </Link>
      </div>);
    }
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review your selected items before proceeding to secure checkout.
          </p>
        </div>
        <Button onClick={clearCart} variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive gap-1 self-start sm:self-auto">
          <Trash2 className="h-3.5 w-3.5"/>
          <span>Clear Shopping Bag</span>
        </Button>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="p-4 rounded-2xl border bg-muted/30">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="flex items-center gap-2 text-foreground">
            <Truck className="h-4 w-4 text-foreground"/>
            {freeShippingLeft === 0
            ? 'You have unlocked Complimentary Express Shipping!'
            : `Add ${formatPrice(freeShippingLeft)} more to unlock Free Express Delivery`}
          </span>
          <span className="text-muted-foreground">{Math.round(shippingPercent)}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-zinc-950 dark:bg-white rounded-full transition-all duration-500" style={{ width: `${shippingPercent}%` }}/>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {(items || []).map((item) => (<div key={item?.id || Math.random()} className="p-5 rounded-2xl border bg-card text-card-foreground shadow-soft flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all">
              <img src={item?.product?.images?.[0] || item?.product?.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'} alt={item?.product?.name || 'Item'} onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80';
            }} className="h-24 w-24 rounded-xl object-contain p-2 border bg-zinc-50 dark:bg-zinc-900/40 shrink-0"/>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {item?.product?.brand}
                    </span>
                    <Link to={`/product/${item?.product?.slug || ''}`} className="font-bold text-sm text-foreground hover:text-primary transition-colors block line-clamp-1">
                      {item?.product?.name}
                    </Link>
                  </div>
                  <button onClick={() => removeItem(item?.id)} className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors" aria-label="Remove item">
                    <Trash2 className="h-4 w-4"/>
                  </button>
                </div>

                {/* Variants selected */}
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                  {item?.selectedColor && (<span className="bg-muted px-2 py-0.5 rounded-md font-medium">
                      Color: {item.selectedColor}
                    </span>)}
                  {item?.selectedSize && (<span className="bg-muted px-2 py-0.5 rounded-md font-medium">
                      Size: {item.selectedSize}
                    </span>)}
                  {item?.selectedConfig && (<span className="bg-muted px-2 py-0.5 rounded-md font-medium">
                      {item.selectedConfig}
                    </span>)}
                </div>

                {/* Quantity and Price */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center border rounded-xl overflow-hidden bg-background">
                    <button onClick={() => updateQuantity(item?.id, (item?.quantity || 1) - 1)} disabled={(item?.quantity || 1) <= 1} className="px-2.5 py-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
                      <Minus className="h-3.5 w-3.5"/>
                    </button>
                    <span className="px-3 text-xs font-bold select-none">{item?.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item?.id, (item?.quantity || 1) + 1)} disabled={(item?.quantity || 1) >= (item?.product?.stock || 99)} className="px-2.5 py-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
                      <Plus className="h-3.5 w-3.5"/>
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold text-foreground">
                      {formatPrice((item?.product?.price || 0) * (item?.quantity || 1))}
                    </span>
                    {(item?.quantity || 1) > 1 && (<p className="text-[11px] text-muted-foreground">
                        {formatPrice(item?.product?.price || 0)} each
                      </p>)}
                  </div>
                </div>
              </div>
            </div>))}

          <div className="pt-2">
            <Link to="/catalog" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
              <span>← Continue Shopping & Add More</span>
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <div className="lg:col-span-4 p-6 rounded-2xl border bg-card shadow-soft space-y-6 sticky top-24">
          <h2 className="text-lg font-bold text-foreground border-b pb-3">Order Summary</h2>

          {/* Coupon Code Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Promotional Code
            </label>
            {appliedCoupon ? (<div className="flex items-center justify-between p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-border text-xs text-foreground">
                <div className="flex items-center gap-2 font-semibold">
                  <Tag className="h-4 w-4 text-foreground"/>
                  <span>{appliedCoupon.code} (-{formatPrice(discount)})</span>
                </div>
                <button onClick={removeCoupon} className="font-medium underline hover:text-destructive transition-colors ml-2">
                  Remove
                </button>
              </div>) : (<form onSubmit={handleApplyCoupon} className="flex gap-2">
                <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Code (e.g. WELCOME10)" className="h-10 text-xs"/>
                <Button type="submit" variant="secondary" size="sm" className="h-10 px-4 shrink-0">
                  Apply
                </Button>
              </form>)}

            {couponError && <p className="text-xs text-destructive">{couponError}</p>}
            {couponAppliedSuccess && (<p className="text-xs text-foreground font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5"/> Coupon code applied successfully!
              </p>)}
          </div>

          {/* Calculations */}
          <div className="space-y-2.5 text-xs border-t pt-4">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground font-semibold">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (<div className="flex justify-between text-foreground font-semibold">
                <span>Promotional Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>)}
            <div className="flex justify-between text-muted-foreground">
              <span>Estimated Shipping</span>
              <span className="text-foreground font-semibold">
                {shipping === 0 ? (<span>Free</span>) : (formatPrice(shipping))}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Estimated Sales Tax (8%)</span>
              <span className="text-foreground font-semibold">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-foreground border-t pt-3">
              <span>Total Amount</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <Button onClick={() => navigate('/checkout')} variant="brand" className="w-full h-12 text-sm font-semibold shadow-md gap-2">
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4"/>
          </Button>

          {/* Trust Guarantees */}
          <div className="space-y-2 text-[11px] text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-foreground shrink-0"/>
              <span>Simulated 256-bit SSL encrypted checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-primary shrink-0"/>
              <span>30-day money-back guarantee with prepaid labels</span>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
