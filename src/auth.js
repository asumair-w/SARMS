/**
 * SARMS auth: validates credentials, resolves role, enforces routing.
 * No role selection by user – role is always derived from User ID.
 */

export const ROLES = {
  WORKER: 'worker',
  ENGINEER: 'engineer',
  ADMIN: 'admin',
}

const ROUTES_BY_ROLE = {
  [ROLES.WORKER]: '/worker',
  [ROLES.ENGINEER]: '/engineer',
  [ROLES.ADMIN]: '/admin',
}

/**
 * Mock user store (replace with real API).
 * In production: validate against backend; backend returns role and status.
 */
const MOCK_USERS = {
  w1: { password: 'w1', role: ROLES.WORKER, active: true },
  w2: { password: 'w2', role: ROLES.WORKER, active: true },
  w3: { password: 'w3', role: ROLES.WORKER, active: true },
  w4: { password: 'w4', role: ROLES.WORKER, active: true },
  w5: { password: 'w5', role: ROLES.WORKER, active: true },
  e1: { password: 'e1', role: ROLES.ENGINEER, active: true },
  e2: { password: 'e2', role: ROLES.ENGINEER, active: true },
  a1: { password: 'a1', role: ROLES.ADMIN, active: true },
  a2: { password: 'a2', role: ROLES.ADMIN, active: true },
}

/**
 * Validate ID + password. Returns { ok, role, error }.
 */
export function validateCredentials(userId, password) {
  if (!userId?.trim()) return { ok: false, error: 'Invalid ID or password' }
  const user = MOCK_USERS[userId.trim().toLowerCase()]
  if (!user) return { ok: false, error: 'Invalid ID or password' }
  if (user.password !== password) return { ok: false, error: 'Invalid ID or password' }
  if (!user.active) return { ok: false, error: 'Inactive or unauthorized user' }
  return { ok: true, role: user.role }
}

/**
 * Validate User ID from QR code. Same contract as ID+password (role, status).
 */
export function validateUserIdFromQR(userId) {
  if (!userId?.trim()) return { ok: false, error: 'Invalid or expired QR Code' }
  const user = MOCK_USERS[userId.trim().toLowerCase()]
  if (!user) return { ok: false, error: 'Invalid or expired QR Code' }
  if (!user.active) return { ok: false, error: 'Inactive or unauthorized user' }
  return { ok: true, role: user.role }
}

/**
 * Get redirect path for role. Used after successful login.
 */
export function getRedirectForRole(role) {
  return ROUTES_BY_ROLE[role] ?? '/login'
}
