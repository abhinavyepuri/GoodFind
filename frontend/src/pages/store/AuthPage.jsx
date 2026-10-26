import * as React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Box,
  Truck,
  RotateCcw,
  Sun,
  Moon,
  Coins,
  MapPin,
  Check,
  Sliders,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { usePreferenceStore } from '@/store/preferenceStore';

const CATEGORY_CHOICES = [
  { id: 'electronics', label: 'Pro Audio & Tech' },
  { id: 'fashion', label: 'Minimalist Apparel' },
  { id: 'home-living', label: 'Architectural Furniture' },
  { id: 'beauty', label: 'Organic Care' },
  { id: 'pantry', label: 'Specialty Coffee' },
  { id: 'books-stationery', label: 'Design Books' },
];

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tabParam = searchParams.get('tab');
  const redirectParam = searchParams.get('redirect') || '/account/orders';

  const [activeTab, setActiveTab] = React.useState(
    tabParam === 'register' ? 'register' : 'login'
  );
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [error, setError] = React.useState('');

  // Onboarding Personalization State (Req 5.vi)
  // 'address' | 'preferences' | null
  const [onboardingStep, setOnboardingStep] = React.useState(null);
  const [street, setStreet] = React.useState('');
  const [city, setCity] = React.useState('');
  const [stateName, setStateName] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');
  const [country, setCountry] = React.useState('India');
  const [selectedCategories, setSelectedCategories] = React.useState(['electronics', 'home-living']);

  const { login, register, isLoading, isAuthenticated, user, logout, addAddress } = useAuthStore();
  const { theme, toggleTheme, setTheme } = useThemeStore();
  const { currency, setCurrency } = usePreferenceStore();

  // 3D Card tilt state with fluid container physics and input weight (Req 5.i)
  const containerRef = React.useRef(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [inputWeight, setInputWeight] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleContainerMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Fluid smooth rotation angle
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleContainerMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setInputWeight({ x: 0, y: 0 });
  };

  // Text inputs contribute weight to card tilt
  const handleInputFocus = (fieldWeight) => {
    setInputWeight(fieldWeight);
  };

  const handleInputBlur = () => {
    setInputWeight({ x: 0, y: 0 });
  };

  const charCount = (name.length + email.length + password.length);
  const depthZ = Math.min(charCount * 0.15, 8);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (activeTab === 'register') {
      if (!agreeTerms) {
        setError('Please agree to the Terms of Service and Privacy Policy to continue.');
        return;
      }

      const res = await register({
        email: cleanEmail,
        password,
        name: name.trim() || cleanEmail.split('@')[0],
        phone: phone.trim(),
      });
      if (res.success) {
        // Trigger onboarding flow (Req 5.vi)
        setOnboardingStep('address');
      } else {
        setError(res.error || 'Failed to create account.');
      }
    } else {
      const res = await login(cleanEmail, password);
      if (res.success) {
        navigate(redirectParam);
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    }
  };

  const handleSaveAddressAndContinue = async (e) => {
    e?.preventDefault();
    if (street.trim() && city.trim()) {
      await addAddress({
        name: name.trim() || user?.name || 'Member',
        street: street.trim(),
        city: city.trim(),
        state: stateName.trim() || 'IN',
        postalCode: postalCode.trim() || '500001',
        country: country.trim() || 'India',
        phone: phone.trim() || '+91 98765 43210',
        isDefault: true,
      });
    }
    setOnboardingStep('preferences');
  };

  const handleFinishOnboarding = () => {
    setOnboardingStep(null);
    navigate(redirectParam);
  };

  const handleSkipOnboarding = () => {
    setOnboardingStep(null);
    navigate(redirectParam);
  };

  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleContainerMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleContainerMouseLeave}
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background"
    >
      {/* 3D Ambient Glowing Background Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-zinc-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 3D Perspective Canvas Container */}
      <div className="w-full max-w-md relative z-10" style={{ perspective: 1200 }}>
        {/* =========================================================================
            ONBOARDING STEP 1: Shipping Address (Req 5.vi)
           ========================================================================= */}
        {onboardingStep === 'address' ? (
          <div className="rounded-3xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Shipping Address</h2>
                  <p className="text-[11px] text-muted-foreground">Step 1 of 2: Save your primary delivery address</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSkipOnboarding}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Skip
              </button>
            </div>

            <form onSubmit={handleSaveAddressAndContinue} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Street Address
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. 42 Jubilee Hills, Road No. 36"
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Hyderabad"
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. Telangana"
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Postal / PIN Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 500033"
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setOnboardingStep('preferences')}
                  className="py-2.5 px-4 rounded-xl border border-border text-xs font-bold hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  Skip Address
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        ) : onboardingStep === 'preferences' ? (
          /* =========================================================================
              ONBOARDING STEP 2: Preferences & Category Customization (Req 5.vi)
             ========================================================================= */
          <div className="rounded-3xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold">
                  <Sliders className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Personalize Experience</h2>
                  <p className="text-[11px] text-muted-foreground">Step 2 of 2: Set your theme, currency, and tastes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSkipOnboarding}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Skip
              </button>
            </div>

            <div className="space-y-4">
              {/* Theme Preference */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Appearance Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'border-primary bg-primary/10 text-primary shadow-xs'
                        : 'border-border hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    <span>Light Mode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/10 text-primary shadow-xs'
                        : 'border-border hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </div>

              {/* Currency Preference */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Store Currency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'INR', label: '₹ INR' },
                    { code: 'USD', label: '$ USD' },
                    { code: 'EUR', label: '€ EUR' },
                  ].map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => setCurrency(curr.code)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        currency === curr.code
                          ? 'border-primary bg-primary/10 text-primary shadow-xs'
                          : 'border-border hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      {curr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Shopping Categories */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Categories You Love
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_CHOICES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                            : 'border-border bg-background hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Final */}
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="w-full mt-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-md cursor-pointer"
              >
                <span>Save Preferences & Start Shopping</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : isAuthenticated ? (
          /* =========================================================================
              ALREADY AUTHENTICATED CARD VIEW
             ========================================================================= */
          <div
            style={{
              transform: `rotateX(${tilt.x + inputWeight.y}deg) rotateY(${tilt.y + inputWeight.x}deg) translateZ(${depthZ}px)`,
              transition: isHovered
                ? 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                : 'transform 0.5s ease-out',
              transformStyle: 'preserve-3d',
            }}
            className="rounded-3xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl p-8 text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground font-black text-2xl mx-auto flex items-center justify-center shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-foreground">
                You're Signed In as {user?.name}
              </h2>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/account/orders"
                className="p-3 rounded-xl border border-border hover:bg-muted font-bold text-xs flex flex-col items-center gap-1.5 transition-colors"
              >
                <Box className="h-4 w-4 text-primary" />
                <span>Your Orders</span>
              </Link>
              <Link
                to="/account/orders?tab=addresses"
                className="p-3 rounded-xl border border-border hover:bg-muted font-bold text-xs flex flex-col items-center gap-1.5 transition-colors"
              >
                <Truck className="h-4 w-4 text-primary" />
                <span>Saved Addresses</span>
              </Link>
            </div>

            <button
              onClick={logout}
              className="w-full py-2.5 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 font-bold text-xs transition-colors cursor-pointer"
            >
              Sign Out from this Device
            </button>
          </div>
        ) : (
          /* =========================================================================
              MAIN 3D FLUID TILT AUTH CARD (Req 5.i, 5.ii, 5.iii, 5.vi)
             ========================================================================= */
          <div
            style={{
              transform: `rotateX(${tilt.x + inputWeight.y}deg) rotateY(${tilt.y + inputWeight.x}deg) translateZ(${depthZ}px)`,
              transition: isHovered
                ? 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                : 'transform 0.5s ease-out',
              transformStyle: 'preserve-3d',
            }}
            className="rounded-3xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
          >
            {/* Header Brand */}
            <div className="text-center space-y-1.5">
              <Link to="/" className="inline-block">
                <span className="font-black text-2xl tracking-tighter text-foreground font-sans">
                  GOODFIND<span className="text-primary font-serif">.</span>
                </span>
              </Link>
              <h1 className="text-lg font-bold text-foreground">
                {activeTab === 'login' ? 'Sign into your account' : 'Create your GoodFind profile'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {activeTab === 'login'
                  ? 'Access your orders, address book, and wishlist across devices.'
                  : 'Get faster checkout, track shipments, and unlock member savings.'}
              </p>
            </div>

            {/* Tab Pill Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-muted border border-border">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError('');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setError('');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold animate-in fade-in">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'register' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => handleInputFocus({ x: -2, y: -2 })}
                        onBlur={handleInputBlur}
                        placeholder="e.g. Alex Morgan"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Mobile Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={() => handleInputFocus({ x: 2, y: -1 })}
                        onBlur={handleInputBlur}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => handleInputFocus({ x: 0, y: 1 })}
                    onBlur={handleInputBlur}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => handleInputFocus({ x: 0, y: 3 })}
                    onBlur={handleInputBlur}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Terms of Service Tickbox (Req 5.vi) */}
              {activeTab === 'register' && (
                <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-border cursor-pointer h-4 w-4 accent-primary"
                  />
                  <span>
                    I agree to GoodFind's{' '}
                    <Link to="/terms" className="text-foreground underline font-semibold hover:text-primary">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-foreground underline font-semibold hover:text-primary">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={isLoading || (activeTab === 'register' && !agreeTerms)}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                <span>
                  {isLoading
                    ? 'Verifying...'
                    : activeTab === 'login'
                    ? 'Sign In to GoodFind'
                    : 'Create Account & Continue'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
