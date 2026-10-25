# GoodFind — Luxury Commerce

GoodFind is a modern, high-performance e-commerce frontend engineered with React 19 , Vite, Tailwind CSS. GoodFind unifies a multi-category consumer storefront with an all-in-one merchant administration suite and a SaaS marketing platform.

---

## 🌟 Key Highlights & Features

### 🛍️ 1. Consumer Storefront Experience
- **Editorial Hero & Collections:** Immersive promotional hero, curated featured categories, trending releases, best sellers, and personalized recommendation carousels.
- **Product Discovery & Catalog:** Real-time search autocomplete dialog (`Cmd/Ctrl + K`), dynamic filtering by category, price slider, brand checkboxes, customer ratings, and stock status.
- **Product Detail Pages:** High-resolution image gallery with thumbnail preview, interactive variant selectors (colors, sizes, technical configurations), quantity adjustment, accordion specifications, warranty information, and customer review submission modal.
- **Slide-out Mini Cart & Dedicated Bag:** Spring-animated cart drawer (`MiniCartSheet`) and full `/cart` view with free shipping progress threshold meter, coupon validation (`WELCOME10`, `VIP50`), tax calculations, and item manipulation.
- **Multi-Step Checkout & Orders:** 3-step simulated checkout (Contact Info ➔ Insured Delivery Speeds ➔ Demo Payment Selection) with immediate state reduction, inventory subtraction, order receipt generation, canvas-confetti celebration, and real-time visual milestone tracking (`/orders/:orderId`).
- **Account & Wishlist:** Persisted wishlist with move-to-bag shortcuts, editable demo profile, address book manager, and order history archive.

### 📊 2. Merchant Admin Operations Console
- **Dashboard Telemetry:** KPI cards for Gross Revenue, Fulfilled Orders, Average Order Value, and Low Stock Alerts.
- **Interactive Recharts Visualizations:** Sales velocity area curves and category distribution bar charts.
- **Product Inventory Management (CRUD):** Live product creation, editing, stock modification, and deletion modal dialogs with instant storefront synchronization.
- **Order Fulfillment Workflow:** Interactive table to advance orders through fulfillment milestones (`Processing` ➔ `Shipped` ➔ `Delivered`).
- **Category Taxonomy:** Create, edit, and delete collections with live product counts.
- **Coupon & Discount Engine:** Add and toggle percentage or fixed-amount promotional codes with min-spend thresholds.
- **Review Moderation Queue:** Moderate and inspect customer testimonials.
- **Storefront Appearance Settings:** Configure announcement banners, brand headlines, currencies, and support emails with live updates.
- **Demo Subscription Management:** Switch between Starter, Growth, and Enterprise tiers with simulated usage quotas and bandwidth meters.

### 🚀 3. Commerce SaaS Platform Experience
- **SaaS Marketing Landing Page (`/saas`):** High-converting value propositions, live interactive dashboard preview, merchant benefits, transparent pricing matrix (monthly/annual toggle), and detailed feature comparison tables.
- **Interactive 7-Step Merchant Onboarding Wizard (`/onboarding`):** Welcome ➔ Store & brand setup ➔ Category selection ➔ Theme selection ➔ Seed catalog ➔ Live storefront preview ➔ Launch confirmation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework & Core** | React 19, Vite 8, TypeScript |
| **Styling & Tokens** | Tailwind CSS v3, PostCSS, tailwindcss-animate, Class Variance Authority (CVA) |
| **State Management** | Zustand (with `localStorage` persistence) |
| **Routing & Lazy Loading** | React Router DOM v7 (`React.lazy` code splitting) |
| **Data Architecture** | TanStack React Query v5 |
| **Icons & Animations** | Lucide React, Framer Motion, Canvas Confetti |
| **Data Visualizations** | Recharts v3 |
| **Toast Notifications** | Sonner |
| **Testing & Quality** | Vitest, React Testing Library, JSDOM, Oxlint |

---

## 📁 Project Architecture

```
Good Find/
├── public/
│   └── logo.svg                     # Vector brand logo
├── src/
│   ├── components/
│   │   ├── admin/                   # Dedicated Admin Sidebar & Layout
│   │   ├── cart/                    # Slide-out MiniCartSheet
│   │   ├── layout/                  # Navbar, AnnouncementBar, Footer, StoreLayout
│   │   ├── product/                 # ProductCard, variant chips, badges
│   │   ├── search/                  # SearchModal autocomplete dialog
│   │   └── ui/                      # Reusable UI primitives (Button, Card, Input, Dialog, Sheet, Tabs, Accordion)
│   ├── data/
│   │   └── mockData.ts              # Curated 33+ product dataset across 8 categories
│   ├── lib/
│   │   └── utils.ts                 # Formatting (currency, date) & cn twMerge utility
│   ├── pages/
│   │   ├── admin/                   # Admin Overview, Products, Orders, Categories, Discounts, Settings, Subscription
│   │   ├── saas/                    # SaaS Marketing Landing & 7-Step Onboarding Wizard
│   │   ├── store/                   # Home, Catalog, ProductDetail, Cart, Checkout, OrderConfirmation, Wishlist, Account, FAQs, Contact, Policies
│   │   └── NotFoundPage.tsx         # Custom 404 Route
│   ├── store/
│   │   ├── cartStore.ts             # Cart state, item math, coupon logic
│   │   ├── productStore.ts          # Master commerce store: products, orders, categories, settings
│   │   ├── themeStore.ts            # Light / Dark mode persistence
│   │   └── wishlistStore.ts         # Wishlist & recently viewed products
│   ├── test/
│   │   ├── cartStore.test.ts        # Pricing, coupon, and cart unit tests
│   │   ├── productStore.test.ts     # Master store CRUD and inventory tests
│   │   ├── components.test.tsx      # ProductCard and UI component tests
│   │   └── setup.ts                 # Vitest JSDOM environment setup
│   ├── types/
│   │   └── index.ts                 # Strict TypeScript schemas & entity contracts
│   ├── App.tsx                      # Route tree with code splitting & Suspense
│   ├── index.css                    # Tailwind design tokens, CSS variables & scrollbars
│   └── main.tsx                     # React DOM root mounting
├── package.json
├── tailwind.config.js
├── tsconfig.app.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies using `npm`:
```bash
npm install
```

### 2. Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Running Tests
Run the comprehensive test suite with Vitest:
```bash
npm test
```

### 4. Code Quality & Linting
Run static analysis with Oxlint:
```bash
npm run lint
```

### 5. Production Build
Compile TypeScript and bundle optimized assets:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 🎟️ Active Demo Promotional Codes
Use these codes during cart and checkout:
- `WELCOME10`: 10% off entire order (Min spend: $50)
- `VIP50`: $50 instant reduction on orders over $250
- `SPRING20`: 20% off seasonal collections (Min spend: $150)

---

## 📄 License
MIT License. Crafted for high-scale commerce demonstration.
