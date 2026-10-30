import express from 'express'
import assert from 'node:assert/strict'
import healthRoutes from '../routes/health.js'

const app = express()
app.use('/api/health', healthRoutes)
app.use('/health', healthRoutes)

const server = app.listen(0, async () => {
  const port = server.address().port
  try {
    // 1. Test /api/health
    const res1 = await fetch(`http://127.0.0.1:${port}/api/health`)
    assert.equal(res1.status, 200, 'Must return HTTP 200')
    const data1 = await res1.json()
    assert.deepEqual(data1, { status: 'ok' }, 'Must return { status: "ok" }')

    // 2. Test /health
    const res2 = await fetch(`http://127.0.0.1:${port}/health`)
    assert.equal(res2.status, 200, 'Must return HTTP 200')
    const data2 = await res2.json()
    assert.deepEqual(data2, { status: 'ok' }, 'Must return { status: "ok" }')

    console.log('[Health Check Test] Success:', data1)
    console.log('✔ Ultra-lightweight health endpoint verified successfully.')
  } catch (err) {
    console.error('✘ Health test failed:', err)
    process.exit(1)
  } finally {
    server.close()
  }
})
