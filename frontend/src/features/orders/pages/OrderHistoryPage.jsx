import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Package, ShieldCheck, Headphones, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderHistoryList } from '../components/OrderHistoryList';

export function OrderHistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-muted-foreground">Account</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-semibold">Orders & Purchases</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Package className="h-5 w-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Order History
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Track packages in real time, review past invoices, and initiate self-service cancellations or returns.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/catalog">
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                Explore Catalog
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                <Headphones className="h-3.5 w-3.5 mr-1 text-primary" />
                Support
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Orders List Component */}
        <OrderHistoryList />

        {/* GoodFind Quality & Return Guarantee Callout */}
        <div className="rounded-3xl border border-border/60 bg-gradient-to-r from-primary/5 via-primary/[0.02] to-transparent p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">
                GoodFind 30-Day Happiness Guarantee
              </h3>
              <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                Every purchase is protected with prepaid returns, real-time shipment monitoring, and our direct artisan warranty.
              </p>
            </div>
          </div>

          <Link to="/returns">
            <Button variant="outline" size="sm" className="text-xs shrink-0">
              Read Return Policy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default OrderHistoryPage;
