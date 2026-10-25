import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Award, Truck, RotateCcw, ShieldCheck, Leaf, ChevronLeft, ChevronRight, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product/ProductCard';
import { useProductStore } from '@/store/productStore';
const HERO_SLIDES = [
    {
        id: 'audio',
        season: 'SPRING 2026 • FLAGSHIP LAUNCH',
        title: 'Acoustic Fidelity, Sculpted.',
        subtitle: 'Precision-milled titanium drivers, studio-grade lossless spatial acoustic isolation, and hand-finished aluminum architecture. Engineered for uncompromising creators.',
        priceBadge: 'Starting at $349.00 • 45h Battery',
        primaryCtaText: 'Shop Aero Sound Pro',
        primaryCtaLink: '/product/aero-sound-pro-wireless-headphones',
        secondaryCtaText: 'Explore Audio Gear',
        secondaryCtaLink: '/category/audio',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1600&auto=format&fit=crop&q=85',
        categoryLabel: '01 / Acoustic Innovation',
        productTag: 'Studio Headphones',
    },
    {
        id: 'furniture',
        season: 'HEIRLOOM CRAFTSMANSHIP',
        title: 'Solid American Walnut Workspaces.',
        subtitle: 'Kiln-dried sustainable black walnut paired with dual whisper-quiet German lift columns and magnetic cable concealment. Built to elevate your daily focus.',
        priceBadge: 'Apex Desk — $890.00 • Solid Hardwood',
        primaryCtaText: 'Discover Apex Desk',
        primaryCtaLink: '/product/solid-walnut-dual-motor-electric-standing-desk',
        secondaryCtaText: 'Explore Furniture',
        secondaryCtaLink: '/category/home-living',
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1600&auto=format&fit=crop&q=85',
        categoryLabel: '02 / Architectural Living',
        productTag: 'Ergonomic Standing Desk',
    },
    {
        id: 'apothecary',
        season: 'ETHICAL HARVEST & CARE',
        title: 'Pure Botanical Formulations & Roasts.',
        subtitle: 'Cold-pressed marine botanicals, nutrient-dense squalane extracts, and small-batch anaerobic roast provisions sourced directly from high-altitude ethical cooperatives.',
        priceBadge: 'Daily Provisions from $26.00',
        primaryCtaText: 'Shop Daily Rituals',
        primaryCtaLink: '/category/grooming',
        secondaryCtaText: 'Explore Specialty Roasts',
        secondaryCtaLink: '/category/gourmet-coffee',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1600&auto=format&fit=crop&q=85',
        categoryLabel: '03 / Botanical & Roasts',
        productTag: 'Artisan Provisions',
    },
];
export function HomePage() {
    const { products, categories } = useProductStore();
    const [activeSlide, setActiveSlide] = React.useState(0);
    const [activeTab, setActiveTab] = React.useState('trending');
    const slide = HERO_SLIDES[activeSlide];
    const featuredCategories = categories.filter((c) => c.featured).slice(0, 4);
    const trendingProducts = products.filter((p) => p.featured).slice(0, 8);
    const bestsellerProducts = products.filter((p) => p.bestseller).slice(0, 8);
    const newProducts = products.filter((p) => p.newArrival).slice(0, 8);
    const currentTabProducts = activeTab === 'trending'
        ? trendingProducts
        : activeTab === 'bestsellers'
            ? bestsellerProducts
            : newProducts;
    // Recommended for you (curated selection from various categories)
    const recommendedProducts = [
        products.find((p) => p.id === 'prod-101'),
        products.find((p) => p.id === 'prod-201'),
        products.find((p) => p.id === 'prod-301'),
        products.find((p) => p.id === 'prod-501'),
    ].filter(Boolean);
    const nextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    };
    const prevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    };
    return (<div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Flagship Editorial Hero Showcase */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero Card Container */}
          <div className="relative rounded-2xl overflow-hidden bg-zinc-950 text-white min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between shadow-2xl border border-zinc-800">
            {/* Background Editorial Image */}
            <img src={slide.image} alt={slide.title} key={slide.id} className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.72] transition-all duration-700 ease-out"/>
            {/* Dramatic Luxury Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20"/>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"/>

            {/* Top Bar inside Hero: Season Tag + Slide Controls */}
            <div className="relative z-10 p-6 sm:p-10 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-300 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white"/>
                {slide.season}
              </span>

              {/* Arrow navigation */}
              <div className="flex items-center gap-2">
                <button onClick={prevSlide} aria-label="Previous editorial slide" className="h-9 w-9 rounded-md bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm">
                  <ChevronLeft className="h-4 w-4"/>
                </button>
                <button onClick={nextSlide} aria-label="Next editorial slide" className="h-9 w-9 rounded-md bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm">
                  <ChevronRight className="h-4 w-4"/>
                </button>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-zinc-200">
                <Sparkles className="h-3 w-3 text-zinc-200"/>
                <span>{slide.priceBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                {slide.title}
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
                {slide.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to={slide.primaryCtaLink}>
                  <Button variant="default" size="lg" className="bg-white text-zinc-950 hover:bg-zinc-100 font-bold gap-2 shadow-lg">
                    <span>{slide.primaryCtaText}</span>
                    <ArrowRight className="h-4 w-4"/>
                  </Button>
                </Link>
                <Link to={slide.secondaryCtaLink}>
                  <Button variant="outline" size="lg" className="bg-transparent text-white border-white/40 hover:bg-white/15 hover:text-white backdrop-blur-sm">
                    <span>{slide.secondaryCtaText}</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Bottom Interactive Slide Switcher Strip */}
            <div className="relative z-10 border-t border-white/15 bg-black/40 backdrop-blur-md px-6 sm:px-10 py-3 hidden sm:flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {HERO_SLIDES.map((s, idx) => (<button key={s.id} onClick={() => setActiveSlide(idx)} className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all text-left flex items-center gap-2 ${activeSlide === idx
                ? 'bg-white text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}>
                    <span>{s.categoryLabel}</span>
                  </button>))}
              </div>

              <Link to="/catalog" className="text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors uppercase tracking-wider">
                <span>View All Collections</span>
                <ArrowRight className="h-3.5 w-3.5"/>
              </Link>
            </div>
          </div>

          {/* Luxury Boutique Guarantee Bar (Directly below Hero) */}
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-foreground flex items-center justify-center shrink-0">
                <Truck className="h-4 w-4"/>
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Complimentary 2-Day Delivery</h4>
                <p className="text-[11px] text-muted-foreground">Orders over ₹150 worldwide</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-foreground flex items-center justify-center shrink-0">
                <RotateCcw className="h-4 w-4"/>
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">30-Day In-Home Trial</h4>
                <p className="text-[11px] text-muted-foreground">Hassle-free prepaid returns</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-foreground flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4"/>
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">2-Year Master Warranty</h4>
                <p className="text-[11px] text-muted-foreground">Advance unit replacement</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-foreground flex items-center justify-center shrink-0">
                <Leaf className="h-4 w-4"/>
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Plastic-Free Packaging</h4>
                <p className="text-[11px] text-muted-foreground">100% recyclable materials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Browse Collections</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
              Shop by Category
            </h2>
          </div>
          <Link to="/catalog" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            <span>View All ({(categories || []).length})</span>
            <ArrowRight className="h-4 w-4"/>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(featuredCategories || []).map((cat) => (<Link key={cat?.id || cat?.slug} to={`/category/${cat?.slug || ''}`} className="group relative rounded-2xl overflow-hidden border aspect-[4/5] bg-muted/30 shadow-soft hover:shadow-soft-md transition-all duration-300 flex flex-col justify-end p-6">
              <img src={cat?.image} alt={cat?.name || 'Category'} loading="lazy" onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80';
            }} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"/>
              <div className="relative z-10 text-white space-y-1">
                <span className="text-xs font-medium text-zinc-300">
                  {cat?.productCount || 0} Items Available
                </span>
                <h3 className="text-lg font-bold group-hover:text-zinc-200 transition-colors">
                  {cat?.name}
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-1">{cat?.description}</p>
              </div>
            </Link>))}
        </div>
      </section>

      {/* 3. Product Discovery Tabs: Trending, Bestsellers, New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Handpicked Products</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
              Popular & New Releases
            </h2>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-2 bg-muted/60 p-1 rounded-xl border">
            <button onClick={() => setActiveTab('trending')} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === 'trending'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'}`}>
              <TrendingUp className="h-3.5 w-3.5"/>
              <span>Trending</span>
            </button>
            <button onClick={() => setActiveTab('bestsellers')} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === 'bestsellers'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'}`}>
              <Award className="h-3.5 w-3.5"/>
              <span>Best Sellers</span>
            </button>
            <button onClick={() => setActiveTab('new')} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === 'new'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'}`}>
              <Sparkles className="h-3.5 w-3.5"/>
              <span>Newly Launched</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(currentTabProducts || []).map((product) => (<ProductCard key={product?.id} product={product}/>))}
        </div>

        <div className="text-center mt-12">
          <Link to="/catalog">
            <Button variant="outline" size="lg" className="rounded-xl px-8">
              Explore All 30+ Products in Catalog
              <ArrowRight className="h-4 w-4 ml-2"/>
            </Button>
          </Link>
        </div>
      </section>

      {/* 4. Promotional Banner: Seasonal Editorial Feature */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white border shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-6">
              <Badge variant="brand" className="text-xs">Seasonal Highlight</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Solid Walnut & Precision Ergonomics for High-Focus Work
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-lg">
                Crafted from kiln-dried American walnut and dual whisper-quiet German lift columns. Upgrade your daily posture and achieve calm focus in your home studio.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/product/solid-walnut-dual-motor-electric-standing-desk">
                  <Button size="lg" className="bg-white text-zinc-950 hover:bg-zinc-100 font-bold shadow-md">
                    Discover Apex Walnut Desk
                    <ArrowRight className="h-4 w-4 ml-2"/>
                  </Button>
                </Link>
                <Link to="/category/home-living">
                  <Button variant="outline" size="lg" className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white backdrop-blur-sm">
                    Explore Home & Ergonomics
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 lg:h-full min-h-[320px] relative">
              <img src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80" alt="Apex Standing Desk Setup" className="w-full h-full object-cover"/>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Personalized Recommendation Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-500"/>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Curated For You</p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
            Recommended Selections
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Based on your aesthetic preferences and trending design standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {(recommendedProducts || []).map((product) => (<ProductCard key={product?.id} product={product}/>))}
        </div>
      </section>

    </div>);
}
