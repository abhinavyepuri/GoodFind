import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Sun, Moon, Menu, X, ChevronDown, ArrowRight, Package, User, LogOut, MapPin } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useThemeStore } from '@/store/themeStore';
import { useProductStore } from '@/store/productStore';
import { useAuthStore } from '@/store/authStore';
import { SearchModal } from '@/components/search/SearchModal';
import { MiniCartSheet } from '@/components/cart/MiniCartSheet';
import { AuthModal } from '@/components/auth/AuthModal';
import { formatPrice } from '@/lib/utils';
export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = React.useState(null);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = React.useState(false);
    const location = useLocation();
    const openCart = useCartStore((state) => state.openCart);
    const cartItemCount = useCartStore((state) => state.getItemCount());
    const cartSubtotal = useCartStore((state) => state.getSubtotal());
    const wishlistItems = useWishlistStore((state) => state.items);
    const { theme, toggleTheme } = useThemeStore();
    const { categories } = useProductStore();
    const { user, isAuthenticated, openAuthModal, logout, initAuth } = useAuthStore();

    React.useEffect(() => {
        initAuth();
    }, [initAuth]);

    // Close menus on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveMegaMenu(null);
        setIsAccountMenuOpen(false);
    }, [location.pathname]);
    return (<>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-2">
          {/* Left: Mobile hamburger + Luxury Brand Wordmark */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Toggle Navigation Menu">
              {isMobileMenuOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
            </button>

            <Link to="/" className="flex items-center gap-2 group tracking-tight">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tighter text-foreground font-sans">
                GOODFIND<span>.</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-muted-foreground border-l border-border/80 pl-2.5 ml-1 hidden sm:inline">
                Store
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links with Mega Menu */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <Link to="/catalog" className={`px-3 py-1.5 rounded-md transition-colors hover:text-foreground hover:bg-muted/60 ${location.pathname === '/catalog'
            ? 'text-foreground font-bold bg-muted'
            : 'text-muted-foreground'}`}>
              All Catalog
            </Link>

            {categories.slice(0, 4).map((cat) => (<div key={cat.id} className="relative" onMouseEnter={() => setActiveMegaMenu(cat.id)} onMouseLeave={() => setActiveMegaMenu(null)}>
                <Link to={`/category/${cat.slug}`} className={`px-3 py-1.5 rounded-md transition-colors hover:text-foreground hover:bg-muted/60 flex items-center gap-1 ${location.pathname === `/category/${cat.slug}`
                ? 'text-foreground font-bold bg-muted'
                : 'text-muted-foreground'}`}>
                  <span>{cat.name.split('&')[0].trim()}</span>
                  <ChevronDown className="h-3 w-3 opacity-60"/>
                </Link>

                {/* Editorial Mega Dropdown Preview */}
                {activeMegaMenu === cat.id && (<div className="absolute top-full left-0 mt-1 w-80 rounded-xl border bg-background/98 backdrop-blur-xl p-4 shadow-2xl z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {cat.name}
                        </span>
                        <Link to={`/category/${cat.slug}`} className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1">
                          View All ({cat.productCount}) <ArrowRight className="h-3 w-3"/>
                        </Link>
                      </div>

                      <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted group">
                        <img src={cat.image} alt={cat.name} onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80';
                }} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-white">
                          <span className="text-[10px] uppercase font-bold text-zinc-300">Curated Department</span>
                          <p className="text-xs font-semibold leading-tight">{cat.description}</p>
                        </div>
                      </div>

                      <div className="pt-1">
                        <Link to={`/category/${cat.slug}`} className="w-full py-1.5 text-xs font-semibold text-center rounded-md bg-muted hover:bg-muted/80 text-foreground block transition-colors">
                          Explore {cat.name.split('&')[0]} Collection →
                        </Link>
                      </div>
                    </div>
                  </div>)}
              </div>))}
          </nav>

          {/* Right: Currency, Search, Wishlist, Bag, Theme */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Currency Pill */}
            <span className="hidden xl:inline-flex items-center text-[11px] font-semibold text-muted-foreground px-2 py-1 rounded-md border bg-muted/30">
              INR (₹)
            </span>

            {/* Search Trigger Button */}
            <button onClick={() => setIsSearchOpen(true)} className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-md border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium transition-colors" aria-label="Search products">
              <Search className="h-4 w-4"/>
              <span className="hidden sm:inline">Search catalog...</span>
              <kbd className="hidden md:inline-block text-[10px] bg-background border px-1.5 py-0.5 rounded text-muted-foreground">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Toggle theme">
              {theme === 'dark' ? (<Sun className="h-4 w-4 text-zinc-100"/>) : (<Moon className="h-4 w-4 text-zinc-900"/>)}
            </button>

            {/* Wishlist Link */}
            <Link to="/wishlist" className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="View Wishlist" title="Saved Wishlist">
              <Heart className="h-4 w-4"/>
              {wishlistItems.length > 0 && (<span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[10px] font-bold flex items-center justify-center">
                  {wishlistItems.length}
                </span>)}
            </Link>

            {/* User Account / Sign In Dropdown (Touchpoint 1) */}
            <div className="relative" onMouseLeave={() => setIsAccountMenuOpen(false)}>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal('login');
                  } else {
                    setIsAccountMenuOpen(!isAccountMenuOpen);
                  }
                }}
                onMouseEnter={() => isAuthenticated && setIsAccountMenuOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Account navigation"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {isAuthenticated ? (user?.name?.split(' ')[0] || 'Account') : 'Sign In'}
                </span>
                {isAuthenticated && <ChevronDown className="h-3 w-3 opacity-60" />}
              </button>

              {/* Account Dropdown Menu */}
              {isAccountMenuOpen && isAuthenticated && (
                <div className="absolute right-0 top-full mt-1.5 w-60 rounded-2xl border bg-background/98 backdrop-blur-xl p-2 shadow-2xl z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-border/60 mb-1">
                    <p className="text-xs font-bold text-foreground truncate">{user?.name || 'Valued Customer'}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      to="/account/orders"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Package className="h-4 w-4 text-primary" />
                      <span>Orders & Tracking</span>
                    </Link>

                    <Link
                      to="/account/orders?tab=addresses"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>Saved Addresses</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Heart className="h-4 w-4 text-primary" />
                      <span>Saved Wishlist ({wishlistItems.length})</span>
                    </Link>
                  </div>

                  <div className="mt-1 pt-1 border-t border-border/60">
                    <button
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Flagship Cart Bag Button */}
            <button onClick={openCart} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 text-xs font-semibold shadow-sm transition-all" aria-label="Open Shopping Bag">
              <ShoppingBag className="h-3.5 w-3.5"/>
              <span>Bag ({cartItemCount})</span>
              {cartItemCount > 0 && (<span className="hidden sm:inline border-l border-zinc-700 dark:border-zinc-300 pl-2">
                  {formatPrice(cartSubtotal)}
                </span>)}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (<div className="md:hidden border-t bg-background p-4 space-y-4 animate-fade-in shadow-xl">
            {isAuthenticated ? (
              <div className="p-3 bg-muted/50 rounded-xl space-y-1">
                <p className="text-xs font-bold text-foreground">{user?.name}</p>
                <p className="text-[11px] text-muted-foreground">{user?.email}</p>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>Sign In or Create Account</span>
              </button>
            )}

            <div className="space-y-1">
              <Link to="/account/orders" className="block px-3 py-2 rounded-lg font-medium text-foreground hover:bg-muted">
                My Orders & Tracking
              </Link>
              <Link to="/account/orders?tab=addresses" className="block px-3 py-2 rounded-lg font-medium text-foreground hover:bg-muted">
                Saved Address Book
              </Link>
              <Link to="/catalog" className="block px-3 py-2 rounded-lg font-medium text-foreground hover:bg-muted">
                All Products Catalog
              </Link>
              {categories.map((c) => (<Link key={c.id} to={`/category/${c.slug}`} className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
                  {c.name}
                </Link>))}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 font-medium"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>)}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)}/>

      {/* Mini Cart Slide-out Drawer */}
      <MiniCartSheet />

      {/* Authentication Modal */}
      <AuthModal />
    </>);
}
