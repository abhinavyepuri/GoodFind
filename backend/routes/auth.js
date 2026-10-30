import express from 'express'
import User from '../models/User.js'
import Address from '../models/Address.js'
import Order from '../models/Order.js'
import { requireAuth, resolveUser } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = express.Router()

// POST /api/auth/register
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password, name, phone, address, orderNumber, orderId } = req.body || {}

    const cleanEmail = String(email || '').trim().toLowerCase()
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: 'A valid email address is required.' })
    }

    const cleanPassword = String(password || '')
    if (!cleanPassword || cleanPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' })
    }

    const existingUser = await User.findOne({ email: cleanEmail })
    if (existingUser) {
      return res.status(409).json({ error: 'An account with that email already exists.' })
    }

    const passwordHash = await User.hashPassword(cleanPassword)
    const userId = `usr-${Date.now()}`
    const cleanName = (String(name || '').trim() || cleanEmail.split('@')[0])
    const cleanPhone = String(phone || '').trim()

    const user = await User.create({
      id: userId,
      email: cleanEmail,
      passwordHash,
      name: cleanName,
      phone: cleanPhone,
      role: 'customer',
    })

    // Create initial saved address if supplied
    let savedAddresses = []
    if (address && (address.street || address.street_address)) {
      const street = String(address.street || address.street_address || '').trim()
      const city = String(address.city || '').trim() || 'Mumbai'
      const state = String(address.state || '').trim() || 'Maharashtra'
      const postalCode = String(address.postalCode || address.postal_code || address.zip || '').trim() || '400050'
      const country = String(address.country || '').trim() || 'India'
      const fullName = String(address.fullName || address.full_name || cleanName).trim() || cleanName
      const phoneAddr = String(address.phone || address.phone_number || cleanPhone || '').trim()

      const newAddr = await Address.create({
        id: `addr-${Date.now()}`,
        userId: user.id,
        title: String(address.title || 'Default Address').trim(),
        fullName,
        street,
        apartment: String(address.apartment || '').trim(),
        city,
        state,
        postalCode,
        country,
        phone: phoneAddr,
        isDefault: true,
      })
      savedAddresses = [newAddr]
    }

    // Link past order if specified (e.g. from checkout or post-purchase conversion)
    if (orderNumber || orderId) {
      await Order.updateMany(
        {
          $or: [
            ...(orderNumber ? [{ orderNumber }] : []),
            ...(orderId ? [{ id: orderId }] : []),
            { 'customer.email': cleanEmail },
          ],
        },
        {
          $set: {
            'customer.id': user.id,
            'customer.name': user.name,
          },
        }
      )
    }

    if (req.session) {
      req.session.userId = user.id
    }

    res.cookie('goodfind_session', user.id, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    const sanitizedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    }

    res.status(201).json({
      user: sanitizedUser,
      addresses: savedAddresses,
      token: user.id,
    })
  })
)

// POST /api/auth/login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const cleanEmail = (email || '').trim().toLowerCase()
    if (!cleanEmail || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: cleanEmail })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const isMatch = await user.verifyPassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    if (req.session) {
      req.session.userId = user.id
    }

    res.cookie('goodfind_session', user.id, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    const addresses = await Address.find({ userId: user.id }).sort({ isDefault: -1, createdAt: -1 }).lean()

    const sanitizedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    }

    res.json({
      user: sanitizedUser,
      addresses,
      token: user.id,
    })
  })
)

// GET /api/auth/me
router.get(
  '/me',
  asyncHandler(async (req, res) => {
    const user = await resolveUser(req)
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated.' })
    }

    const addresses = await Address.find({ userId: user.id }).sort({ isDefault: -1, createdAt: -1 }).lean()

    const sanitizedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    }

    res.json({
      user: sanitizedUser,
      addresses,
      token: user.id,
    })
  })
)

// POST /api/auth/logout
router.post(
  '/logout',
  (req, res) => {
    if (req.session) {
      req.session.destroy(() => {})
    }
    res.clearCookie('goodfind_session')
    res.json({ success: true, message: 'Signed out successfully.' })
  }
)

export default router
