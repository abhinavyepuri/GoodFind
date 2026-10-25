# GoodFind — Luxury Commerce

A modern e-commerce platform built with **React 19, Vite, Tailwind CSS, Node.js/Express, and MongoDB**.

---

## 🌟 Architecture & Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Zustand, React Router DOM, Framer Motion, Lucide Icons, Sonner |
| **Backend** | Node.js, Express, Mongoose |
| **Database** | MongoDB Atlas |

---

## 📁 Repository Structure

```
GoodFind/
├── frontend/               # React 19 storefront application
│   ├── src/
│   │   ├── components/     # UI primitives, cart sheet, product card, search modal, navbar, footer
│   │   ├── data/           # Curated catalog (33+ items across 8 categories)
│   │   ├── pages/          # Catalog, Category, ProductDetail, Cart, Checkout, OrderDetail, Policies
│   │   ├── store/          # Zustand commerce stores (products, cart, wishlist, theme)
│   │   └── App.jsx         # Storefront routing tree
│   └── package.json
├── server/                 # Express REST API
│   ├── models/             # Category, Product, Order, Review, Coupon, Setting
│   ├── routes/             # Categories, Products, Orders, Reviews, Coupons, Settings, Search
│   ├── seed.js             # Seeds database directly from frontend catalog data
│   └── index.js            # Express API server
└── package.json            # Root workspace config (`frontend`, `server`)
```

---

## 🚀 Getting Started

### 1. Database Setup

1. Configure your MongoDB Atlas connection in `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/goodfind?retryWrites=true&w=majority
   ```

2. Seed the database with the curated catalog:
   ```bash
   npm run seed -w server
   # or: cd server && node seed.js
   ```

### 2. Run the Development Servers

1. Start the API server:
   ```bash
   cd server
   npm run dev
   ```
   API runs on `http://localhost:5000`.

2. Start the Frontend:
   ```bash
   cd frontend
   npm run dev
   ```
   Storefront opens at `http://localhost:5173`.

---

## 🧪 Running Tests

- **Frontend tests (Vitest):**
  ```bash
  npm test -w frontend
  ```

- **Backend verification test suite:**
  ```bash
  cd server && node test/test_suite.js
  ```

---

## 🎟️ Active Promotional Coupons

- `WELCOME10`: 10% off your entire first order (Min spend: ₹50)
- `VIP50`: ₹50 instant discount on orders over ₹250
- `SPRING20`: 20% off seasonal collections (Min spend: ₹150)
