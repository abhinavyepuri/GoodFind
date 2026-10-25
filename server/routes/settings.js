import express from 'express'
import Setting from '../models/Setting.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = express.Router()

// GET /api/settings
router.get(
  '/',
  asyncHandler(async (req, res) => {
    let setting = await Setting.findOne({ key: 'store_settings' }).lean()
    if (!setting) {
      setting = await Setting.create({ key: 'store_settings' })
    }
    res.json(setting)
  })
)

// PUT /api/settings
router.put(
  '/',
  asyncHandler(async (req, res) => {
    const setting = await Setting.findOneAndUpdate(
      { key: 'store_settings' },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true, lean: true }
    )
    res.json(setting)
  })
)

export default router
