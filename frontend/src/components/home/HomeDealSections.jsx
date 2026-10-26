import * as React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Flame, Tag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { usePreferenceStore } from '@/store/preferenceStore';

export function HomeDealSections() {
  const formatPricePref = usePreferenceStore((state) => state.formatPriceWithPreference);

  return (
    <section className="space-y-6">
      {/* 4-Column Grid matching home-page-sections.png */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* =========================================================================
            CARD 1: Trending Deals (4-item grid with deal price, MRP, discount badge)
           ========================================================================= */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-amber-500" />
                <span>Trending deals</span>
              </h3>
              <Link
                to="/catalog?deals=true"
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Product 1 */}
              <Link
                to="/product/aero-sound-pro-wireless-headphones"
                className="group space-y-1 block"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 relative">
                  <img
                    src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80"
                    alt="Aero Sound Pro"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                    46% off
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-foreground line-clamp-1 leading-tight group-hover:text-primary">
                  Studio Wireless ANC
                </p>
                <div className="flex items-baseline gap-1.5 text-xs">
                  <span className="font-extrabold text-foreground">{formatPricePref(349)}</span>
                  <span className="text-[10px] text-muted-foreground line-through">
                    {formatPricePref(649)}
                  </span>
                </div>
              </Link>

              {/* Product 2 */}
              <Link
                to="/category/beauty"
                className="group space-y-1 block"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 relative">
                  <img
                    src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&auto=format&fit=crop&q=80"
                    alt="Botanical Serum"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                    25% off
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-foreground line-clamp-1 leading-tight group-hover:text-primary">
                  Aloe & Vitamin Nectar
                </p>
                <div className="flex items-baseline gap-1.5 text-xs">
                  <span className="font-extrabold text-foreground">{formatPricePref(189)}</span>
                  <span className="text-[10px] text-muted-foreground line-through">
                    {formatPricePref(250)}
                  </span>
                </div>
              </Link>

              {/* Product 3 */}
              <Link
                to="/category/pantry"
                className="group space-y-1 block"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 relative">
                  <img
                    src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80"
                    alt="Ethiopian Roast"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                    30% off
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-foreground line-clamp-1 leading-tight group-hover:text-primary">
                  Cold-Brew Micro Lot
                </p>
                <div className="flex items-baseline gap-1.5 text-xs">
                  <span className="font-extrabold text-foreground">{formatPricePref(128)}</span>
                  <span className="text-[10px] text-muted-foreground line-through">
                    {formatPricePref(180)}
                  </span>
                </div>
              </Link>

              {/* Product 4 */}
              <Link
                to="/category/electronics"
                className="group space-y-1 block"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 relative">
                  <img
                    src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80"
                    alt="Fast Charger Desk Hub"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                    40% off
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-foreground line-clamp-1 leading-tight group-hover:text-primary">
                  100W GaN Fast Charger
                </p>
                <div className="flex items-baseline gap-1.5 text-xs">
                  <span className="font-extrabold text-foreground">{formatPricePref(234)}</span>
                  <span className="text-[10px] text-muted-foreground line-through">
                    {formatPricePref(399)}
                  </span>
                </div>
              </Link>
            </div>
          </div>

          <Link
            to="/catalog?deals=true"
            className="text-xs font-bold text-primary hover:underline pt-3 mt-3 border-t border-border/60 block"
          >
            See all deals →
          </Link>
        </div>

        {/* =========================================================================
            CARD 2: Deals on fashion, home & more (4 colorful deal blocks)
           ========================================================================= */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-emerald-500" />
                <span>Deals on fashion, home & more</span>
              </h3>
              <Link
                to="/catalog?category=fashion"
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Tile 1 */}
              <Link
                to="/catalog?under=99"
                className="rounded-xl p-3 bg-gradient-to-br from-amber-500 to-amber-600 text-zinc-950 flex flex-col justify-between min-h-[95px] shadow-xs hover:scale-[1.02] transition-transform"
              >
                <span className="text-xs font-black uppercase tracking-wider">UNDER ₹99</span>
                <span className="text-[11px] font-bold opacity-90">Mega savings</span>
              </Link>

              {/* Tile 2 */}
              <Link
                to="/catalog?under=199"
                className="rounded-xl p-3 bg-gradient-to-br from-rose-500 to-rose-600 text-white flex flex-col justify-between min-h-[95px] shadow-xs hover:scale-[1.02] transition-transform"
              >
                <span className="text-xs font-black uppercase tracking-wider">UNDER ₹199</span>
                <span className="text-[11px] font-bold opacity-90">Unmissable deals</span>
              </Link>

              {/* Tile 3 */}
              <Link
                to="/catalog?under=499"
                className="rounded-xl p-3 bg-gradient-to-br from-purple-600 to-purple-700 text-white flex flex-col justify-between min-h-[95px] shadow-xs hover:scale-[1.02] transition-transform"
              >
                <span className="text-xs font-black uppercase tracking-wider">UNDER ₹499</span>
                <span className="text-[11px] font-bold opacity-90">Explore more</span>
              </Link>

              {/* Tile 4 */}
              <Link
                to="/catalog?deals=true"
                className="rounded-xl p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white flex flex-col justify-between min-h-[95px] shadow-xs hover:scale-[1.02] transition-transform"
              >
                <span className="text-xs font-black uppercase tracking-wider">OMG! DROP</span>
                <span className="text-[11px] font-bold opacity-90">Lowest prices</span>
              </Link>
            </div>
          </div>

          <Link
            to="/catalog?category=fashion"
            className="text-xs font-bold text-primary hover:underline pt-3 mt-3 border-t border-border/60 block"
          >
            Explore fashion & home finds →
          </Link>
        </div>

        {/* =========================================================================
            CARD 3: Great deals on tech & audio (4 category cards with up to 40% off)
           ========================================================================= */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-primary" />
                <span>Great deals on tech & audio</span>
              </h3>
              <Link
                to="/category/electronics"
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link to="/category/electronics" className="group space-y-1 block">
                <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 relative">
                  <img
                    src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&auto=format&fit=crop&q=80"
                    alt="Laptops for Creators"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Up to 40% off
                  </span>
                </div>
                <p className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                  Pro Workstations
                </p>
              </Link>

              <Link to="/category/electronics" className="group space-y-1 block">
                <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 relative">
                  <img
                    src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80"
                    alt="Audio Studio"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Up to 45% off
                  </span>
                </div>
                <p className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                  Acoustic Audio
                </p>
              </Link>

              <Link to="/category/home-living" className="group space-y-1 block">
                <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 relative">
                  <img
                    src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&auto=format&fit=crop&q=80"
                    alt="Desk Setups"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Up to 35% off
                  </span>
                </div>
                <p className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                  Solid Hardwood
                </p>
              </Link>

              <Link to="/category/electronics" className="group space-y-1 block">
                <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 relative">
                  <img
                    src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&auto=format&fit=crop&q=80"
                    alt="Ergonomic Peripherals"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Up to 30% off
                  </span>
                </div>
                <p className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                  Input Gear
                </p>
              </Link>
            </div>
          </div>

          <Link
            to="/category/electronics"
            className="text-xs font-bold text-primary hover:underline pt-3 mt-3 border-t border-border/60 block"
          >
            See all tech hardware →
          </Link>
        </div>

        {/* =========================================================================
            CARD 4: Starting ₹99 | Lifestyle & Everyday Finds (Just Launched Grid)
           ========================================================================= */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-primary" />
                <span>Starting ₹99 | Lifestyle finds</span>
              </h3>
              <Link
                to="/catalog"
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link to="/category/fashion" className="group space-y-1 block">
                <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 relative">
                  <img
                    src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&auto=format&fit=crop&q=80"
                    alt="Minimalist Apparel"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-amber-400 text-zinc-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                    Just Launched
                  </span>
                </div>
                <p className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                  Artisan Apparel
                </p>
              </Link>

              <Link to="/category/home-living" className="group space-y-1 block">
                <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 relative">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&auto=format&fit=crop&q=80"
                    alt="Home Decor"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-amber-400 text-zinc-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                    Just Launched
                  </span>
                </div>
                <p className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                  Ambient Living
                </p>
              </Link>

              <Link to="/category/beauty" className="group space-y-1 block">
                <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 relative">
                  <img
                    src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&auto=format&fit=crop&q=80"
                    alt="Pure Botanicals"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-amber-400 text-zinc-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                    Just Launched
                  </span>
                </div>
                <p className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                  Self-Care Oils
                </p>
              </Link>

              <Link to="/category/pantry" className="group space-y-1 block">
                <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 relative">
                  <img
                    src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80"
                    alt="Pour Over Coffee"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-amber-400 text-zinc-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                    Just Launched
                  </span>
                </div>
                <p className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                  Roast Provisions
                </p>
              </Link>
            </div>
          </div>

          <Link
            to="/catalog"
            className="text-xs font-bold text-primary hover:underline pt-3 mt-3 border-t border-border/60 block"
          >
            Explore all lifestyle drops →
          </Link>
        </div>
      </div>
    </section>
  );
}
export default HomeDealSections;
