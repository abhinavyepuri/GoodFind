import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Package, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '@/store/productStore';
import { formatPrice } from '@/lib/utils';
export function SearchModal({ isOpen, onClose }) {
    const [query, setQuery] = React.useState('');
    const navigate = useNavigate();
    const products = useProductStore((state) => state.products);
    const inputRef = React.useRef(null);
    React.useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
            setQuery('');
        }
    }, [isOpen]);
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (isOpen)
                    onClose();
                else {
                    // Trigger open if supported
                }
            }
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
    const filteredProducts = React.useMemo(() => {
        if (!query.trim())
            return [];
        const q = query.toLowerCase().trim();
        return (products || [])
            .filter((p) => (p?.name || '').toLowerCase().includes(q) ||
            (p?.category || '').toLowerCase().includes(q) ||
            (p?.brand || '').toLowerCase().includes(q) ||
            (p?.tags || []).some((t) => (t || '').toLowerCase().includes(q)))
            .slice(0, 6);
    }, [products, query]);
    const popularSearches = [
        'Wireless Headphones',
        'Standing Desk',
        'Merino Wool',
        'Ceremonial Matcha',
        'Titanium Watch',
    ];
    const handleSelectProduct = (slug) => {
        onClose();
        navigate(`/product/${slug}`);
    };
    const handleSelectSearchTerm = (term) => {
        setQuery(term);
    };
    const handleViewAllResults = () => {
        if (!query.trim())
            return;
        onClose();
        navigate(`/catalog?q=${encodeURIComponent(query.trim())}`);
    };
    return (<AnimatePresence>
      {isOpen && (<div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm"/>

          <motion.div initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ duration: 0.2 }} className="relative w-full max-w-2xl rounded-2xl border bg-background shadow-2xl overflow-hidden z-10">
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b gap-3">
              <Search className="h-5 w-5 text-muted-foreground shrink-0"/>
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => {
                if (e.key === 'Enter')
                    handleViewAllResults();
            }} placeholder="Search products, brands, materials, or categories..." className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"/>
              {query && (<button onClick={() => setQuery('')} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <X className="h-4 w-4"/>
                </button>)}
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-muted-foreground bg-muted border rounded">
                ESC
              </kbd>
            </div>

            {/* Content area */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
              {query.trim() === '' ? (<div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-brand-500"/>
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (<button key={term} onClick={() => handleSelectSearchTerm(term)} className="text-xs font-medium px-3 py-1.5 rounded-md border bg-muted/50 hover:bg-muted text-foreground transition-colors">
                        {term}
                      </button>))}
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Featured Collections
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <button onClick={() => {
                    onClose();
                    navigate('/category/electronics');
                }} className="text-left p-2.5 rounded-lg border hover:bg-muted/60 transition-colors flex items-center justify-between group">
                        <span className="font-medium text-foreground">Electronics & Audio</span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"/>
                      </button>
                      <button onClick={() => {
                    onClose();
                    navigate('/category/fashion');
                }} className="text-left p-2.5 rounded-lg border hover:bg-muted/60 transition-colors flex items-center justify-between group">
                        <span className="font-medium text-foreground">Fashion & Apparel</span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"/>
                      </button>
                    </div>
                  </div>
                </div>) : filteredProducts.length > 0 ? (<div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Matching Products ({filteredProducts.length})
                  </p>
                  {(filteredProducts || []).map((p) => (<div key={p?.id} onClick={() => handleSelectProduct(p?.slug)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/60 cursor-pointer transition-colors group">
                      <img src={p?.images?.[0] || p?.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'} alt={p?.name || 'Product'} onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80';
                    }} className="h-12 w-12 rounded-lg object-contain p-1 border bg-zinc-50 dark:bg-zinc-900/40"/>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {p?.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{p?.category}</span>
                          <span>•</span>
                          <span>{p?.brand}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-foreground">
                          {formatPrice(p?.price || 0)}
                        </p>
                        {p?.originalPrice && (<p className="text-xs text-muted-foreground line-through">
                            {formatPrice(p.originalPrice)}
                          </p>)}
                      </div>
                    </div>))}

                  <div className="pt-3 border-t mt-2">
                    <button onClick={handleViewAllResults} className="w-full py-2.5 text-center text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                      View all catalog results for &quot;{query}&quot;
                      <ArrowRight className="h-4 w-4"/>
                    </button>
                  </div>
                </div>) : (<div className="py-12 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3 text-muted-foreground">
                    <Package className="h-6 w-6"/>
                  </div>
                  <h4 className="text-base font-semibold text-foreground">
                    No results found for &quot;{query}&quot;
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                    Try checking your spelling or search using more generic keywords.
                  </p>
                </div>)}
            </div>
          </motion.div>
        </div>)}
    </AnimatePresence>);
}
