import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, index: true },
    productId: { type: String, required: true, index: true },
    author: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: '', trim: true },
    comment: { type: String, default: '', trim: true },
    verified: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Review', reviewSchema)
