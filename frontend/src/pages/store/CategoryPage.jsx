import { useParams, Link } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
export function CategoryPage() {
    const { slug } = useParams();
    const { categories, products } = useProductStore();
    const category = (categories || []).find((c) => c?.slug === slug);
    const categoryProducts = (products || []).filter((p) => category && p?.category?.toLowerCase() === category?.name?.toLowerCase());
    if (!category) {
        return (<div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">Category Not Found</h2>
        <Link to="/catalog">
          <Button variant="brand" className="mt-4">Browse All Catalog</Button>
        </Link>
      </div>);
    }
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5"/>
        <Link to="/catalog" className="hover:text-foreground">Catalog</Link>
        <ChevronRight className="h-3.5 w-3.5"/>
        <span className="text-foreground font-medium">{category?.name}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border shadow-lg bg-zinc-950 text-white min-h-[220px] flex items-end p-8 sm:p-12">
        <img src={category?.image} alt={category?.name || 'Category'} onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80';
        }} className="absolute inset-0 h-full w-full object-cover opacity-40"/>
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Curated Collection ({(categoryProducts || []).length} Objects)
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {category?.name}
          </h1>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {category?.description}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <p className="text-sm font-semibold text-foreground">
            Displaying all {(categoryProducts || []).length} items in this category
          </p>
          <Link to={`/catalog?category=${category?.slug}`}>
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5"/>
              <span>Open Advanced Filter View</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(categoryProducts || []).map((product) => (<ProductCard key={product?.id} product={product}/>))}
        </div>
      </div>
    </div>);
}
