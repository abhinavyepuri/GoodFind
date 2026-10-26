import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    id: { type: String, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
  },
  { timestamps: true }
)

// Ensure id mirrors _id string if not provided
userSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = this._id.toString()
  }
  next()
})

userSchema.methods.verifyPassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash)
}

userSchema.statics.hashPassword = async function (password) {
  return bcrypt.hash(password, 10)
}

export default mongoose.model('User', userSchema)
