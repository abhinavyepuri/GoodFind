import 'dotenv/config'
import express from 'express'
import { connectDB } from './db.js'

import productRoutes from './routes/products.js'
import categoryRoutes from './routes/categories.js'
import orderRoutes from './routes/orders.js'
import reviewRoutes from './routes/reviews.js'
import couponsRoutes from './routes/coupons.js'
import settingsRoutes from './routes/settings.js'
import searchRoutes from './routes/search.js'

const { PORT = 5000, MONGO_URI } = process.env

if (!MONGO_URI) {
  console.error('MONGO_URI must be set in server/.env')
  process.exit(1)
}

await connectDB(MONGO_URI)

const app = express()

app.use(express.json())

// CORS headers for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/coupons', couponsRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/search', searchRoutes)

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.name, err.message)
  if (err.status) {
    return res.status(err.status).json({ error: err.message })
  }
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(409).json({ error: 'A record with that value already exists' })
  }
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => console.log(`GoodFind API running on http://localhost:${PORT}`))
