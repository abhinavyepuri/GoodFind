import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search, RotateCcw, Star, Check, ChevronDown, } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { formatPrice } from '@/lib/utils';
export function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const products = useProductStore((state) => state.products);
    const categories = useProductStore((state) => state.categories);
    // URL State & Local Filters
    const initialCategory = searchParams.get('category') || 'all';
    const initialSearch = searchParams.get('q') || '';
    const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);
    const [searchQuery, setSearchQuery] = React.useState(initialSearch);
    const [sortBy, setSortBy] = React.useState('featured');
    const [maxPrice, setMaxPrice] = React.useState(1000);
    const [minRating, setMinRating] = React.useState(0);
    const [onlyInStock, setOnlyInStock] = React.useState(false);
    const [selectedBrands, setSelectedBrands] = React.useState([]);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);
    // Sync with searchParams
    React.useEffect(() => {
        const cat = searchParams.get('category');
        if (cat)
            setSelectedCategory(cat);
        const q = searchParams.get('q');
        if (q)
            setSearchQuery(q);
    }, [searchParams]);
    // Extract unique brands
    const allBrands = React.useMemo(() => {
        return Array.from(new Set(products.map((p) => p.brand))).sort();
    }, [products]);
    const toggleBrand = (brand) => {
        setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]);
    };
    const clearAllFilters = () => {
        setSelectedCategory('all');
        setSearchQuery('');
        setMaxPrice(1000);
        setMinRating(0);
        setOnlyInStock(false);
        setSelectedBrands([]);
        setSearchParams({});
    };
    // Filter & Sort Logic
    const filteredProducts = React.useMemo(() => {
        return products
            .filter((product) => {
            // Category filter
            if (selectedCategory !== 'all') {
                const matchCat = categories.find((c) => c.slug === selectedCategory);
                if (matchCat && product.category !== matchCat.name)
                    return false;
            }
            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const match = product.name.toLowerCase().includes(q) ||
                    product.description.toLowerCase().includes(q) ||
                    product.brand.toLowerCase().includes(q) ||
                    product.tags.some((t) => t.toLowerCase().includes(q));
                if (!match)
                    return false;
            }
            // Price filter
            if (product.price > maxPrice)
                return false;
            // Rating filter
            if (minRating > 0 && product.rating < minRating)
                return false;
            // Stock filter
            if (onlyInStock && product.stock <= 0)
                return false;
            // Brand filter
            if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
                return false;
            }
            return true;
        })
            .sort((a, b) => {
            if (sortBy === 'price-low')
                return a.price - b.price;
            if (sortBy === 'price-high')
                return b.price - a.price;
            if (sortBy === 'rating')
                return b.rating - a.rating;
            if (sortBy === 'newest')
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            // default 'featured'
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        });
    }, [
        products,
        categories,
        selectedCategory,
        searchQuery,
        maxPrice,
        minRating,
        onlyInStock,
        selectedBrands,
        sortBy,
    ]);
    // Count active filters
    const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) +
        (searchQuery ? 1 : 0) +
        (maxPrice < 1000 ? 1 : 0) +
        (minRating > 0 ? 1 : 0) +
        (onlyInStock ? 1 : 0) +
        selectedBrands.length;
    const FiltersContent = (<div className="space-y-6">
      {/* Search Input */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
          Keyword Search
        </label>
        <div className="relative">
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search catalog..." className="h-9 text-xs pl-8"/>
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-3 text-muted-foreground"/>
          {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5"/>
            </button>)}
        </div>
      </div>

      {/* Category selector */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
          Category
        </label>
        <div className="space-y-1 text-xs">
          <button onClick={() => setSelectedCategory('all')} className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${selectedCategory === 'all'
            ? 'bg-primary/10 text-primary font-bold'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            <span>All Categories</span>
            <span className="text-[11px] opacity-75">{(products || []).length}</span>
          </button>
          {(categories || []).map((c) => {
            const count = (products || []).filter((p) => p?.category === c?.name).length;
            const isSelected = selectedCategory === c?.slug;
            return (<button key={c?.id || c?.slug} onClick={() => setSelectedCategory(c?.slug)} className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${isSelected
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                <span>{c?.name}</span>
                <span className="text-[11px] opacity-75">{count}</span>
              </button>);
        })}
        </div>
      </div>

      {/* Max Price Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Price Range
          </label>
          <span className="text-xs font-semibold text-foreground">
            Up to {formatPrice(maxPrice)}
          </span>
        </div>
        <input type="range" min="20" max="1000" step="10" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-primary cursor-pointer"/>
        <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
          <span>{formatPrice(20)}</span>
          <span>{formatPrice(1000)}+</span>
        </div>
      </div>

      {/* Brands Filter */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
          Makers & Brands
        </label>
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {(allBrands || []).map((brand) => {
            const isChecked = selectedBrands.includes(brand);
            return (<label key={brand} className="flex items-center gap-2 text-xs text-foreground cursor-pointer hover:text-primary transition-colors py-0.5">
                <div onClick={() => toggleBrand(brand)} className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${isChecked
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-input bg-background'}`}>
                  {isChecked && <Check className="h-3 w-3 stroke-[3]"/>}
                </div>
                <span onClick={() => toggleBrand(brand)} className="flex-1 select-none">
                  {brand}
                </span>
              </label>);
        })}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
          Customer Rating
        </label>
        <div className="space-y-1">
          {[4.8, 4.5, 4.0].map((ratingVal) => (<button key={ratingVal} onClick={() => setMinRating(minRating === ratingVal ? 0 : ratingVal)} className={`w-full text-left px-2 py-1 rounded-md text-xs flex items-center gap-1.5 transition-colors ${minRating === ratingVal
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-muted-foreground hover:bg-muted'}`}>
              <div className="flex text-foreground">
                <Star className="h-3.5 w-3.5 fill-current"/>
              </div>
              <span>{ratingVal}+ Stars</span>
            </button>))}
        </div>
      </div>

      {/* Availability */}
      <div className="pt-2 border-t">
        <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
          <input type="checkbox" checked={onlyInStock} onChange={(e) => setOnlyInStock(e.target.checked)} className="rounded border-input text-primary focus:ring-primary h-4 w-4"/>
          <span className="font-medium">In-Stock Only</span>
        </label>
      </div>

      {/* Clear Filters Button */}
      {activeFiltersCount > 0 && (<div className="pt-2">
          <Button onClick={clearAllFilters} variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-foreground gap-1.5">
            <RotateCcw className="h-3.5 w-3.5"/>
            <span>Reset All Filters</span>
          </Button>
        </div>)}
    </div>);
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Breadcrumbs */}
      <div className="space-y-2 mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Curated Catalog
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            {selectedCategory === 'all'
            ? 'All Objects & Provisions'
            : categories.find((c) => c.slug === selectedCategory)?.name || 'Catalog'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> of {products.length} products
          </p>
        </div>
      </div>

      {/* Controls Bar: Sort & Mobile filter trigger */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-muted/40 rounded-2xl border mb-8">
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsMobileFiltersOpen(true)} variant="outline" size="sm" className="lg:hidden text-xs gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5"/>
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </Button>

          {/* Active Filter Chips */}
          <div className="hidden sm:flex flex-wrap items-center gap-1.5">
            {selectedCategory !== 'all' && (<span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-background border text-foreground font-medium">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')}>
                  <X className="h-3 w-3 hover:text-destructive"/>
                </button>
              </span>)}
            {searchQuery && (<span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-background border text-foreground font-medium">
                &quot;{searchQuery}&quot;
                <button onClick={() => setSearchQuery('')}>
                  <X className="h-3 w-3 hover:text-destructive"/>
                </button>
              </span>)}
            {maxPrice < 1000 && (<span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-background border text-foreground font-medium">
                &lt; {formatPrice(maxPrice)}
                <button onClick={() => setMaxPrice(1000)}>
                  <X className="h-3 w-3 hover:text-destructive"/>
                </button>
              </span>)}
            {selectedBrands.map((b) => (<span key={b} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-background border text-foreground font-medium">
                {b}
                <button onClick={() => toggleBrand(b)}>
                  <X className="h-3 w-3 hover:text-destructive"/>
                </button>
              </span>))}
            {activeFiltersCount > 0 && (<button onClick={clearAllFilters} className="text-xs text-primary hover:underline font-semibold ml-2">
                Clear all
              </button>)}
          </div>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground whitespace-nowrap">Sort by:</span>
          <div className="relative">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-background border rounded-lg px-3 py-1.5 pr-8 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer">
              <option value="featured">Featured Picks</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newly Launched</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 top-2.5 pointer-events-none text-muted-foreground"/>
          </div>
        </div>
      </div>

      {/* Main Grid Layout with Desktop Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 p-6 rounded-2xl border bg-card/60 sticky top-24">
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary"/>
              <h3 className="font-bold text-sm text-foreground">Filter Catalog</h3>
            </div>
            {activeFiltersCount > 0 && (<span className="text-xs text-primary font-semibold">
                {activeFiltersCount} active
              </span>)}
          </div>
          {FiltersContent}
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (<div className="py-20 text-center rounded-2xl border border-dashed p-8 bg-muted/20">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-4">
                <SlidersHorizontal className="h-8 w-8 stroke-[1.5]"/>
              </div>
              <h3 className="text-lg font-bold text-foreground">No matching products found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
                Try widening your price range, searching for a different keyword, or resetting your category filters.
              </p>
              <Button onClick={clearAllFilters} variant="brand" size="sm">
                Reset All Filters
              </Button>
            </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {(filteredProducts || []).map((product) => (<ProductCard key={product?.id} product={product}/>))}
            </div>)}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen} side="left">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary"/>
            <SheetTitle>Filter Products</SheetTitle>
          </div>
          <SheetClose onClose={() => setIsMobileFiltersOpen(false)}/>
        </SheetHeader>
        <div className="py-4 overflow-y-auto">{FiltersContent}</div>
        <div className="pt-4 border-t mt-auto">
          <Button onClick={() => setIsMobileFiltersOpen(false)} variant="brand" className="w-full">
            Show {filteredProducts.length} Results
          </Button>
        </div>
      </Sheet>
    </div>);
}
