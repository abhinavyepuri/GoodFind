import * as React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CAROUSEL_SLIDES = [
  {
    id: 'slide-1',
    dealBadge: 'UNDER ₹499',
    category: 'Botanical & Body Care',
    title: 'Nourishing Bodywashes & Skin Rituals',
    highlight: 'Free Delivery on first 3 orders • 100% Organic Extracts',
    ctaText: 'Shop Under ₹499',
    ctaLink: '/catalog?category=beauty',
    badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1400&auto=format&fit=crop&q=80',
    themeBg: 'from-emerald-950/80 via-zinc-950/90 to-background',
    priceTag: 'Starting at ₹199',
  },
  {
    id: 'slide-2',
    dealBadge: 'AT ₹35,999*',
    category: 'Flagship Tech & Audio',
    title: 'Aero Sound Pro Titanium Spatial Audio',
    highlight: 'Studio lossless acoustic isolation • 45h Battery • 10% Bank Discount',
    ctaText: 'Explore Pro Audio',
    ctaLink: '/product/aero-sound-pro-wireless-headphones',
    badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1400&auto=format&fit=crop&q=80',
    themeBg: 'from-amber-950/80 via-zinc-950/90 to-background',
    priceTag: 'Special Launch Deal',
  },
  {
    id: 'slide-3',
    dealBadge: 'UNDER ₹399',
    category: 'Minimalist Wardrobe',
    title: 'Tailored Everyday Linen & Organic Sets',
    highlight: 'Easy 30-day doorstep returns • Breathable natural weaves',
    ctaText: 'Shop Wardrobe Finds',
    ctaLink: '/catalog?category=fashion',
    badgeColor: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1400&auto=format&fit=crop&q=80',
    themeBg: 'from-rose-950/80 via-zinc-950/90 to-background',
    priceTag: 'Festive Styles',
  },
  {
    id: 'slide-4',
    dealBadge: 'STARTING ₹199',
    category: 'Home & Kitchen Essentials',
    title: 'Artisan Glassware & Hand-Poured Ceramics',
    highlight: 'Great Indian Festival Live • Extra 10% Instant Cashback',
    ctaText: 'Explore Essentials',
    ctaLink: '/catalog?category=home-living',
    badgeColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&auto=format&fit=crop&q=80',
    themeBg: 'from-blue-950/80 via-zinc-950/90 to-background',
    priceTag: 'Festival Specials',
  },
  {
    id: 'slide-5',
    dealBadge: 'UNDER ₹99',
    category: 'Specialty Roasts & Pantry',
    title: 'Single-Origin Pour-Over Samples & Mugs',
    highlight: 'Micro-lot ethically sourced roasts • Flash savings',
    ctaText: 'Grab Pocket Deals',
    ctaLink: '/catalog?category=pantry',
    badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1400&auto=format&fit=crop&q=80',
    themeBg: 'from-amber-950/80 via-zinc-950/90 to-background',
    priceTag: 'Mega Price Drop',
  },
];

export function HomeAutoCarousel() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);

  // Auto rotation timer (4 seconds)
  React.useEffect(() => {
    if (!isPlaying || isHovered) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered]);

  const slide = CAROUSEL_SLIDES[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  return (
    <div
      className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-border/80 shadow-xl bg-card transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Background Container */}
      <div className="relative min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex items-center overflow-hidden">
        {/* Editorial Photo */}
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.7] dark:brightness-[0.55] transition-all duration-700 ease-out scale-100 hover:scale-105"
        />

        {/* Dynamic Theme Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.themeBg} opacity-90`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Content Box */}
        <div className="relative z-10 max-w-3xl p-6 sm:p-10 lg:p-14 space-y-4 text-white">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border backdrop-blur-md shadow-xs ${slide.badgeColor}`}
            >
              <Tag className="h-3 w-3" />
              <span>{slide.dealBadge}</span>
            </span>

            <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-widest flex items-center gap-1">
              <Tag className="h-3 w-3 text-amber-400" />
              <span>{slide.category}</span>
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
            {slide.title}
          </h2>

          {/* Subtitle / Promotion */}
          <p className="text-xs sm:text-sm lg:text-base text-zinc-200 leading-relaxed max-w-xl font-medium">
            {slide.highlight}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={slide.ctaLink}
              className="px-6 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <span className="text-xs font-bold text-amber-300 backdrop-blur-sm px-3 py-2 rounded-lg bg-black/30 border border-white/10">
              {slide.priceTag}
            </span>
          </div>
        </div>

        {/* Controls Overlay: Left & Right Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous Deal Slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-md"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Deal Slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-md"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Bottom Bar: Indicators & Pause/Play Button (Amazon Style) */}
        <div className="absolute bottom-4 left-6 sm:left-10 right-6 sm:right-10 z-20 flex items-center justify-between text-white">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2">
            {CAROUSEL_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Pause / Play Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause auto-sliding' : 'Start auto-sliding'}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/20 text-white backdrop-blur-md transition-colors flex items-center gap-1.5 text-[11px] font-semibold"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isPlaying ? 'Auto-play on' : 'Paused'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default HomeAutoCarousel;
