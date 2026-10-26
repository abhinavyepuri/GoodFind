import express from 'express'
import Category from '../models/Category.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = express.Router()

// GET /api/categories
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ featured: -1, name: 1 }).lean()
    res.json(categories)
  })
)

// GET /api/categories/:slug
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const category = await Category.findOne({
      $or: [{ slug: req.params.slug }, { id: req.params.slug }],
    }).lean()
    if (!category) return res.status(404).json({ error: 'Category not found' })
    res.json(category)
  })
)

export default router
