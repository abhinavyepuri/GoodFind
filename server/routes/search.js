import express from 'express'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = express.Router()

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// GET /api/search/suggestions?q=... — autocomplete suggestions
router.get(
  '/suggestions',
  asyncHandler(async (req, res) => {
    const rawQ = String(req.query.q || '').trim()
    if (!rawQ) {
      return res.json({ products: [], categories: [], brands: [] })
    }

    const reg = new RegExp(escapeRegex(rawQ), 'i')

    const [matchedProducts, matchedCategories, matchedBrands] = await Promise.all([
      // Top 5 product matches
      Product.find({ $or: [{ name: reg }, { tags: reg }] }, 'name slug category price images image rating')
        .sort({ rating: -1, reviewCount: -1 })
        .limit(5)
        .lean(),

      // Matching categories
      Category.find({ name: reg }, 'name slug image').limit(3).lean(),

      // Matching brands
      Product.distinct('brand', { brand: reg, brand: { $ne: '' } }),
    ])

    res.json({
      products: matchedProducts,
      categories: matchedCategories,
      brands: matchedBrands.slice(0, 3),
    })
  })
)

export default router
