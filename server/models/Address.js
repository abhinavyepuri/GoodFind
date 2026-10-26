import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema(
  {
    id: { type: String, index: true },
    userId: { type: String, required: true, index: true },
    title: { type: String, default: 'Home', trim: true },
    fullName: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    apartment: { type: String, default: '', trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, default: 'United States', trim: true },
    phone: { type: String, default: '', trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
)

addressSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `addr-${this._id.toString()}`
  }
  next()
})

export default mongoose.model('Address', addressSchema)
