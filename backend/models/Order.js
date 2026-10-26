import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, index: true },
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      id: { type: String, default: '' },
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, default: '' },
        variant: { type: String, default: '' },
      },
    ],
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: '' },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
      default: 'placed',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'failed', 'refunded'],
      default: 'paid',
    },
    paymentMethod: { type: String, default: 'Credit Card' },
    shippingAddress: { type: mongoose.Schema.Types.Mixed, default: {} },
    trackingNumber: { type: String, default: '' },
    timeline: [
      {
        _id: false,
        status: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        timestamp: { type: String, default: '' },
        completed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)
