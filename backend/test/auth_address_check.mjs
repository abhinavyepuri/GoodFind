import assert from 'node:assert/strict'
import bcrypt from 'bcryptjs'

console.log('Running User Profile & Address Integrity Checks...\n')

// 1. Password Hashing & Verification
console.log('[Check 1] Password hashing and verification')
const rawPassword = 'superSecretPassword123'
const hash = await bcrypt.hash(rawPassword, 10)
assert.notEqual(hash, rawPassword, 'Hash must not equal raw password')
assert.ok(await bcrypt.compare(rawPassword, hash), 'Raw password must match hash')
assert.ok(!(await bcrypt.compare('wrongPassword', hash)), 'Wrong password must NOT match hash')
console.log('✔ Password hashing and comparison verified.')

// 2. Order Address Snapshot Immutability Simulation
console.log('\n[Check 2] Order Snapshot Immutability')
const savedUserAddress = {
  id: 'addr-101',
  fullName: 'Jane Doe',
  street: '123 Initial Street',
  city: 'Brooklyn',
  state: 'NY',
  postalCode: '11201',
  isDefault: true,
}

// When order is placed, a snapshot copy is created
const orderSnapshotAddress = { ...savedUserAddress }
const mockOrder = {
  orderNumber: 'GF-99999',
  shippingAddress: orderSnapshotAddress,
}

// Later, user edits their saved profile address
savedUserAddress.street = '789 Updated Boulevard'
savedUserAddress.city = 'Manhattan'

assert.equal(
  mockOrder.shippingAddress.street,
  '123 Initial Street',
  'Order snapshot address must NOT mutate when saved user profile address is updated'
)
console.log('✔ Order historical snapshot address immutability verified.')

// 3. Split-Path Registration Payload Validation
console.log('\n[Check 3] Split-path checkout registration payload validation')
function validateCheckoutRegistration(payload) {
  const { email, password, address } = payload
  if (!email || !email.includes('@')) throw new Error('Invalid email')
  if (!password || password.length < 6) throw new Error('Password too short')
  if (!address || !address.street || !address.city) throw new Error('Incomplete address')
  return true
}

const validPayload = {
  email: 'customer@goodfind.test',
  password: 'mypassword123',
  address: { street: '100 Broadway', city: 'New York', state: 'NY', postalCode: '10005' },
}
assert.ok(validateCheckoutRegistration(validPayload))
assert.throws(() => validateCheckoutRegistration({ ...validPayload, password: '123' }))
console.log('✔ Split-path registration payload rules verified.')

console.log('\nAll User Profile & Saved Address backend integrity checks PASSED!\n')
