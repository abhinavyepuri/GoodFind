import express from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Coupon from '../models/Coupon.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = express.Router()

// GET /api/orders
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 }).lean()
    res.json(orders)
  })
)

// GET /api/orders/user/:userIdOrEmail
router.get(
  '/user/:userIdOrEmail',
  asyncHandler(async (req, res) => {
    const { userIdOrEmail } = req.params
    const orders = await Order.find({
      $or: [
        { 'customer.id': userIdOrEmail },
        { 'customer.email': userIdOrEmail.toLowerCase() },
      ],
    })
      .sort({ createdAt: -1 })
      .lean()
    res.json(orders)
  })
)

// GET /api/orders/:orderIdOrNumber
router.get(
  '/:orderIdOrNumber',
  asyncHandler(async (req, res) => {
    const { orderIdOrNumber } = req.params
    let order = await Order.findOne({
      $or: [{ orderNumber: orderIdOrNumber }, { id: orderIdOrNumber }],
    }).lean()
    if (!order && orderIdOrNumber.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(orderIdOrNumber).lean()
    }
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  })
)

// POST /api/orders
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const {
      customer,
      items,
      subtotal,
      discount,
      couponCode,
      shipping,
      tax,
      total,
      paymentMethod,
      shippingAddress,
    } = req.body

    // Explicit payload validation bounds
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' })
    }

    for (const item of items) {
      if (!item || !item.productId || !item.name) {
        return res.status(400).json({ error: 'Each order item must specify productId and name' })
      }
      const price = Number(item.price)
      const qty = Number(item.quantity)
      if (Number.isNaN(price) || price < 0) {
        return res.status(400).json({ error: `Invalid price for item "${item.name}"` })
      }
      if (!Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ error: `Invalid quantity for item "${item.name}"` })
      }
    }

    const numericTotal = Number(total)
    if (Number.isNaN(numericTotal) || numericTotal < 0) {
      return res.status(400).json({ error: 'Total amount must be a positive number' })
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000)
    const orderNumber = req.body.orderNumber || `GF-${randomNum}`
    const orderId = req.body.id || `ord-${Date.now()}`
    const trackingNumber = `GFTRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    const now = new Date()
    const timeline = [
      {
        status: 'placed',
        title: 'Order Placed',
        description: 'Payment authorized and receipt generated.',
        timestamp: now.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }),
        completed: true,
      },
      {
        status: 'processing',
        title: 'Preparing for Shipment',
        description: 'Items being picked and packed at distribution center.',
        timestamp: 'Pending',
        completed: false,
      },
    ]

    const order = await Order.create({
      id: orderId,
      orderNumber,
      customer: customer || {},
      items,
      subtotal: Number(subtotal || 0),
      discount: Number(discount || 0),
      couponCode: couponCode || '',
      shipping: Number(shipping || 0),
      tax: Number(tax || 0),
      total: Number(total || 0),
      status: 'placed',
      paymentStatus: 'paid',
      paymentMethod: paymentMethod || 'Demo Card',
      shippingAddress: shippingAddress || {},
      trackingNumber,
      timeline,
    })

    // Deduct stock
    for (const item of items) {
      if (item.productId) {
        await Product.findOneAndUpdate(
          { $or: [{ id: item.productId }, { _id: item.productId.match(/^[0-9a-fA-F]{24}$/) ? item.productId : null }] },
          { $inc: { stock: -Math.abs(Number(item.quantity) || 1) } }
        )
      }
    }

    // Update coupon usage if applicable
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: String(couponCode).trim().toUpperCase() },
        { $inc: { usageCount: 1 } }
      )
    }

    res.status(201).json(order)
  })
)

// PUT /api/orders/:id/status
router.put(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const { status, note } = req.body
    const validStatuses = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned']

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` })
    }

    const order = await Order.findOne({
      $or: [{ id: req.params.id }, { orderNumber: req.params.id }],
    })
    if (!order) return res.status(404).json({ error: 'Order not found' })

    if (status) {
      order.status = status
      order.timeline.push({
        status,
        title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description: note || `Status updated to ${status}`,
        timestamp: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }),
        completed: true,
      })
      await order.save()
    }

    res.json(order)
  })
)

export default router
