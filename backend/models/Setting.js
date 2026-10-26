import mongoose from 'mongoose'

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'store_settings' },
    storeName: { type: String, default: 'GoodFind Luxury Commerce' },
    tagline: { type: String, default: 'Curated objects for mindful living & focused work.' },
    currency: { type: String, default: 'INR' },
    supportEmail: { type: String, default: 'concierge@goodfind.io' },
    phone: { type: String, default: '+1 (800) 555-GOOD' },
    announcement: {
      enabled: { type: Boolean, default: true },
      text: { type: String, default: '' },
      linkText: { type: String, default: '' },
      linkUrl: { type: String, default: '' },
    },
    appearance: {
      accentColor: { type: String, default: '#7C3AED' },
      brandBadge: { type: String, default: 'Verified Luxury Storefront' },
      heroHeadline: { type: String, default: '' },
      heroSubheadline: { type: String, default: '' },
    },
  },
  { timestamps: true }
)

export default mongoose.model('Setting', settingSchema)
