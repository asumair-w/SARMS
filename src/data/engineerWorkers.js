/**
 * Register & Manage Workers: roles, departments, seed data.
 */

export const ROLE_OPTIONS = [
  { value: 'worker', label: 'Worker' },
  { value: 'technician', label: 'Technician' },
  { value: 'engineer', label: 'Engineer' },
  { value: 'admin', label: 'Admin' },
]

export const DEPARTMENT_OPTIONS = [
  { value: 'farming', label: 'Farming' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'quality', label: 'Quality' },
  { value: 'storage', label: 'Storage' },
]

/** Seed workers (match auth.js mock users for login). */
export const SEED_WORKERS = [
  { id: '1', employeeId: 'w1', fullName: 'Worker One', phone: '+966 50 111 2222', email: 'worker1@sarms.local', nationality: 'Saudi', role: 'worker', department: 'farming', status: 'active', tempPassword: 'w1', createdAt: new Date().toISOString() },
  { id: '2', employeeId: 'e1', fullName: 'Engineer One', phone: '+966 50 333 4444', email: 'engineer1@sarms.local', nationality: 'Saudi', role: 'engineer', department: 'maintenance', status: 'active', tempPassword: 'e1', createdAt: new Date().toISOString() },
  { id: '3', employeeId: 'a1', fullName: 'Admin One', phone: '+966 50 555 6666', email: 'admin1@sarms.local', nationality: 'Saudi', role: 'admin', department: 'quality', status: 'active', tempPassword: 'a1', createdAt: new Date().toISOString() },
  { id: '4', employeeId: 'w2', fullName: 'Ahmed Hassan', phone: '+966 54 777 8888', email: 'ahmed@sarms.local', nationality: 'Egyptian', role: 'worker', department: 'farming', status: 'active', tempPassword: 'w2', createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: '5', employeeId: 'w3', fullName: 'Fatima Ali', phone: '+966 55 999 0000', email: 'fatima@sarms.local', nationality: 'Saudi', role: 'worker', department: 'quality', status: 'active', tempPassword: 'w3', createdAt: new Date(Date.now() - 20 * 86400000).toISOString() },
  { id: '6', employeeId: 'w4', fullName: 'Omar Khalid', phone: '+966 56 111 3333', email: 'omar@sarms.local', nationality: 'Jordanian', role: 'worker', department: 'storage', status: 'active', tempPassword: 'w4', createdAt: new Date(Date.now() - 14 * 86400000).toISOString() },
  { id: '7', employeeId: 'w5', fullName: 'Sara Mohammed', phone: '+966 57 444 5555', email: 'sara@sarms.local', nationality: 'Saudi', role: 'worker', department: 'maintenance', status: 'active', tempPassword: 'w5', createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: '8', employeeId: 'e2', fullName: 'Engineer Two', phone: '+966 58 666 7777', email: 'engineer2@sarms.local', nationality: 'Saudi', role: 'engineer', department: 'quality', status: 'active', tempPassword: 'e2', createdAt: new Date(Date.now() - 60 * 86400000).toISOString() },
  { id: '9', employeeId: 'a2', fullName: 'Admin Two', phone: '+966 59 888 9999', email: 'admin2@sarms.local', nationality: 'Saudi', role: 'admin', department: 'quality', status: 'active', tempPassword: 'a2', createdAt: new Date(Date.now() - 90 * 86400000).toISOString() },
]

const ROLE_PREFIX = { worker: 'W', technician: 'T', engineer: 'E', admin: 'A' }

/** Generate next employee ID by role (e.g. W002, E002). */
export function generateEmployeeId(role, existingWorkers) {
  const prefix = ROLE_PREFIX[role] ?? 'W'
  const sameRole = existingWorkers.filter((w) => w.employeeId.startsWith(prefix))
  const nums = sameRole.map((w) => parseInt(w.employeeId.slice(1), 10) || 0).filter((n) => !Number.isNaN(n))
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1
  return `${prefix}${next}`.toLowerCase()
}

/** Generate a random temporary password (8 chars). */
export function generateTempPassword() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  let s = ''
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

/** QR code image URL for employee ID (external API, no npm dep). */
export function getQRCodeUrl(employeeId, size = 200) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(employeeId)}`
}
