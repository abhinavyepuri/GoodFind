import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ShoppingBag,
  Heart,
  Package,
  MapPin,
  LogOut,
  User,
  ShieldCheck,
  ChevronRight,
  Plus,
  Compass,
  RotateCcw,
  Headphones,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { formatPrice } from '@/lib/utils';

export function AccountDropdown({ isOpen, onToggle, onClose }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const addItemToCart = useCartStore((state) => state.addItem);
  const { products } = useProductStore();

  // Curated items for "Buy it again"
  const quickItems = React.useMemo(() => {
    return products.slice(0, 3);
  }, [products]);

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  return (
    <div
      className="relative"
      onMouseEnter={onToggle}
      onMouseLeave={onClose}
    >
      {/* Trigger Button (Top Bar Style) */}
      <button
        type="button"
        onClick={() => {
          if (!isAuthenticated) {
            navigate('/auth?tab=login');
          } else {
            onToggle();
          }
        }}
        className="flex flex-col text-left px-2 py-1 rounded-lg text-foreground hover:bg-muted/70 transition-all cursor-pointer group"
        aria-label="Account and Lists"
        aria-expanded={isOpen}
      >
        <span className="text-[11px] text-muted-foreground leading-tight truncate max-w-[120px]">
          {isAuthenticated ? `Hello, ${firstName}` : 'Hello, sign in'}
        </span>
        <div className="flex items-center gap-0.5">
          <span className="text-xs font-bold text-foreground leading-tight">
            Account & Lists
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-hover:translate-y-0.5" />
        </div>
      </button>

      {/* Safe hover bridge */}
      {isOpen && (
        <div className="absolute -bottom-2.5 left-0 right-0 h-4 z-40" />
      )}

      {/* Amazon-Style Rich Dropdown Popover in Stylish Solid Black */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 w-[760px] max-w-[94vw] rounded-3xl border border-white/10 bg-[#0d1117] text-white shadow-2xl p-5 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150"
          onMouseEnter={onToggle}
        >
          {/* Top Header / Profile Banner */}
          {!isAuthenticated ? (
            <div className="pb-4 mb-4 border-b border-white/10 text-center space-y-2">
              <Link
                to="/auth?tab=login"
                onClick={onClose}
                className="inline-block w-48 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-extrabold text-xs shadow-md transition-colors text-center"
              >
                Sign in
              </Link>
              <p className="text-[11px] text-zinc-400">
                New customer?{' '}
                <Link
                  to="/auth?tab=register"
                  onClick={onClose}
                  className="text-white font-bold hover:underline"
                >
                  Start here.
                </Link>
              </p>
            </div>
          ) : (
            <div className="pb-3 mb-3 border-b border-white/10 flex items-center justify-between bg-white/5 -mx-5 -mt-5 p-4 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white text-zinc-950 font-black text-sm flex items-center justify-center">
                  {firstName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Who is shopping? <span className="font-semibold text-zinc-300">{user?.name}</span>
                  </p>
                  <p className="text-[11px] text-zinc-400">{user?.email}</p>
                </div>
              </div>
              <Link
                to="/account/orders"
                onClick={onClose}
                className="text-xs font-bold text-white hover:underline flex items-center gap-1 border border-white/20 bg-white/5 px-3 py-1 rounded-lg"
              >
                <span>Manage Profile</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* 3-Column Layout in Stylish Black */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
            {/* Column 1: "Buy it again" */}
            <div className="md:col-span-5 pr-2 md:border-r border-white/10 space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                <span className="font-extrabold text-xs text-white">Buy it again</span>
                <Link
                  to="/catalog"
                  onClick={onClose}
                  className="text-[11px] text-zinc-400 hover:text-white font-semibold transition-colors"
                >
                  View All & Manage
                </Link>
              </div>

              <div className="space-y-3 pt-1">
                {quickItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 group">
                    <img
                      src={item.image || item.images?.[0]}
                      alt={item.name}
                      className="h-12 w-12 rounded-xl object-cover border border-white/10 bg-white/5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={onClose}
                        className="font-medium text-zinc-200 hover:text-white text-[11px] line-clamp-1 block leading-tight"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[11px] font-bold text-white mt-0.5">
                        {formatPrice(item.price)}
                      </p>
                      <button
                        type="button"
                        onClick={() => addItemToCart(item, 1)}
                        className="mt-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white text-white hover:text-zinc-950 font-bold text-[10px] transition-colors inline-flex items-center gap-1 border border-white/20 shadow-xs cursor-pointer"
                      >
                        <Plus className="h-2.5 w-2.5" />
                        <span>Add to cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: "Your Lists" */}
            <div className="md:col-span-3 pr-2 md:border-r border-white/10 space-y-2">
              <p className="font-extrabold text-xs text-white pb-1.5 border-b border-white/10">
                Your Lists
              </p>
              <ul className="space-y-2 text-zinc-300">
                <li>
                  <Link
                    to="/wishlist"
                    onClick={onClose}
                    className="hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span>Shopping Wishlist</span>
                    {wishlistItems.length > 0 && (
                      <span className="bg-white/15 text-white px-2 py-0.5 rounded-full font-bold text-[10px]">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wishlist"
                    onClick={onClose}
                    className="hover:text-white transition-colors block"
                  >
                    Create a Wish List
                  </Link>
                </li>
                <li>
                  <Link
                    to="/catalog?featured=true"
                    onClick={onClose}
                    className="hover:text-white transition-colors block"
                  >
                    Discover Your Style
                  </Link>
                </li>
                <li>
                  <Link
                    to="/catalog"
                    onClick={onClose}
                    className="hover:text-white transition-colors block"
                  >
                    Explore Showroom
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: "Your Account" */}
            <div className="md:col-span-4 space-y-2">
              <p className="font-extrabold text-xs text-white pb-1.5 border-b border-white/10">
                Your Account
              </p>
              <ul className="space-y-1.5 text-zinc-300">
                <li>
                  <Link
                    to="/account/orders"
                    onClick={onClose}
                    className="hover:text-white font-medium transition-colors block"
                  >
                    Your Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account/orders"
                    onClick={onClose}
                    className="hover:text-white transition-colors block font-medium"
                  >
                    Your Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account/orders?tab=addresses"
                    onClick={onClose}
                    className="hover:text-white transition-colors block"
                  >
                    Your Addresses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wishlist"
                    onClick={onClose}
                    className="hover:text-white transition-colors block"
                  >
                    Your Wish List
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account/orders?tab=returns"
                    onClick={onClose}
                    className="hover:text-white transition-colors block"
                  >
                    Returns & Replacements
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    onClick={onClose}
                    className="hover:text-white transition-colors block"
                  >
                    Customer Service
                  </Link>
                </li>

                {isAuthenticated && (
                  <li className="pt-2 border-t border-white/10 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        logout();
                      }}
                      className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 w-full text-left"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AccountDropdown;
