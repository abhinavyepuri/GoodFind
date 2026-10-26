import User from '../models/User.js'

export async function resolveUser(req) {
  let userId = req.session?.userId

  if (!userId && req.headers.authorization) {
    const authHeader = req.headers.authorization
    if (authHeader.startsWith('Bearer ')) {
      userId = authHeader.substring(7).trim()
    }
  }

  if (!userId && req.cookies?.goodfind_session) {
    userId = req.cookies.goodfind_session
  }

  if (!userId) return null

  try {
    const user = await User.findOne({
      $or: [
        { id: userId },
        ...(userId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: userId }] : []),
      ],
    }).lean()
    return user
  } catch (err) {
    console.error('Error resolving user in auth middleware:', err.message)
    return null
  }
}

export async function requireAuth(req, res, next) {
  const user = await resolveUser(req)
  if (!user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' })
  }
  req.user = user
  next()
}

export async function optionalAuth(req, res, next) {
  const user = await resolveUser(req)
  req.user = user || null
  next()
}
