import { Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function NotFoundPage() {
    return (<div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <span className="text-7xl font-extrabold text-primary/20 tracking-tighter">404</span>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
          <p className="text-sm text-muted-foreground">
            The page you are looking for does not exist or may have been relocated.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="brand" className="gap-2">
              <Home className="h-4 w-4"/>
              <span>Back to Home</span>
            </Button>
          </Link>
          <Link to="/catalog">
            <Button variant="outline" className="gap-2">
              <ShoppingBag className="h-4 w-4"/>
              <span>Browse Catalog</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>);
}
