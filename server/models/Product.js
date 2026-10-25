import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    id: { type: String, index: true },
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: String, required: true, trim: true, index: true },
    brand: { type: String, trim: true, default: '' },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, trim: true, default: '' },
    images: { type: [String], default: [] },
    image: { type: String, default: '' },
    featured: { type: Boolean, default: false, index: true },
    bestseller: { type: Boolean, default: false, index: true },
    newArrival: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    variants: { type: mongoose.Schema.Types.Mixed, default: {} },
    specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
    shippingInfo: { type: String, default: '' },
    warrantyInfo: { type: String, default: '' },
    returnPolicy: { type: String, default: '' },
  },
  { timestamps: true }
)

// Search index for text queries
productSchema.index(
  { name: 'text', description: 'text', brand: 'text', category: 'text', tags: 'text' },
  { weights: { name: 10, brand: 5, category: 3, description: 1 } }
)

export default mongoose.model('Product', productSchema)
