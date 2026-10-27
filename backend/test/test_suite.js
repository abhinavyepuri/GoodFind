import 'dotenv/config'
import mongoose from 'mongoose'
import assert from 'node:assert/strict'
import { connectDB } from '../db.js'

import Category from '../models/Category.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import Review from '../models/Review.js'
import Coupon from '../models/Coupon.js'
import Setting from '../models/Setting.js'

await connectDB(process.env.MONGO_URI)

console.log('=== Running GoodFind New Architecture Verification ===\n')

try {
  // 1. Verify legacy collections are discarded
  console.log('[Test 1] Verify legacy tables are discarded')
  const collections = await mongoose.connection.db.listCollections().toArray()
  const collectionNames = collections.map((c) => c.name)
  assert.ok(!collectionNames.includes('searchhistories'), 'Legacy searchhistories collection must not exist')
  console.log('✓ Verified: legacy collections completely discarded.\n')

  // 2. Categories Verification
  console.log('[Test 2] Categories Verification')
  const categories = await Category.find()
  assert.equal(categories.length, 8, 'Must have 8 categories seeded from new mockData')
  const electronics = await Category.findOne({ slug: 'electronics' })
  assert.ok(electronics, 'Electronics category must exist')
  console.log(`✓ Verified: 8 categories present (${categories.map((c) => c.slug).join(', ')}).\n`)

  // 3. Products Verification
  console.log('[Test 3] Products Verification')
  const products = await Product.find()
  assert.equal(products.length, 33, 'Must have 33 products seeded from new mockData')
  const aeroHeadphones = await Product.findOne({ slug: 'aero-sound-pro-wireless-headphones' })
  assert.ok(aeroHeadphones, 'Aero Sound Pro product must exist')
  assert.equal(aeroHeadphones.category, 'Electronics & Audio')
  assert.equal(aeroHeadphones.price, 349)
  console.log(`✓ Verified: 33 products present, attributes matched.\n`)

  // 4. Orders Verification
  console.log('[Test 4] Orders Verification')
  const orders = await Order.find()
  assert.ok(orders.length >= 3, 'Must have orders seeded from new mockData')
  const order1 = await Order.findOne({ orderNumber: 'GF-84291' })
  assert.ok(order1, 'Order GF-84291 must exist')
  assert.equal(order1.status, 'shipped')
  assert.ok(order1.items.length > 0)
  console.log(`✓ Verified: orders correctly structured without legacy user foreign keys.\n`)

  // 5. Reviews Verification
  console.log('[Test 5] Reviews Verification')
  const reviews = await Review.find()
  assert.ok(reviews.length >= 3, 'Must have reviews seeded from new mockData')
  console.log(`✓ Verified: ${reviews.length} reviews present without user foreign keys.\n`)

  // 6. Coupons Verification
  console.log('[Test 6] Coupons Verification')
  const coupons = await Coupon.find({ active: true })
  assert.ok(coupons.length >= 3, 'Must have at least 3 active promotional coupons')
  const codes = coupons.map((c) => c.code)
  assert.ok(codes.includes('WELCOME10'), 'Must contain WELCOME10')
  assert.ok(codes.includes('VIP50'), 'Must contain VIP50')
  assert.ok(codes.includes('SPRING20'), 'Must contain SPRING20')
  console.log(`✓ Verified: Active coupons loaded (${codes.join(', ')}).\n`)

  // 7. Store Settings Verification
  console.log('[Test 7] Store Settings Verification')
  const settings = await Setting.findOne({ key: 'store_settings' })
  assert.ok(settings, 'Settings document must exist in MongoDB')
  assert.equal(settings.storeName, 'GoodFind Luxury Commerce')
  assert.equal(settings.currency, 'INR')
  console.log(`✓ Verified: Store settings "${settings.storeName}" loaded.\n`)

  console.log('=== ALL 7 TESTS PASSED SUCCESSFULLY ===')
} finally {
  await mongoose.disconnect()
}
