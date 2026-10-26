import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './db.js'

import Category from './models/Category.js'
import Product from './models/Product.js'
import Order from './models/Order.js'
import Review from './models/Review.js'
import Coupon from './models/Coupon.js'
import Setting from './models/Setting.js'
import User from './models/User.js'
import Address from './models/Address.js'

import {
  mockCategories,
  mockProducts,
  mockOrders,
  mockReviews,
  mockCoupons,
  mockCommunityUsers,
  mockCommunityAddresses,
  initialStoreSettings,
} from '../frontend/src/data/mockData.js'

const { MONGO_URI } = process.env

if (!MONGO_URI) {
  console.error('MONGO_URI is missing in backend/.env.')
  process.exit(1)
}

await connectDB(MONGO_URI)

console.log('--- Discarding all old data & profiles (admin, buyers, orders, addresses) ---')

// 1. Drop all collections to clear both data and obsolete indexes
const collections = await mongoose.connection.db.listCollections().toArray()
for (const col of collections) {
  if (col.name !== 'system.indexes') {
    try {
      await mongoose.connection.db.dropCollection(col.name)
      console.log(`Dropped collection: ${col.name}`)
    } catch (err) {
      console.warn(`Could not drop ${col.name}: ${err.message}`)
    }
  }
}

console.log('--- Seeding fresh curated catalog and community data ---')

// 2. Categories
const insertedCategories = await Category.insertMany(mockCategories)
console.log(`Seeded ${insertedCategories.length} categories`)

// 3. Products
const insertedProducts = await Product.insertMany(mockProducts)
console.log(`Seeded ${insertedProducts.length} products`)

// 4. Coupons
const insertedCoupons = await Coupon.insertMany(mockCoupons)
console.log(`Seeded ${insertedCoupons.length} coupons`)

// 5. Store Settings
const storeSetting = await Setting.create({
  key: 'store_settings',
  ...initialStoreSettings,
})
console.log(`Seeded store settings: "${storeSetting.storeName}"`)

// 6. Admin User
const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gf.test').toLowerCase().trim()
const adminPassword = process.env.ADMIN_PASSWORD || 'admingf'
const adminHash = await User.hashPassword(adminPassword)
await User.create({
  id: 'usr-admin-01',
  email: adminEmail,
  passwordHash: adminHash,
  name: process.env.ADMIN_NAME || 'GoodFind Admin',
  role: 'admin',
})
console.log(`Seeded admin account: ${adminEmail}`)

// 7. Parametric Community (Users, Indian Addresses, Varied Orders, Reviews)
for (const u of mockCommunityUsers) {
  const passwordHash = await User.hashPassword(u.plainPassword)
  await User.create({
    id: u.id,
    email: u.email,
    passwordHash,
    name: u.name,
    phone: u.phone,
    role: u.role,
  })
}
console.log(`Seeded ${mockCommunityUsers.length} varied community users (email: name@gf.test)`)

// Seed Indian Addresses
if (mockCommunityAddresses?.length > 0) {
  await Address.insertMany(mockCommunityAddresses)
  console.log(`Seeded ${mockCommunityAddresses.length} Indian shipping destinations`)
}

// Seed Multi-Status Orders
await Order.insertMany(mockOrders)
console.log(`Seeded ${mockOrders.length} orders across statuses (delivered, shipped, processing, cancelled, returned)`)

// Seed Community Reviews
await Review.insertMany(mockReviews)
console.log(`Seeded ${mockReviews.length} authenticated reviews (ratings 3.8 - 5.0)`)

console.log('Seed completed successfully.')

await mongoose.disconnect()
