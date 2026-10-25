import express from 'express'
import Product from '../models/Product.js'
import Review from '../models/Review.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = express.Router()

const SORTS = {
  price_asc: { price: 1, _id: 1 },
  price_desc: { price: -1, _id: -1 },
  rating: { rating: -1, _id: -1 },
  newest: { createdAt: -1, _id: -1 },
}

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// GET /api/products?q=&category=&sort=&page=&limit=&min=&max=&featured=&bestseller=
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { q, category, sort, min, max, featured, bestseller, newArrival } = req.query
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Number(req.query.limit) || 12)

    const filter = {}
    if (q) {
      const reg = new RegExp(escapeRegex(String(q).trim()), 'i')
      filter.$or = [
        { name: reg },
        { brand: reg },
        { description: reg },
        { category: reg },
        { tags: reg },
      ]
    }
    if (category) filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i')
    if (featured !== undefined) filter.featured = featured === 'true'
    if (bestseller !== undefined) filter.bestseller = bestseller === 'true'
    if (newArrival !== undefined) filter.newArrival = newArrival === 'true'
    if (min || max) {
      filter.price = {
        ...(min && { $gte: Number(min) }),
        ...(max && { $lte: Number(max) }),
      }
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(SORTS[sort] || SORTS.newest)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ])

    res.json({ items, total, page, pages: Math.ceil(total / limit) || 1 })
  })
)

// GET /api/products/featured
router.get(
  '/featured',
  asyncHandler(async (req, res) => {
    const featured = await Product.find({ featured: true })
      .sort({ rating: -1, createdAt: -1 })
      .limit(8)
      .lean()
    res.json(featured)
  })
)

// GET /api/products/categories
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const rows = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])
    res.json(rows.map((row) => ({ name: row._id, count: row.count })))
  })
)

// GET /api/products/:idOrSlug
router.get(
  '/:idOrSlug',
  asyncHandler(async (req, res) => {
    const { idOrSlug } = req.params
    let product = await Product.findOne({
      $or: [{ slug: idOrSlug }, { id: idOrSlug }],
    }).lean()
    if (!product && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug).lean()
    }
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  })
)

// GET /api/products/:idOrSlug/related
router.get(
  '/:idOrSlug/related',
  asyncHandler(async (req, res) => {
    const { idOrSlug } = req.params
    let product = await Product.findOne({
      $or: [{ slug: idOrSlug }, { id: idOrSlug }],
    }).lean()
    if (!product && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug).lean()
    }
    if (!product) return res.status(404).json({ error: 'Product not found' })

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(4)
      .sort({ rating: -1, createdAt: -1 })
      .lean()

    res.json(related)
  })
)

// POST /api/products
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, price, category, slug } = req.body
    if (!name || price === undefined || !category) {
      return res.status(400).json({ error: 'name, price and category are required' })
    }
    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const product = await Product.create({
      ...req.body,
      slug: cleanSlug,
      id: req.body.id || `prod-${Date.now()}`,
    })
    res.status(201).json(product)
  })
)

// PUT /api/products/:id
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findOneAndUpdate(
      { $or: [{ id: req.params.id }, { slug: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }] },
      req.body,
      { new: true, runValidators: true }
    )
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  })
)

// DELETE /api/products/:id
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findOneAndDelete({
      $or: [{ id: req.params.id }, { slug: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }],
    })
    if (!product) return res.status(404).json({ error: 'Product not found' })

    await Review.deleteMany({ productId: { $in: [product.id, product.slug, String(product._id)] } })
    res.json({ ok: true })
  })
)

export default router
