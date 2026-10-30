import 'dotenv/config'
import express from 'express'
import { connectDB } from './db.js'

import session from 'express-session'
import MongoStore from 'connect-mongo'
import productRoutes from './routes/products.js'
import categoryRoutes from './routes/categories.js'
import orderRoutes from './routes/orders.js'
import reviewRoutes from './routes/reviews.js'
import couponsRoutes from './routes/coupons.js'
import settingsRoutes from './routes/settings.js'
import searchRoutes from './routes/search.js'
import authRoutes from './routes/auth.js'
import addressRoutes from './routes/addresses.js'
import healthRoutes from './routes/health.js'
import User from './models/User.js'

import fs from 'node:fs'

process.on('uncaughtException', (err) => {
  try { fs.appendFileSync('debug.log', `[FATAL uncaughtException] ${err?.stack || err}\n`) } catch {}
  console.error('[FATAL uncaughtException]', err)
})
process.on('unhandledRejection', (reason) => {
  try { fs.appendFileSync('debug.log', `[FATAL unhandledRejection] ${reason?.stack || reason}\n`) } catch {}
  console.error('[FATAL unhandledRejection]', reason)
})

const { PORT = 5000, MONGO_URI } = process.env

if (!MONGO_URI) {
  console.error('MONGO_URI must be set in backend/.env')
  process.exit(1)
}

await connectDB(MONGO_URI)

// Auto-seed/verify Admin user from environment variables
try {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@goodfind.test').toLowerCase().trim()
  const existingAdmin = await User.findOne({ email: adminEmail })
  const adminPassword = process.env.ADMIN_PASSWORD || 'admingf'
  if (!existingAdmin) {
    const passwordHash = await User.hashPassword(adminPassword)
    await User.create({
      id: 'usr-admin-01',
      email: adminEmail,
      passwordHash,
      name: process.env.ADMIN_NAME || 'GoodFind Admin',
      role: 'admin',
    })
    console.log(`[Init] Admin account seeded: ${adminEmail}`)
  } else {
    const isMatch = await existingAdmin.verifyPassword(adminPassword)
    if (!isMatch) {
      existingAdmin.passwordHash = await User.hashPassword(adminPassword)
      await existingAdmin.save()
      console.log(`[Init] Admin password synchronized from .env`)
    }
  }
} catch (adminErr) {
  console.warn('[Init] Admin auto-seed check:', adminErr.message)
}

const app = express()

// Trust Render's reverse proxy for secure cookies and correct protocol detection
app.set('trust proxy', 1)

app.use(express.json())

// CORS headers supporting credentials for deployed frontend
app.use((req, res, next) => {
  const origin = req.headers.origin || '*'
  res.header('Access-Control-Allow-Origin', origin)
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'goodfind-session-secret-key-123',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      ttl: 30 * 24 * 60 * 60, // 30 days
      autoRemove: 'native',
    }),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  })
)

app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/coupons', couponsRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user/addresses', addressRoutes)
app.use('/api/health', healthRoutes)
app.use('/health', healthRoutes)

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.name, err.message)
  if (res.headersSent) {
    return next(err)
  }
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`GoodFind API running on http://localhost:${PORT}`)

  // Periodic health keep-alive ping (14 minutes default, configurable via PING_INTERVAL_MINS)
  const PING_INTERVAL_MINS = Number(process.env.PING_INTERVAL_MINS) || 14
  const PING_INTERVAL_MS = PING_INTERVAL_MINS * 60 * 1000
  const baseUrl = process.env.RENDER_EXTERNAL_URL || process.env.APP_URL || ''
  const pingUrl = baseUrl
    ? `${baseUrl.replace(/\/$/, '')}/api/health`
    : `http://127.0.0.1:${PORT}/api/health`

  const pingTimer = setInterval(async () => {
    try {
      const res = await fetch(pingUrl)
      console.log(`[Health Ping] ${new Date().toISOString()} -> ${pingUrl} (${res.status})`)
    } catch (err) {
      console.warn('[Health Ping Error]', err.message)
    }
  }, PING_INTERVAL_MS)
  pingTimer.unref()
})
