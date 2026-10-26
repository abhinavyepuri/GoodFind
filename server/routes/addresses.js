import express from 'express'
import Address from '../models/Address.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = express.Router()

// All address routes require authentication
router.use(requireAuth)

// GET /api/user/addresses
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const addresses = await Address.find({ userId: req.user.id })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean()
    res.json(addresses)
  })
)

// POST /api/user/addresses
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { title, fullName, street, apartment, city, state, postalCode, country, phone, isDefault } = req.body

    if (!fullName || !street || !city || !state || !postalCode) {
      return res.status(400).json({ error: 'fullName, street, city, state, and postalCode are required.' })
    }

    const existingCount = await Address.countDocuments({ userId: req.user.id })
    const shouldBeDefault = Boolean(isDefault) || existingCount === 0

    if (shouldBeDefault) {
      await Address.updateMany({ userId: req.user.id }, { $set: { isDefault: false } })
    }

    const address = await Address.create({
      id: `addr-${Date.now()}`,
      userId: req.user.id,
      title: title || 'Home',
      fullName: fullName.trim(),
      street: street.trim(),
      apartment: (apartment || '').trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: (country || 'United States').trim(),
      phone: (phone || req.user.phone || '').trim(),
      isDefault: shouldBeDefault,
    })

    const allAddresses = await Address.find({ userId: req.user.id })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean()

    res.status(201).json({ address, addresses: allAddresses })
  })
)

// PUT /api/user/addresses/:id/default
router.put(
  '/:id/default',
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const target = await Address.findOne({
      $or: [{ id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
      userId: req.user.id,
    })

    if (!target) {
      return res.status(404).json({ error: 'Address not found or does not belong to you.' })
    }

    await Address.updateMany({ userId: req.user.id }, { $set: { isDefault: false } })
    target.isDefault = true
    await target.save()

    const allAddresses = await Address.find({ userId: req.user.id })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean()

    res.json({ success: true, defaultAddress: target, addresses: allAddresses })
  })
)

// DELETE /api/user/addresses/:id
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const target = await Address.findOne({
      $or: [{ id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
      userId: req.user.id,
    })

    if (!target) {
      return res.status(404).json({ error: 'Address not found or does not belong to you.' })
    }

    const wasDefault = target.isDefault
    await target.deleteOne()

    // If deleted address was default, promote first remaining address
    if (wasDefault) {
      const remaining = await Address.findOne({ userId: req.user.id }).sort({ createdAt: -1 })
      if (remaining) {
        remaining.isDefault = true
        await remaining.save()
      }
    }

    const allAddresses = await Address.find({ userId: req.user.id })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean()

    res.json({ success: true, addresses: allAddresses })
  })
)

export default router
