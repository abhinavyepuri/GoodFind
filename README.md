# GoodFind — Luxury Commerce

A modern e-commerce platform built with **React 19, Vite, Tailwind CSS, Node.js/Express, and MongoDB**.

---

## 🌟 Architecture & Stack

| Layer | Technologies |
| --- | --- |
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
│   │   ├── data/           # Curated catalog & shared community generator (Indian addresses, reviews, users)
│   │   ├── pages/          # Catalog, Category, ProductDetail, Cart, Checkout, OrderDetail, Policies
│   │   ├── store/          # Zustand commerce stores (products, cart, wishlist, theme, auth)
│   │   └── App.jsx         # Storefront routing tree
│   └── package.json
├── backend/                # Express REST API
│   ├── models/             # User, Address, Category, Product, Order, Review, Coupon, Setting
│   ├── routes/             # Auth, Categories, Products, Orders, Reviews, Coupons, Settings, Search
│   ├── utils/              # communityGenerator.js (Reusable parametric community dataset engine)
│   ├── seed.js             # Wipes DB & seeds catalog + lively parametric community data
│   └── index.js            # Express API server
└── package.json            # Root workspace config (`frontend`, `backend`)
```

---

## 🚀 How to Run the Project

### 📥 Scenario A: First-Time Setup (After Fresh `git clone`)

1. **Install Root and Workspace Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   In `backend/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/goodfind?retryWrites=true&w=majority
   SESSION_SECRET=goodfind-session-secret-key-123
   ADMIN_NAME=GoodFind Admin
   ADMIN_EMAIL=admin@gf.test
   ADMIN_PASSWORD=admingf
   ```

3. **Initialize & Seed the MongoDB Database**:
   ```bash
   npm run seed
   ```
   *(Wipes previous collections, seeds catalog, Indian shipping destinations, and all parametric community accounts, reviews, and orders).*

4. **Start the Development Servers**:
   ```bash
   # Terminal 1 — Start the Node/Express backend API (port 5000):
   npm run dev:backend

   # Terminal 2 — Start the React 19 / Vite storefront (port 5173):
   npm run dev:frontend
   ```
   - Storefront: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

### ⚡ Scenario B: Subsequent Runs (Project Already Set Up Previously)

If dependencies are already installed and the database is already seeded, **you do NOT need to run `npm install` or `npm run seed` again.**

Simply start the servers:
```bash
npm run dev:backend    # (Port 5000)
npm run dev:frontend   # (Port 5173)
```
