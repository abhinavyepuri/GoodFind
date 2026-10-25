import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './db.js'

import Category from './models/Category.js'
import Product from './models/Product.js'
import Order from './models/Order.js'
import Review from './models/Review.js'
import Coupon from './models/Coupon.js'
import Setting from './models/Setting.js'

import {
  mockCategories,
  mockProducts,
  mockOrders,
  mockReviews,
  mockCoupons,
  initialStoreSettings,
} from '../frontend/src/data/mockData.js'

const { MONGO_URI } = process.env

if (!MONGO_URI) {
  console.error('MONGO_URI is missing in server/.env.')
  process.exit(1)
}

await connectDB(MONGO_URI)

console.log('--- Discarding all old data & profiles (admin, seller, buyer) ---')

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

console.log('--- Seeding fresh data from new frontend mockData ---')

// 2. Categories
const insertedCategories = await Category.insertMany(mockCategories)
console.log(`Seeded ${insertedCategories.length} categories`)

// 3. Products
const insertedProducts = await Product.insertMany(mockProducts)
console.log(`Seeded ${insertedProducts.length} products`)

// 4. Orders
const insertedOrders = await Order.insertMany(mockOrders)
console.log(`Seeded ${insertedOrders.length} orders`)

// 5. Reviews
const insertedReviews = await Review.insertMany(mockReviews)
console.log(`Seeded ${insertedReviews.length} reviews`)

// 6. Coupons
const insertedCoupons = await Coupon.insertMany(mockCoupons)
console.log(`Seeded ${insertedCoupons.length} coupons`)

// 7. Store Settings
const storeSetting = await Setting.create({
  key: 'store_settings',
  ...initialStoreSettings,
})
console.log(`Seeded store settings: "${storeSetting.storeName}"`)

console.log('Seed completed successfully. No legacy user profiles (admin, seller, buyer) seeded.')

await mongoose.disconnect()
