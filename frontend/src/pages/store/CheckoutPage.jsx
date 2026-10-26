import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, Lock, ArrowRight, Info, ChevronRight, User, Plus, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function CheckoutPage() {
    const navigate = useNavigate();
    const { items, getSubtotal, getDiscount, getShipping, getTax, appliedCoupon, clearCart } = useCartStore();
    const { currentUser, createOrder } = useProductStore();
    const { user, addresses, isAuthenticated, openAuthModal, register, addAddress } = useAuthStore();

    // Form Fields
    const [step, setStep] = React.useState(1);
    const [email, setEmail] = React.useState(user?.email || currentUser?.email || '');
    const [fullName, setFullName] = React.useState(user?.name || currentUser?.name || '');
    const [phone, setPhone] = React.useState(user?.phone || currentUser?.phone || '');

    // Saved Address Book selection state
    const [selectedAddressId, setSelectedAddressId] = React.useState('');
    const [isAddingNewAddress, setIsAddingNewAddress] = React.useState(false);

    // Guest Account Creation (Path B)
    const [saveAccount, setSaveAccount] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [saveAddressToAccount, setSaveAddressToAccount] = React.useState(true);

    // Shipping Address fields
    const defaultAddr = (addresses && addresses.length > 0)
        ? (addresses.find((a) => a.isDefault) || addresses[0])
        : (currentUser.addresses?.find((a) => a.isDefault) || currentUser.addresses?.[0]);

    const [street, setStreet] = React.useState(defaultAddr?.street || '450 West 14th Street');
    const [apartment, setApartment] = React.useState(defaultAddr?.apartment || 'Suite 8B');
    const [city, setCity] = React.useState(defaultAddr?.city || 'New York');
    const [state, setState] = React.useState(defaultAddr?.state || 'NY');
    const [postalCode, setPostalCode] = React.useState(defaultAddr?.postalCode || '10014');
    const [country, setCountry] = React.useState(defaultAddr?.country || 'United States');

    // Shipping Method
    const [shippingMethod, setShippingMethod] = React.useState('standard');

    // Payment Selection (Demo)
    const [paymentMethod, setPaymentMethod] = React.useState('card');
    const [cardNumber, setCardNumber] = React.useState('•••• •••• •••• 4242');
    const [cardExpiry, setCardExpiry] = React.useState('12/28');
    const [cardCvc, setCardCvc] = React.useState('•••');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const subtotal = getSubtotal();
    const discount = getDiscount();
    const baseShipping = getShipping();
    const shipping = shippingMethod === 'express' ? baseShipping + 15 : baseShipping;
    const tax = getTax();
    const total = Math.max(0, subtotal - discount + shipping + tax);

    // Auto-hydrate form fields when authenticated user or addresses update
    React.useEffect(() => {
        if (isAuthenticated && user) {
            if (user.email && !email) setEmail(user.email);
            if (user.name && !fullName) setFullName(user.name);
            if (user.phone && !phone) setPhone(user.phone);
        }
    }, [isAuthenticated, user]);

    React.useEffect(() => {
        if (isAuthenticated && Array.isArray(addresses) && addresses.length > 0 && !isAddingNewAddress) {
            const def = addresses.find((a) => a.isDefault) || addresses[0];
            if (def && (!selectedAddressId || selectedAddressId === 'new')) {
                setSelectedAddressId(def.id);
                setStreet(def.street || '');
                setApartment(def.apartment || '');
                setCity(def.city || '');
                setState(def.state || '');
                setPostalCode(def.postalCode || '');
                setCountry(def.country || 'United States');
                if (def.fullName) setFullName(def.fullName);
                if (def.phone) setPhone(def.phone);
            }
        }
    }, [isAuthenticated, addresses, selectedAddressId, isAddingNewAddress]);

    // Redirect if cart is empty
    React.useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
        }
    }, [items, navigate]);

    const validateStep1 = () => {
        const errs = {};
        const trimmedEmail = (email || '').trim();
        const trimmedName = (fullName || '').trim();
        const trimmedPhone = (phone || '').trim();

        if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            errs.email = 'Valid email address is required (e.g. name@domain.com).';
        }
        if (!trimmedName || trimmedName.length < 2) {
            errs.fullName = 'Full name is required (at least 2 characters).';
        }
        if (!trimmedPhone || trimmedPhone.length < 7) {
            errs.phone = 'Valid phone number is required (at least 7 digits).';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateStep2 = () => {
        const errs = {};
        const trimmedStreet = (street || '').trim();
        const trimmedCity = (city || '').trim();
        const trimmedState = (state || '').trim();
        const trimmedPostal = (postalCode || '').trim();

        if (!trimmedStreet || trimmedStreet.length < 3) {
            errs.street = 'Street address is required (at least 3 characters).';
        }
        if (!trimmedCity || trimmedCity.length < 2) {
            errs.city = 'City is required.';
        }
        if (!trimmedState || trimmedState.length < 2) {
            errs.state = 'State / Province is required.';
        }
        if (!trimmedPostal || trimmedPostal.length < 3) {
            errs.postalCode = 'Postal / Zip code is required (at least 3 characters).';
        }
        if (!isAuthenticated && saveAccount && (!password || password.length < 6)) {
            errs.password = 'Password must be at least 6 characters.';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if (step === 1 && validateStep1()) {
            setStep(2);
            window.scrollTo(0, 0);
        }
        else if (step === 2 && validateStep2()) {
            setStep(3);
            window.scrollTo(0, 0);
        }
    };

    const handleSelectAddress = (addr) => {
        setSelectedAddressId(addr.id);
        setIsAddingNewAddress(false);
        setStreet(addr.street || '');
        setApartment(addr.apartment || '');
        setCity(addr.city || '');
        setState(addr.state || '');
        setPostalCode(addr.postalCode || '');
        setCountry(addr.country || 'United States');
        if (addr.fullName) setFullName(addr.fullName);
        if (addr.phone) setPhone(addr.phone);
    };

    const handleCompleteOrder = async () => {
        if (!validateStep1() || !validateStep2()) {
            return;
        }
        setIsSubmitting(true);
        const finalAddress = {
            id: `addr-${Date.now()}`,
            title: isAddingNewAddress ? 'New Address' : 'Delivery Address',
            fullName: (fullName || '').trim(),
            street: (street || '').trim(),
            apartment: (apartment || '').trim(),
            city: (city || '').trim(),
            state: (state || '').trim(),
            postalCode: (postalCode || '').trim(),
            country: (country || '').trim() || 'United States',
            phone: (phone || '').trim(),
            isDefault: false,
        };

        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const orderNumber = `GF-${randomNum}`;

        // If guest requested account creation on checkout
        if (!isAuthenticated && saveAccount && password) {
            try {
                await register({
                    email: (email || '').trim(),
                    password,
                    name: (fullName || '').trim(),
                    phone: (phone || '').trim(),
                    address: finalAddress,
                    orderNumber,
                });
            } catch {
                // Continue order completion even if registration API errors
            }
        } else if (isAuthenticated && isAddingNewAddress && saveAddressToAccount) {
            try {
                await addAddress(finalAddress);
            } catch {
                // Ignore address book errors
            }
        }

        setTimeout(() => {
            const orderItems = (items || []).map((i) => ({
                productId: i?.product?.id,
                name: i?.product?.name || 'Product',
                price: i?.product?.price || 0,
                quantity: i?.quantity || 1,
                image: i?.product?.images?.[0] || i?.product?.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
                variant: [i?.selectedColor, i?.selectedSize, i?.selectedConfig].filter(Boolean).join(' / ') || undefined,
            }));
            const newOrder = createOrder({
                orderNumber,
                customer: {
                    id: user?.id || (isAuthenticated ? 'usr-auth' : 'guest'),
                    name: finalAddress.fullName,
                    email: (email || '').trim(),
                    phone: finalAddress.phone,
                },
                items: orderItems,
                subtotal,
                discount,
                couponCode: appliedCoupon?.code,
                shipping,
                tax,
                total,
                status: 'processing',
                paymentStatus: 'paid',
                paymentMethod: paymentMethod === 'apple_pay'
                    ? 'Apple Pay (Demo)'
                    : paymentMethod === 'demo_instant'
                        ? 'Instant 1-Click Demo'
                        : 'Credit Card •••• 4242',
                shippingAddress: finalAddress,
            });
            clearCart();
            setIsSubmitting(false);
            navigate(`/order-confirmation/${newOrder?.orderNumber || orderNumber}`);
        }, 1000);
    };

    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Checkout Progress Stepper */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-primary font-bold' : ''}`}>
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-muted-foreground'}`}>
              1
            </span>
            <span>Contact</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground"/>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-primary font-bold' : ''}`}>
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-muted-foreground'}`}>
              2
            </span>
            <span>Shipping & Delivery</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground"/>
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-primary font-bold' : ''}`}>
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-muted-foreground'}`}>
              3
            </span>
            <span>Payment & Review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Step Form Content */}
        <div className="lg:col-span-7 space-y-6">
          {/* Split-Path Authentication Prompt (Touchpoint 3) */}
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 text-xs shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Already have a GoodFind account?</p>
                  <p className="text-muted-foreground text-[11px]">Sign in for 1-click address auto-fill and express checkout.</p>
                </div>
              </div>
              <Button
                type="button"
                variant="brand"
                size="sm"
                onClick={() => openAuthModal('login')}
                className="h-8 text-xs font-semibold px-4 rounded-xl shadow-sm shrink-0"
              >
                Sign In
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  Authenticated as <strong className="text-foreground">{user?.name}</strong> ({user?.email}) • Saved profile loaded
                </span>
              </div>
            </div>
          )}

          {/* Step 1: Customer Contact */}
          {step === 1 && (<div className="p-6 rounded-3xl border bg-card shadow-soft space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-foreground">Contact Information</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  We will dispatch order updates and digital receipts to this email.
                </p>
              </div>

              <form onSubmit={handleNextStep} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Email Address
                  </label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} placeholder="alex@domain.com" required/>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Full Legal Name
                    </label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} placeholder="Alexandria Morgan" required/>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Phone Number
                    </label>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} placeholder="+1 (555) 000-0000" required/>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t">
                  <Link to="/cart" className="text-xs text-muted-foreground hover:underline">
                    ← Return to Shopping Bag
                  </Link>
                  <Button type="submit" variant="brand" className="gap-2">
                    <span>Continue to Shipping</span>
                    <ArrowRight className="h-4 w-4"/>
                  </Button>
                </div>
              </form>
            </div>)}

          {/* Step 2: Shipping Address & Delivery Option */}
          {step === 2 && (<div className="p-6 rounded-3xl border bg-card shadow-soft space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-foreground">Delivery Address & Method</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Where should our courier dispatch your objects?
                </p>
              </div>

              <form onSubmit={handleNextStep} className="space-y-4">
                {/* Saved Address Book Selector (Authenticated) */}
                {isAuthenticated && addresses && addresses.length > 0 && (
                  <div className="space-y-3 pb-2 border-b">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                        Saved Shipping Addresses
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewAddress(!isAddingNewAddress);
                          if (!isAddingNewAddress) {
                            setSelectedAddressId('new');
                            setStreet('');
                            setApartment('');
                            setCity('');
                            setState('');
                            setPostalCode('');
                          } else {
                            const def = addresses.find((a) => a.isDefault) || addresses[0];
                            if (def) handleSelectAddress(def);
                          }
                        }}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{isAddingNewAddress ? 'Use Saved Address' : '+ Add New Address'}</span>
                      </button>
                    </div>

                    {!isAddingNewAddress && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {addresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.id;
                          return (
                            <div
                              key={addr.id}
                              onClick={() => handleSelectAddress(addr)}
                              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                                  : 'border-border/60 hover:border-border hover:bg-muted/30'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                    isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
                                  }`}>
                                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                  </div>
                                  <span className="text-xs font-bold text-foreground">{addr.title || 'Address'}</span>
                                </div>
                                {addr.isDefault && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-muted-foreground space-y-0.5 pl-6">
                                <p className="font-semibold text-foreground">{addr.fullName}</p>
                                <p>{addr.street} {addr.apartment}</p>
                                <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Address Fields (Guest OR Adding New Address) */}
                {(!isAuthenticated || isAddingNewAddress || !addresses || addresses.length === 0) && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {isAuthenticated && isAddingNewAddress && (
                      <div className="p-3 bg-muted/40 rounded-xl text-xs text-muted-foreground">
                        Entering a new delivery destination for this shipment:
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Street Address
                      </label>
                      <Input value={street} onChange={(e) => setStreet(e.target.value)} error={errors.street} placeholder="450 West 14th Street" required/>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Apartment, Suite, Unit (Optional)
                      </label>
                      <Input value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="Suite 8B"/>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                          City
                        </label>
                        <Input value={city} onChange={(e) => setCity(e.target.value)} error={errors.city} placeholder="New York" required/>
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                          State / Region
                        </label>
                        <Input value={state} onChange={(e) => setState(e.target.value)} error={errors.state} placeholder="NY" required/>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                          ZIP / Postal Code
                        </label>
                        <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} error={errors.postalCode} placeholder="10014" required/>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Country
                      </label>
                      <Select value={country} onChange={(e) => setCountry(e.target.value)}>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Germany">Germany</option>
                        <option value="Japan">Japan</option>
                      </Select>
                    </div>

                    {/* Path B: Guest Account Creation Checkbox */}
                    {!isAuthenticated && (
                      <div className="pt-3 border-t">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={saveAccount}
                            onChange={(e) => setSaveAccount(e.target.checked)}
                            className="mt-0.5 rounded border-muted-foreground text-primary focus:ring-primary h-4 w-4"
                          />
                          <div>
                            <p className="text-xs font-bold text-foreground">Save my information for faster checkout next time</p>
                            <p className="text-[11px] text-muted-foreground">Create a GoodFind account to auto-fill shipping details and track orders in 1 click.</p>
                          </div>
                        </label>

                        {saveAccount && (
                          <div className="mt-3 pl-6 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            <label className="text-xs font-semibold text-foreground block">
                              Create a Password <span className="text-muted-foreground font-normal">(min 6 characters)</span>
                            </label>
                            <div className="relative max-w-sm">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                              <Input
                                type="password"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-8 h-9 text-xs"
                                required={saveAccount}
                              />
                            </div>
                            {errors.password && (
                              <p className="text-[11px] text-destructive font-medium">{errors.password}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Authenticated Checkbox: Save new address to address book */}
                    {isAuthenticated && isAddingNewAddress && (
                      <div className="pt-3 border-t">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={saveAddressToAccount}
                            onChange={(e) => setSaveAddressToAccount(e.target.checked)}
                            className="rounded border-muted-foreground text-primary focus:ring-primary h-4 w-4"
                          />
                          <span className="text-xs font-semibold text-foreground">
                            Save this address to my GoodFind address book
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* Delivery Speeds */}
                <div className="pt-4 border-t space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Select Shipping Speed
                  </label>
                  <div className="space-y-2">
                    <label onClick={() => setShippingMethod('standard')} className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${shippingMethod === 'standard'
                ? 'border-primary bg-primary/5'
                : 'hover:bg-muted/40'}`}>
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-primary"/>
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            Standard Insured Delivery (2-4 Business Days)
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Carbon-neutral freight with tracking link
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {baseShipping === 0 ? 'Free' : formatPrice(baseShipping)}
                      </span>
                    </label>

                    <label onClick={() => setShippingMethod('express')} className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${shippingMethod === 'express'
                ? 'border-primary bg-primary/5'
                : 'hover:bg-muted/40'}`}>
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-foreground"/>
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            Priority Overnight Air (Next Business Day)
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Guaranteed delivery with morning signature
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {formatPrice(baseShipping + 15)}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t">
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-muted-foreground hover:underline">
                    ← Back to Contact
                  </button>
                  <Button type="submit" variant="brand" className="gap-2">
                    <span>Continue to Payment</span>
                    <ArrowRight className="h-4 w-4"/>
                  </Button>
                </div>
              </form>
            </div>)}

          {/* Step 3: Payment & Final Review */}
          {step === 3 && (<div className="p-6 rounded-3xl border bg-card shadow-soft space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-foreground">Select Payment Method</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  All transactions are secure and encrypted.
                </p>
              </div>

              {/* Frontend Demo Banner */}
              <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-border flex items-start gap-3 text-xs text-foreground">
                <Info className="h-4 w-4 shrink-0 text-foreground mt-0.5"/>
                <div>
                  <span className="font-bold">Frontend Demonstration Mode:</span>
                  <p className="mt-0.5 text-muted-foreground">
                    No real credit cards or financial charges occur. This simulation generates an authenticated demo order, deducts mock inventory, and triggers tracking milestones.
                  </p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label onClick={() => setPaymentMethod('card')} className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'hover:bg-muted/40'}`}>
                  <CreditCard className="h-5 w-5 text-primary shrink-0 mt-0.5"/>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Credit or Debit Card</span>
                      <span className="text-[10px] text-muted-foreground font-mono">Visa / Mastercard / Amex</span>
                    </div>

                    {paymentMethod === 'card' && (<div className="space-y-3 pt-2">
                        <div>
                          <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                            Card Number
                          </label>
                          <Input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="h-9 text-xs"/>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                              Expiry
                            </label>
                            <Input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="h-9 text-xs"/>
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                              CVC
                            </label>
                            <Input value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} className="h-9 text-xs"/>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </label>

                <label onClick={() => setPaymentMethod('apple_pay')} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-colors ${paymentMethod === 'apple_pay' ? 'border-primary bg-primary/5' : 'hover:bg-muted/40'}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-8 rounded bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                      
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Apple Pay</p>
                      <p className="text-[11px] text-muted-foreground">Touch ID or Face ID biometric payment</p>
                    </div>
                  </div>
                  {paymentMethod === 'apple_pay' && <CheckCircle2 className="h-4 w-4 text-primary"/>}
                </label>

                <label onClick={() => setPaymentMethod('demo_instant')} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-colors ${paymentMethod === 'demo_instant' ? 'border-primary bg-primary/5' : 'hover:bg-muted/40'}`}>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-foreground"/>
                    <div>
                      <p className="text-xs font-bold text-foreground">Express 1-Click Checkout</p>
                      <p className="text-[11px] text-muted-foreground">Instant automated fulfillment verification</p>
                    </div>
                  </div>
                  {paymentMethod === 'demo_instant' && <CheckCircle2 className="h-4 w-4 text-primary"/>}
                </label>
              </div>

              {/* Complete Order Button */}
              <div className="pt-4 border-t space-y-3">
                <Button onClick={handleCompleteOrder} isLoading={isSubmitting} variant="brand" className="w-full h-12 text-sm font-semibold shadow-lg gap-2">
                  <Lock className="h-4 w-4"/>
                  <span>Authorize & Place Order ({formatPrice(total)})</span>
                </Button>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <button type="button" onClick={() => setStep(2)} className="hover:underline">
                    ← Edit Shipping Details
                  </button>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-foreground"/>
                    256-Bit SSL Encrypted
                  </span>
                </div>
              </div>
            </div>)}
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 p-6 rounded-3xl border bg-card/60 shadow-soft space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-base text-foreground">
              Order Review ({items.length} items)
            </h3>
            <Link to="/cart" className="text-xs text-primary hover:underline">
              Edit Bag
            </Link>
          </div>

          {/* Item thumbnails list */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {(items || []).map((item) => (<div key={item?.id || Math.random()} className="flex items-center gap-3">
                <div className="relative">
                  <img src={item?.product?.images?.[0] || item?.product?.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'} alt={item?.product?.name || 'Item'} onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80';
            }} className="h-12 w-12 rounded-lg object-contain p-1 border bg-zinc-50 dark:bg-zinc-900/40"/>
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {item?.quantity || 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {item?.product?.name || 'Item'}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {[item?.selectedColor, item?.selectedSize, item?.selectedConfig].filter(Boolean).join(' • ') || item?.product?.brand || ''}
                  </p>
                </div>
                <span className="text-xs font-bold text-foreground">
                  {formatPrice((item?.product?.price || 0) * (item?.quantity || 1))}
                </span>
              </div>))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs border-t pt-4">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (<div className="flex justify-between text-foreground font-medium">
                <span>Promotional Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>)}
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping ({shippingMethod === 'express' ? 'Priority Air' : 'Standard'})</span>
              <span className="text-foreground font-medium">
                {shipping === 0 ? <span>Free</span> : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Estimated Sales Tax</span>
              <span className="text-foreground font-medium">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-foreground border-t pt-3">
              <span>Total Payment</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="p-3 bg-muted/40 rounded-xl text-[11px] text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-foreground shrink-0"/>
            <span>30-day money-back guarantee with complimentary prepaid return labels.</span>
          </div>
        </div>
      </div>
    </div>);
}
