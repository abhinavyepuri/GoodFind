import React, { useState } from 'react';
import { Search, X, Calendar, Filter, ShoppingBag, PackageOpen, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { OrderCard } from './OrderCard';
import { CancelOrderModal } from './CancelOrderModal';
import { ReturnOrderModal } from './ReturnOrderModal';
import { InvoiceModal } from './InvoiceModal';
import { DATE_RANGE_FILTERS } from '../types';

export function OrderHistoryList() {
  const {
    filteredOrders,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    dateRange,
    setDateRange,
    tabCounts,
    orderTabs,
    handleBuyAgain,
    cancelOrder,
    requestReturn,
  } = useOrders();

  // Modal active targets
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [returningOrder, setReturningOrder] = useState(null);
  const [invoicingOrder, setInvoicingOrder] = useState(null);

  const hasActiveFilters = searchQuery.trim() !== '' || activeTab !== 'all' || dateRange !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveTab('all');
    setDateRange('all');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Search & Filter Bar */}
      <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-sm p-4 sm:p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by Order ID (e.g. GF-84291), item title, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-9 h-11 text-xs sm:text-sm bg-background/80 rounded-2xl border-border/60 focus-visible:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground flex items-center justify-center rounded-full"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Date Range Dropdown Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-9 pr-8 h-11 text-xs font-semibold rounded-2xl border border-border/60 bg-background/80 text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {DATE_RANGE_FILTERS.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">
                ▼
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-11 px-3 text-xs text-muted-foreground hover:text-foreground"
                title="Reset filters"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Status Filter Tabs with Counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-border/40">
          {orderTabs.map((tab) => {
            const count = tabCounts[tab.id] || 0;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-background text-muted-foreground border border-border/40'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Results Count Summary */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing <strong className="text-foreground">{filteredOrders.length}</strong>{' '}
          {filteredOrders.length === 1 ? 'order' : 'orders'}
          {activeTab !== 'all' && ` matching "${activeTab}"`}
          {searchQuery && ` for "${searchQuery}"`}
        </span>
      </div>

      {/* 3. Orders List or Empty State */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id || order.orderNumber}
              order={order}
              onOpenCancelModal={setCancellingOrder}
              onOpenReturnModal={setReturningOrder}
              onOpenInvoiceModal={setInvoicingOrder}
              onBuyAgain={handleBuyAgain}
            />
          ))}
        </div>
      ) : (
        /* Empty Results State */
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 backdrop-blur-sm p-12 text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-3xl bg-muted/60 border border-border/60 flex items-center justify-center text-muted-foreground">
            <PackageOpen className="h-8 w-8" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base font-bold text-foreground">No Orders Found</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {hasActiveFilters
                ? 'We could not find any orders matching your selected filters or search keywords.'
                : 'You have not placed any orders yet. Discover curated artisanal goods in our catalog.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            {hasActiveFilters ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear All Filters
              </Button>
            ) : (
              <Link to="/catalog">
                <Button variant="brand" size="sm" className="text-xs gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Start Shopping</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 4. Self-Service Modals */}
      <CancelOrderModal
        order={cancellingOrder}
        isOpen={Boolean(cancellingOrder)}
        onClose={() => setCancellingOrder(null)}
        onConfirmCancel={cancelOrder}
      />

      <ReturnOrderModal
        order={returningOrder}
        isOpen={Boolean(returningOrder)}
        onClose={() => setReturningOrder(null)}
        onConfirmReturn={requestReturn}
      />

      <InvoiceModal
        order={invoicingOrder}
        isOpen={Boolean(invoicingOrder)}
        onClose={() => setInvoicingOrder(null)}
      />
    </div>
  );
}
