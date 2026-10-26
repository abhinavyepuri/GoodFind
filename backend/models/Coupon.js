import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema(
  {
    id: { type: String, index: true },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountPercent: { type: Number, default: 0, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    minSpend: { type: Number, default: 0, min: 0 },
    description: { type: String, default: '' },
    active: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Coupon', couponSchema)
