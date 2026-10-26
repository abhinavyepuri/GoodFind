import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ArrowRight,
  Headphones,
  Shirt,
  Armchair,
  Droplet,
  Coffee,
  BookOpen,
  Laptop,
  Flame,
  Award,
  TrendingUp,
  Tag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Layers,
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';

const CATEGORY_ICONS = {
  electronics: Headphones,
  fashion: Shirt,
  'home-living': Armchair,
  beauty: Droplet,
  pantry: Coffee,
  'books-stationery': BookOpen,
  digital: Laptop,
};

export function ShopifyProductsDropdown({ isOpen, onToggle, onClose }) {
  const { categories } = useProductStore();

  return (
    <div
      className="relative"
      onMouseEnter={onToggle}
      onMouseLeave={onClose}
    >
      {/* Trigger Button (Shopify Style) */}
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
          isOpen
            ? 'text-white bg-[#0d1117] border-white/20 shadow-md'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/70 border-transparent'
        }`}
        aria-expanded={isOpen}
      >
        <span>Products</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 opacity-70 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Safe hover bridge between button and dropdown */}
      {isOpen && (
        <div className="absolute -bottom-3 left-0 right-0 h-4 z-40" />
      )}

      {/* Mega Dropdown Panel (Shopify Style in Stylish Solid Black) */}
      {isOpen && (
        <div
          className="fixed left-0 right-0 top-[56px] mx-auto max-w-6xl w-[96vw] rounded-3xl border border-white/10 bg-[#0d1117] text-white shadow-2xl p-6 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150"
          onMouseEnter={onToggle}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Core Departments */}
            <div className="space-y-4">
              <div className="pb-1.5 border-b border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Departments
                </span>
                <span className="text-[10px] text-zinc-400 font-bold bg-white/10 px-2 py-0.5 rounded-full">
                  {categories.length} Collections
                </span>
              </div>
              <ul className="space-y-1">
                {categories.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.slug] || Layers;
                  return (
                    <li key={cat.id}>
                      <Link
                        to={`/category/${cat.slug}`}
                        onClick={onClose}
                        className="group flex items-start gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/15 text-zinc-200 shrink-0 border border-white/10 transition-colors">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-zinc-200 truncate">
                            {cat.name}
                          </p>
                          <p className="text-[11px] text-zinc-400 line-clamp-1 leading-tight">
                            {cat.description}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 2: Highlights & Deals */}
            <div className="space-y-4">
              <div className="pb-1.5 border-b border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Highlights & Deals
                </span>
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    to="/catalog?deals=true"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-white/10 text-zinc-200">
                      <Flame className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-zinc-200 transition-colors">
                        Today's Limited Deals
                      </p>
                      <p className="text-[11px] text-zinc-400">Up to 45% off top finds</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/catalog?bestsellers=true"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-white/10 text-zinc-200">
                      <Award className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-zinc-200 transition-colors">
                        Best Seller Classics
                      </p>
                      <p className="text-[11px] text-zinc-400">Highly rated by customers</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/catalog?trending=true"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-white/10 text-zinc-200">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-zinc-200 transition-colors">
                        Trending This Week
                      </p>
                      <p className="text-[11px] text-zinc-400">Fastest selling essentials</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/catalog?under=499"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-white/10 text-zinc-200">
                      <Tag className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-zinc-200 transition-colors">
                        Under ₹499 Pocket Deals
                      </p>
                      <p className="text-[11px] text-zinc-400">Quality everyday budgets</p>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: GoodFind Guarantees */}
            <div className="space-y-4">
              <div className="pb-1.5 border-b border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Our Standards
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <Truck className="h-4 w-4 text-zinc-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Complimentary Express</p>
                    <p className="text-[11px] text-zinc-400">Free delivery across India on ₹999+</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <RotateCcw className="h-4 w-4 text-zinc-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Hassle-Free Returns</p>
                    <p className="text-[11px] text-zinc-400">30-day doorstep pickups</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <ShieldCheck className="h-4 w-4 text-zinc-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Authenticity Guaranteed</p>
                    <p className="text-[11px] text-zinc-400">100% verified artisan origin</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4: Right Editorial Showcase Card */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 to-black text-white p-5 flex flex-col justify-between shadow-xl">
              <div className="space-y-2 relative z-10">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider">
                  Curated Editions
                </span>
                <h4 className="text-sm font-black tracking-tight">GoodFind Curated 2026</h4>
                <p className="text-[11px] text-zinc-300 leading-snug">
                  Hand-finished acoustic titanium, sustainable black walnut, and pure botanical harvests.
                </p>
              </div>

              <div className="my-3 relative rounded-xl overflow-hidden aspect-[16/9] border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
                  alt="Curated Collection"
                  className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-500"
                />
              </div>

              <Link
                to="/catalog"
                onClick={onClose}
                className="relative z-10 w-full py-2.5 px-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-extrabold text-xs text-center flex items-center justify-center gap-1.5 shadow transition-colors"
              >
                <span>Shop All Collections</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Bottom Bar in Mega Menu */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-zinc-400">
              <span className="font-bold text-white">⚡ Great Indian Festival Live</span>
              <span>•</span>
              <span>100% Secure Checkout</span>
              <span>•</span>
              <span>24/7 Concierge Support</span>
            </div>
            <Link
              to="/catalog"
              onClick={onClose}
              className="font-bold text-white hover:underline flex items-center gap-1"
            >
              <span>Explore Complete Catalog (30+ items)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
export default ShopifyProductsDropdown;
