import express from 'express'

const router = express.Router()

// GET /api/health - ultra-lightweight public health check for Render keep-alive
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

export default router
