import * as React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  Sun,
  Moon,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Package,
  Filter,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { usePreferenceStore } from '@/store/preferenceStore';
import { SearchModal } from '@/components/search/SearchModal';
import { MiniCartSheet } from '@/components/cart/MiniCartSheet';
import { AuthModal } from '@/components/auth/AuthModal';
import { ShopifyProductsDropdown } from './ShopifyProductsDropdown';
import { AccountDropdown } from './AccountDropdown';
import { LocaleSelector } from './LocaleSelector';

export function Navbar() {
  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = React.useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchCategory, setSearchCategory] = React.useState('all');

  const location = useLocation();
  const navigate = useNavigate();

  const openCart = useCartStore((state) => state.openCart);
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistItems = useWishlistStore((state) => state.items);
  const { theme, toggleTheme } = useThemeStore();
  const { user, addresses, isAuthenticated, initAuth } = useAuthStore();

  React.useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Close menus on route navigation
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProductsDropdownOpen(false);
    setIsAccountDropdownOpen(false);
  }, [location.pathname]);

  // Default address for Deliver to widget
  const defaultAddress = React.useMemo(() => {
    return addresses.find((a) => a.isDefault) || addresses[0] || null;
  }, [addresses]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() && searchCategory === 'all') {
      navigate('/catalog');
      return;
    }
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (searchCategory !== 'all') params.set('category', searchCategory);
    navigate(`/catalog?${params.toString()}`);
  };

  const handleLocationClick = () => {
    if (isAuthenticated) {
      navigate('/account/orders?tab=addresses');
    } else {
      navigate('/auth?tab=login');
    }
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'You';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/98 backdrop-blur-xl transition-all shadow-xs select-none">
        <div className="max-w-[1540px] mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center justify-between gap-3 lg:gap-4">
          {/* =========================================================================
              LEFT: Mobile Toggle + Logo + Location Widget + Shopify Products Dropdown
             ========================================================================= */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-baseline gap-1 px-1.5 py-1 rounded-md hover:bg-muted/60 transition-colors group"
            >
              <span className="font-extrabold text-xl sm:text-2xl tracking-tighter text-foreground font-sans">
                GOODFIND<span className="text-primary font-serif">.</span>
              </span>
            </Link>

            {/* Deliver To Location Widget (Amazon Style) */}
            <button
              onClick={handleLocationClick}
              className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted text-left transition-colors cursor-pointer group"
              title="Change Delivery Location"
            >
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-2 transition-transform group-hover:scale-110" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground leading-tight">
                  {isAuthenticated ? `Deliver to ${firstName}` : 'Deliver to'}
                </span>
                <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[125px]">
                  {defaultAddress
                    ? `${defaultAddress.city || 'India'} ${defaultAddress.postalCode || ''}`
                    : 'Select location'}
                </span>
              </div>
            </button>

            {/* Shopify Products Dropdown (Requirement 1) */}
            <div className="hidden lg:block ml-1">
              <ShopifyProductsDropdown
                isOpen={isProductsDropdownOpen}
                onToggle={() => {
                  setIsProductsDropdownOpen(!isProductsDropdownOpen);
                  setIsAccountDropdownOpen(false);
                }}
                onClose={() => setIsProductsDropdownOpen(false)}
              />
            </div>
          </div>

          {/* =========================================================================
              CENTER: Funnel Filter Icon + Compact Highlighted Search Bar (Req 1.ii, 1.iii, 1.iv)
             ========================================================================= */}
          <div className="flex items-center gap-2 flex-1 max-w-md min-w-[180px]">
            {/* Funnel Filter Icon Button (Req 1.ii) */}
            <Link
              to="/catalog"
              className="h-10 w-10 flex items-center justify-center shrink-0 border-2 border-white bg-zinc-200/90 text-black shadow-xs dark:border-black dark:bg-zinc-800 dark:text-white transition-all hover:scale-105 active:scale-95"
              title="Filter Catalog"
              aria-label="Filter Catalog"
            >
              <Filter className="h-4.5 w-4.5 stroke-[2.2]" />
            </Link>

            {/* Highlighted Search Bar (Req 1.iv) */}
            <form
              onSubmit={handleSearch}
              className="flex-1 flex items-center h-10 rounded-xl border-2 border-zinc-900/40 dark:border-white/40 bg-card shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25 transition-all overflow-hidden px-3"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search GoodFind products, deals..."
                className="w-full h-full text-sm text-foreground placeholder:text-muted-foreground/80 bg-transparent focus:outline-none"
              />

              {/* Quick Search Shortcut Pill (Cmd+K) */}
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(true)}
                className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground bg-muted border border-border/80 rounded hover:text-foreground transition-colors shrink-0"
                title="Quick Search (⌘K)"
              >
                ⌘K
              </button>
            </form>
          </div>

          {/* =========================================================================
              RIGHT: Currency & Theme (Req 1.vi), Account (Req 2), Orders, Wishlist, Cart
             ========================================================================= */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Currency Selector & Theme Toggle moved together (Req 1.vi) */}
            <div className="hidden md:flex items-center gap-1">
              <LocaleSelector />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Toggle Dark/Light Mode"
                title="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 text-amber-300" />
                ) : (
                  <Moon className="h-4 w-4 text-zinc-700" />
                )}
              </button>
            </div>

            {/* Hello, "Name" / Account & Lists Dropdown (Requirement 2) */}
            <AccountDropdown
              isOpen={isAccountDropdownOpen}
              onToggle={() => {
                setIsAccountDropdownOpen(!isAccountDropdownOpen);
                setIsProductsDropdownOpen(false);
              }}
              onClose={() => setIsAccountDropdownOpen(false)}
            />

            {/* Returns & Orders Link (Amazon Style) */}
            <Link
              to="/account/orders"
              className="hidden lg:flex flex-col text-left px-2 py-1 rounded-md text-foreground hover:outline hover:outline-1 hover:outline-border transition-all"
              title="Returns & Orders"
            >
              <span className="text-[11px] text-muted-foreground leading-tight">Returns</span>
              <span className="text-xs font-bold text-foreground leading-tight">& Orders</span>
            </Link>

            {/* Wishlist Link with Active Badge (Requirement 5) */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Saved Wishlist"
              aria-label="View Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Button (Amazon Style - Requirement 6) */}
            <button
              onClick={openCart}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-foreground hover:outline hover:outline-1 hover:outline-border transition-all cursor-pointer relative group"
              aria-label="Open Shopping Cart"
            >
              {/* Trolley Icon with Badge directly on it */}
              <div className="relative flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-foreground group-hover:scale-105 transition-transform" />
                <span className="absolute -top-1.5 left-2.5 bg-amber-500 text-zinc-950 dark:bg-amber-400 text-[11px] font-black h-4.5 min-w-[18px] px-1 rounded-full flex items-center justify-center leading-none shadow-xs">
                  {cartItemCount}
                </span>
              </div>
              <span className="text-xs font-extrabold text-foreground leading-tight hidden sm:inline ml-0.5">
                Cart
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            MOBILE NAVIGATION DRAWER
           ========================================================================= */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur-xl p-4 space-y-4 animate-in fade-in shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* Mobile Auth Banner */}
            {isAuthenticated ? (
              <div className="p-3 bg-muted/60 rounded-xl space-y-1">
                <p className="text-xs font-bold text-foreground">Hello, {user?.name}</p>
                <p className="text-[11px] text-muted-foreground">{user?.email}</p>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 shadow-sm text-center"
              >
                Sign In or Create Account
              </Link>
            )}

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 pt-2">
                Browse Store
              </p>
              <Link
                to="/catalog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted rounded-lg"
              >
                All Products Catalog
              </Link>
              <Link
                to="/catalog?deals=true"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-muted rounded-lg"
              >
                Today's Deals
              </Link>
              <Link
                to="/catalog?bestsellers=true"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
              >
                Best Sellers
              </Link>
            </div>

            {/* Mobile Account & Tracking */}
            <div className="space-y-1 pt-2 border-t border-border">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 pt-1">
                Your Account
              </p>
              <Link
                to="/account/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
              >
                Returns & Orders
              </Link>
              <Link
                to="/account/orders?tab=addresses"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
              >
                Saved Addresses
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
              >
                Saved Wishlist ({wishlistItems.length})
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal (Cmd+K) */}
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />

      {/* Global Slide-out MiniCart */}
      <MiniCartSheet />

      {/* In-flow Auth Modal */}
      <AuthModal />
    </>
  );
}
export default Navbar;
