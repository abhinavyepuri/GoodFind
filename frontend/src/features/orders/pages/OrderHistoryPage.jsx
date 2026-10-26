import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, Package, ShieldCheck, Headphones, MapPin, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderHistoryList } from '../components/OrderHistoryList';
import { SavedAddressBook } from '../components/SavedAddressBook';
import { useAuthStore } from '@/store/authStore';

export function OrderHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeAccountTab = searchParams.get('tab') === 'addresses' ? 'addresses' : 'orders';
  const { user, addresses, isAuthenticated, openAuthModal } = useAuthStore();

  const handleTabChange = (tab) => {
    if (tab === 'addresses') {
      setSearchParams({ tab: 'addresses' });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-muted-foreground">Account Hub</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-semibold">
            {activeAccountTab === 'addresses' ? 'Saved Address Book' : 'Orders & Purchases'}
          </span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                {activeAccountTab === 'addresses' ? (
                  <MapPin className="h-5 w-5" />
                ) : (
                  <Package className="h-5 w-5" />
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {activeAccountTab === 'addresses' ? 'Saved Address Book' : 'Order History & Tracking'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {activeAccountTab === 'addresses'
                ? 'Manage multiple shipping addresses with default pre-selection for 1-click checkout.'
                : 'Track packages in real time, review past invoices, and initiate self-service cancellations or returns.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/catalog">
              <Button variant="outline" size="sm" className="text-xs font-semibold rounded-xl">
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

        {/* Account Authentication Banner */}
        {!isAuthenticated ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-foreground">Sign in to sync your GoodFind account</p>
                <p className="text-muted-foreground text-[11px]">
                  Sign in to view your personal order history, save addresses, and enable 1-click checkout.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="brand"
              size="sm"
              onClick={() => openAuthModal('login')}
              className="h-8 px-4 text-xs font-semibold rounded-xl self-start sm:self-auto shrink-0 shadow-sm"
            >
              Sign In / Register
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                Signed in as <strong className="text-foreground">{user?.name}</strong> ({user?.email}) • {addresses?.length || 0} saved address(es)
              </span>
            </div>
          </div>
        )}

        {/* Dual Tab Navigation (Orders vs Saved Addresses) */}
        <div className="flex border-b border-border/80 gap-6">
          <button
            type="button"
            onClick={() => handleTabChange('orders')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors border-b-2 -mb-px ${
              activeAccountTab === 'orders'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Orders & Purchases</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('addresses')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors border-b-2 -mb-px ${
              activeAccountTab === 'addresses'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Saved Address Book {addresses?.length > 0 && `(${addresses.length})`}</span>
          </button>
        </div>

        {/* Active Tab View */}
        {activeAccountTab === 'orders' ? (
          <OrderHistoryList />
        ) : (
          <SavedAddressBook />
        )}

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
            <Button variant="outline" size="sm" className="text-xs shrink-0 rounded-xl">
              Read Return Policy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default OrderHistoryPage;
