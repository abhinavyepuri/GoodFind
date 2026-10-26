import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, Truck, MapPin, ShieldCheck, Lock, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProductStore } from '@/store/productStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function OrderConfirmationPage() {
    const { orderNumber } = useParams();
    const orders = useProductStore((state) => state.orders);
    const { user, isAuthenticated, register } = useAuthStore();
    const order = orders.find((o) => o.orderNumber === orderNumber) || orders[0];

    const [password, setPassword] = React.useState('');
    const [isRegistering, setIsRegistering] = React.useState(false);
    const [accountCreatedSuccess, setAccountCreatedSuccess] = React.useState(false);
    const [registerError, setRegisterError] = React.useState('');

    React.useEffect(() => {
        // Fire confetti celebration on mount
        try {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#7C3AED', '#10B981', '#3B82F6', '#F59E0B'],
            });
        }
        catch {
            // Confetti fallback
        }
    }, []);

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        if (!password || password.length < 6) {
            setRegisterError('Password must be at least 6 characters.');
            return;
        }
        setIsRegistering(true);
        setRegisterError('');
        const res = await register({
            email: order.customer.email,
            password,
            name: order.customer.name,
            phone: order.customer.phone || order.shippingAddress?.phone,
            address: order.shippingAddress,
            orderNumber: order.orderNumber,
            orderId: order.id,
        });
        setIsRegistering(false);
        if (res.success) {
            setAccountCreatedSuccess(true);
        } else {
            setRegisterError(res.error || 'Failed to create account.');
        }
    };

    if (!order) {
        return (<div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <Link to="/catalog">
          <Button variant="brand" className="mt-4">Return to Store</Button>
        </Link>
      </div>);
    }
    return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Hero Card */}
      <div className="p-8 sm:p-10 rounded-3xl border bg-card text-center space-y-4 shadow-soft">
        <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800 text-foreground flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10 stroke-[2]"/>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Order Confirmed & Authorized
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Thank you, {order.customer.name.split(' ')[0]}!
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your simulated order <span className="font-mono font-bold text-foreground">#{order.orderNumber}</span> has been received and queued at our Brooklyn distribution center.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link to={`/orders/${order.orderNumber}`}>
            <Button variant="brand" className="gap-2 shadow-md">
              <Truck className="h-4 w-4"/>
              <span>Track Live Delivery Status</span>
            </Button>
          </Link>
          <Link to="/catalog">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>

      {/* Progressive Profiling: 1-Click Guest Account Creation (Touchpoint 4) */}
      {!isAuthenticated && !accountCreatedSuccess ? (
        <div className="p-6 sm:p-8 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-primary/15 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">
                  Order #{order.orderNumber} Placed! Save your address for next time.
                </h3>
                <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                  We already have your shipping address for <strong className="text-foreground">{order.customer.email}</strong>. Enter a password to create your GoodFind account and track this shipment in 1 click.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleCreateAccount} className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-lg">
            <div className="relative flex-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="password"
                placeholder="Choose password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 h-11 text-xs bg-background/90 rounded-2xl"
                required
              />
            </div>
            <Button
              type="submit"
              variant="brand"
              disabled={isRegistering}
              className="h-11 px-5 text-xs font-semibold rounded-2xl shadow-md shrink-0 gap-2"
            >
              <span>{isRegistering ? 'Creating Account...' : 'Create GoodFind Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {registerError && (
            <p className="text-xs text-destructive font-medium">{registerError}</p>
          )}
        </div>
      ) : (
        <div className="p-5 rounded-2xl border bg-muted/40 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-foreground">Account Active & Address Saved</p>
              <p className="text-muted-foreground text-[11px]">
                This order and delivery address are permanently linked to {user?.email || order?.customer?.email}.
              </p>
            </div>
          </div>
          <Link to="/account/orders">
            <Button variant="outline" size="sm" className="text-xs rounded-xl">
              View in Account Hub
            </Button>
          </Link>
        </div>
      )}

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping & Contact Destination */}
        <div className="p-6 rounded-2xl border bg-card/60 shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">
            <MapPin className="h-4 w-4 text-primary"/>
            <span>Shipping Address</span>
          </div>
          <div className="text-sm space-y-0.5">
            <p className="font-bold text-foreground">{order?.shippingAddress?.fullName}</p>
            <p className="text-muted-foreground">{order?.shippingAddress?.street} {order?.shippingAddress?.apartment || ''}</p>
            <p className="text-muted-foreground">
              {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.postalCode}
            </p>
            <p className="text-muted-foreground">{order?.shippingAddress?.country}</p>
            <p className="text-xs text-muted-foreground pt-1">{order?.customer?.email}</p>
          </div>
        </div>

        {/* Tracking & Payment Method */}
        <div className="p-6 rounded-2xl border bg-card/60 shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">
            <Package className="h-4 w-4 text-primary"/>
            <span>Fulfillment & Payment</span>
          </div>
          <div className="text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-semibold text-foreground">{order?.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tracking Number:</span>
              <span className="font-mono font-semibold text-primary">{order?.trackingNumber || 'GENERATING'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Delivery:</span>
              <span className="font-semibold text-foreground">2-3 Business Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Summary Table */}
      <div className="p-6 rounded-2xl border bg-card shadow-soft space-y-4">
        <h3 className="font-bold text-base text-foreground border-b pb-3">Purchased Objects</h3>
        <div className="divide-y divide-border/60">
          {(order?.items || []).map((item, idx) => (<div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={item?.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'} alt={item?.name || 'Item'} className="h-12 w-12 rounded-lg object-cover border bg-muted"/>
                <div>
                  <p className="text-xs font-semibold text-foreground">{item?.name || 'Item'}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Qty: {item?.quantity || 1} {item?.variant ? `• ${item.variant}` : ''}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-foreground">
                {formatPrice((item?.price || 0) * (item?.quantity || 1))}
              </span>
            </div>))}
        </div>

        {/* Totals */}
        <div className="border-t pt-4 space-y-1.5 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(order?.subtotal || 0)}</span>
          </div>
          {(order?.discount || 0) > 0 && (<div className="flex justify-between text-foreground font-semibold">
              <span>Discount ({order?.couponCode || 'Promo'})</span>
              <span>-{formatPrice(order?.discount || 0)}</span>
            </div>)}
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>{order?.shipping === 0 ? 'Free' : formatPrice(order?.shipping || 0)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Estimated Sales Tax</span>
            <span>{formatPrice(order?.tax || 0)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-foreground border-t pt-2">
            <span>Total Paid</span>
            <span>{formatPrice(order?.total || 0)}</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link to="/catalog" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
          <span>Continue Shopping & Explore Catalog</span>
          <ArrowRight className="h-3.5 w-3.5"/>
        </Link>
      </div>
    </div>);
}
