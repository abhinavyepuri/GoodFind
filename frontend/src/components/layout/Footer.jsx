import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProductStore } from '@/store/productStore';
export function Footer() {
    const [email, setEmail] = React.useState('');
    const [isSubscribed, setIsSubscribed] = React.useState(false);
    const categories = useProductStore((state) => state.categories);
    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email || !email.includes('@'))
            return;
        setIsSubscribed(true);
        setEmail('');
    };
    return (<footer className="border-t bg-muted/30 text-foreground transition-colors">


      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group tracking-tight">
              <span className="font-extrabold text-xl tracking-tighter text-foreground font-sans">
                GOODFIND<span>.</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-muted-foreground border-l border-border/80 pl-2.5 ml-1 hidden sm:inline">
                Store
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              GoodFind is a curated lifestyle marketplace engineered for discerning creators, independent makers, and design enthusiasts. Discover handcrafted essentials, audio gear, apparel, and home provisions.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Join the Private Digest
              </p>
              {isSubscribed ? (<div className="flex items-center gap-2 p-3 bg-zinc-100 dark:bg-zinc-900 text-foreground rounded-lg text-xs font-medium border border-border">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-foreground"/>
                  <span>You are subscribed. Watch your inbox for weekly private editions.</span>
                </div>) : (<form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="h-10 text-xs bg-background"/>
                  <Button type="submit" variant="brand" size="sm" className="h-10 px-4 shrink-0">
                    <span>Subscribe</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1"/>
                  </Button>
                </form>)}
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/catalog" className="hover:text-primary transition-colors">
                  All Catalog (30+ Items)
                </Link>
              </li>
              {categories.map((c) => (<li key={c.id}>
                  <Link to={`/category/${c.slug}`} className="hover:text-primary transition-colors">
                    {c.name}
                  </Link>
                </li>))}
            </ul>
          </div>

          {/* Customer Experience */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/account/orders" className="hover:text-primary transition-colors">
                  My Orders & Tracking
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-primary transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Concierge Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              Company & Policies
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/shipping" className="hover:text-primary transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-primary transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} GoodFind Commerce Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground font-medium flex items-center gap-1.5">
              <span>●</span> Direct Artisan Fulfillment
            </span>
            <span>•</span>
            <Link to="/shipping" className="hover:underline">Shipping</Link>
            <Link to="/returns" className="hover:underline">Returns</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/contact" className="hover:underline">Concierge</Link>
          </div>
        </div>
      </div>
    </footer>);
}
