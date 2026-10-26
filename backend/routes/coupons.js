import express from 'express'
import Coupon from '../models/Coupon.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = express.Router()

// GET /api/coupons — active list
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const coupons = await Coupon.find().sort({ discountAmount: -1, discountPercent: -1 }).lean()
    res.json(coupons)
  })
)

// POST /api/coupons/validate — validate promo code against subtotal
router.post(
  '/validate',
  asyncHandler(async (req, res) => {
    const code = String(req.body.code || '').trim().toUpperCase()
    const subtotal = Number(req.body.subtotal) || 0

    if (!code) return res.status(400).json({ error: 'Please enter a coupon code' })
    if (subtotal <= 0) return res.status(400).json({ error: 'Subtotal must be greater than 0' })

    const coupon = await Coupon.findOne({ code, active: true }).lean()
    if (!coupon) return res.status(404).json({ error: 'Invalid or inactive promo code' })

    if (subtotal < coupon.minSpend) {
      return res.status(400).json({
        error: `Minimum spend of ₹${coupon.minSpend} required for code ${coupon.code}`,
      })
    }

    let discount = 0
    if (coupon.discountPercent) {
      discount = (subtotal * coupon.discountPercent) / 100
    } else if (coupon.discountAmount) {
      discount = Math.min(coupon.discountAmount, subtotal)
    }

    discount = Math.round(discount * 100) / 100
    const finalTotal = Math.max(0, Math.round((subtotal - discount) * 100) / 100)

    res.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount: coupon.discountAmount,
        minSpend: coupon.minSpend,
        description: coupon.description,
      },
      discount,
      finalTotal,
    })
  })
)

// POST /api/coupons — create coupon
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { code, discountPercent, discountAmount, minSpend, description } = req.body
    if (!code || typeof code !== 'string') return res.status(400).json({ error: 'Code is required' })

    const cleanCode = String(code).trim().toUpperCase()
    if (cleanCode.length < 3) {
      return res.status(400).json({ error: 'Coupon code must be at least 3 characters' })
    }

    const numPercent = Number(discountPercent || 0)
    const numAmount = Number(discountAmount || 0)
    const numMinSpend = Number(minSpend || 0)

    if (numPercent < 0 || numPercent > 100) {
      return res.status(400).json({ error: 'Discount percent must be between 0 and 100' })
    }
    if (numAmount < 0 || numMinSpend < 0) {
      return res.status(400).json({ error: 'Discount amount and minimum spend cannot be negative' })
    }
    if (numPercent === 0 && numAmount === 0) {
      return res.status(400).json({ error: 'Either discountPercent or discountAmount must be greater than zero' })
    }

    const existing = await Coupon.findOne({ code: cleanCode })
    if (existing) return res.status(409).json({ error: 'Coupon code already exists' })

    const coupon = await Coupon.create({
      id: `c-${Date.now()}`,
      code: cleanCode,
      discountPercent: numPercent,
      discountAmount: numAmount,
      minSpend: numMinSpend,
      description: description || '',
      active: true,
      usageCount: 0,
    })

    res.status(201).json(coupon)
  })
)

// DELETE /api/coupons/:id
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const coupon = await Coupon.findOneAndDelete({
      $or: [{ id: req.params.id }, { code: req.params.id.toUpperCase() }],
    })
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' })
    res.json({ ok: true })
  })
)

export default router
