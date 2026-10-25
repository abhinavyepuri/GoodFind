import express from 'express'
import Review from '../models/Review.js'
import Product from '../models/Product.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = express.Router()

const round1 = (n) => Math.round(n * 10) / 10

// Recalculate product rating & reviewCount
async function refreshProductRating(productId) {
  const reviews = await Review.find({ productId }).lean()
  if (!reviews.length) {
    await Product.findOneAndUpdate(
      { $or: [{ id: productId }, { slug: productId }, { _id: productId.match(/^[0-9a-fA-F]{24}$/) ? productId : null }] },
      { rating: 0, reviewCount: 0 }
    )
    return
  }
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  await Product.findOneAndUpdate(
    { $or: [{ id: productId }, { slug: productId }, { _id: productId.match(/^[0-9a-fA-F]{24}$/) ? productId : null }] },
    { rating: round1(avg), reviewCount: reviews.length }
  )
}

// GET /api/reviews/:productId
router.get(
  '/:productId',
  asyncHandler(async (req, res) => {
    const { productId } = req.params
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).lean()
    res.json(reviews)
  })
)

// POST /api/reviews/:productId
router.post(
  '/:productId',
  asyncHandler(async (req, res) => {
    const { productId } = req.params
    const { author, rating, title, comment, avatar } = req.body

    const numRating = Number(rating)
    if (!author || !rating || Number.isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Author is required and rating must be a number between 1 and 5' })
    }

    const review = await Review.create({
      id: `rev-${Date.now()}`,
      productId,
      author: String(author).trim(),
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      rating: Number(rating),
      title: String(title || '').trim(),
      comment: String(comment || '').trim(),
      verified: true,
      helpfulCount: 0,
    })

    await refreshProductRating(productId)
    res.status(201).json(review)
  })
)

// DELETE /api/reviews/:id
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const review = await Review.findOneAndDelete({
      $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }],
    })
    if (!review) return res.status(404).json({ error: 'Review not found' })

    await refreshProductRating(review.productId)
    res.json({ ok: true })
  })
)

export default router
