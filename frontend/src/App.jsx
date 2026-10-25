import * as React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';
// Layouts
import { StoreLayout } from '@/components/layout/StoreLayout';
// Lazy-loaded Storefront Pages
const HomePage = React.lazy(() => import('@/pages/store/HomePage').then((m) => ({ default: m.HomePage })));
const CatalogPage = React.lazy(() => import('@/pages/store/CatalogPage').then((m) => ({ default: m.CatalogPage })));
const CategoryPage = React.lazy(() => import('@/pages/store/CategoryPage').then((m) => ({ default: m.CategoryPage })));
const ProductDetailPage = React.lazy(() => import('@/pages/store/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CartPage = React.lazy(() => import('@/pages/store/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = React.lazy(() => import('@/pages/store/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = React.lazy(() => import('@/pages/store/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage })));
const OrderDetailPage = React.lazy(() => import('@/pages/store/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage })));
const OrderHistoryPage = React.lazy(() => import('@/features/orders').then((m) => ({ default: m.OrderHistoryPage })));
const WishlistPage = React.lazy(() => import('@/pages/store/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const FaqPage = React.lazy(() => import('@/pages/store/FaqPage').then((m) => ({ default: m.FaqPage })));
const ContactPage = React.lazy(() => import('@/pages/store/ContactPage').then((m) => ({ default: m.ContactPage })));
const ShippingPolicyPage = React.lazy(() => import('@/pages/store/PolicyPages').then((m) => ({ default: m.ShippingPolicyPage })));
const ReturnsPolicyPage = React.lazy(() => import('@/pages/store/PolicyPages').then((m) => ({ default: m.ReturnsPolicyPage })));
const PrivacyPolicyPage = React.lazy(() => import('@/pages/store/PolicyPages').then((m) => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = React.lazy(() => import('@/pages/store/PolicyPages').then((m) => ({ default: m.TermsOfServicePage })));
// 404
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

function ScrollToTop() {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}
function PageFallback() {
    return (<div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary"/>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Loading View...
      </span>
    </div>);
}
export function App() {
    return (
      <HashRouter>
        <ScrollToTop />
        <React.Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Storefront Layout */}
            <Route element={<StoreLayout />}>
              <Route path="/" element={<HomePage />}/>
              <Route path="/catalog" element={<CatalogPage />}/>
              <Route path="/category/:slug" element={<CategoryPage />}/>
              <Route path="/product/:slug" element={<ProductDetailPage />}/>
              <Route path="/cart" element={<CartPage />}/>
              <Route path="/checkout" element={<CheckoutPage />}/>
              <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />}/>
              <Route path="/account/orders" element={<OrderHistoryPage />}/>
              <Route path="/orders" element={<OrderHistoryPage />}/>
              <Route path="/account/orders/:orderId" element={<OrderDetailPage />}/>
              <Route path="/orders/:orderId" element={<OrderDetailPage />}/>
              <Route path="/wishlist" element={<WishlistPage />}/>
              <Route path="/faq" element={<FaqPage />}/>
              <Route path="/contact" element={<ContactPage />}/>
              <Route path="/shipping" element={<ShippingPolicyPage />}/>
              <Route path="/returns" element={<ReturnsPolicyPage />}/>
              <Route path="/privacy" element={<PrivacyPolicyPage />}/>
              <Route path="/terms" element={<TermsOfServicePage />}/>
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />}/>
          </Routes>
        </React.Suspense>
        <Toaster position="bottom-right" richColors/>
      </HashRouter>
    );
}
export default App;
