/**
 * Assign Task – zones, task types, statuses, priorities, and task store helpers.
 */

export const TASK_STATUS = {
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
}

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.PENDING_APPROVAL]: 'Pending Approval',
  [TASK_STATUS.APPROVED]: 'Approved',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.COMPLETED]: 'Completed',
}

export const TASK_TYPES = [
  { id: 'farming', label: 'Farming' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'quality', label: 'Quality' },
  { id: 'storage', label: 'Storage' },
]

export const PRIORITY_OPTIONS = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
]

export const ZONES = [
  { id: 'a', label: 'Zone A' },
  { id: 'b', label: 'Zone B' },
  { id: 'c', label: 'Zone C' },
  { id: 'd', label: 'Zone D' },
  { id: 'inventory', label: 'Inventory' },
]

/** Grid size for zone layout (rows × cols). */
export const GRID_ROWS = 6
export const GRID_COLS = 8

/** Generate a short task ID for display. */
export function generateTaskId() {
  return `T${Date.now().toString(36).toUpperCase().slice(-6)}`
}

/** Default tasks for demo (in-memory; can be replaced by API). */
export function getInitialTasks() {
  const now = new Date().toISOString()
  const yesterday = new Date(Date.now() - 86400000).toISOString()
  const hourAgo = new Date(Date.now() - 3600000).toISOString()
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString()
  return [
    /* Zone A – Left: completed, in progress, pending */
    { id: 'T001A1', zoneId: 'a', taskType: 'farming', workerIds: ['1'], priority: 'high', estimatedMinutes: 120, notes: 'Harvest rows 1–5', status: TASK_STATUS.COMPLETED, gridRow: 1, gridCol: 1, gridSide: 'left', createdAt: yesterday },
    { id: 'T002A2', zoneId: 'a', taskType: 'farming', workerIds: ['1', '4'], priority: 'medium', estimatedMinutes: 60, notes: '', status: TASK_STATUS.COMPLETED, gridRow: 2, gridCol: 1, gridSide: 'left', createdAt: yesterday },
    { id: 'T003A3', zoneId: 'a', taskType: 'maintenance', workerIds: ['1'], priority: 'medium', estimatedMinutes: 45, notes: 'In progress', status: TASK_STATUS.IN_PROGRESS, gridRow: 3, gridCol: 1, gridSide: 'left', createdAt: hourAgo },
    { id: 'T004A4', zoneId: 'a', taskType: 'quality', workerIds: ['5'], priority: 'low', estimatedMinutes: 30, notes: '', status: TASK_STATUS.IN_PROGRESS, gridRow: 4, gridCol: 2, gridSide: 'left', createdAt: hourAgo },
    { id: 'T005A5', zoneId: 'a', taskType: 'farming', workerIds: ['4'], priority: 'high', estimatedMinutes: 90, notes: 'Pending', status: TASK_STATUS.PENDING_APPROVAL, gridRow: 5, gridCol: 1, gridSide: 'left', createdAt: now },
    { id: 'T005B', zoneId: 'a', taskType: 'farming', workerIds: ['6'], priority: 'medium', estimatedMinutes: 75, notes: 'Rows 6–10', status: TASK_STATUS.APPROVED, gridRow: 6, gridCol: 2, gridSide: 'left', createdAt: twoDaysAgo },
    /* Zone A – Right */
    { id: 'T006A6', zoneId: 'a', taskType: 'farming', workerIds: ['1'], priority: 'medium', estimatedMinutes: 60, notes: '', status: TASK_STATUS.COMPLETED, gridRow: 1, gridCol: 1, gridSide: 'right', createdAt: yesterday },
    { id: 'T007A7', zoneId: 'a', taskType: 'farming', workerIds: ['4'], priority: 'medium', estimatedMinutes: 60, notes: '', status: TASK_STATUS.COMPLETED, gridRow: 2, gridCol: 1, gridSide: 'right', createdAt: yesterday },
    { id: 'T008A8', zoneId: 'a', taskType: 'farming', workerIds: ['1', '4'], priority: 'medium', estimatedMinutes: 60, notes: '', status: TASK_STATUS.COMPLETED, gridRow: 3, gridCol: 1, gridSide: 'right', createdAt: yesterday },
    { id: 'T009A9', zoneId: 'a', taskType: 'maintenance', workerIds: ['7'], priority: 'low', estimatedMinutes: 40, notes: '', status: TASK_STATUS.IN_PROGRESS, gridRow: 10, gridCol: 2, gridSide: 'right', createdAt: hourAgo },
    { id: 'T009C', zoneId: 'a', taskType: 'quality', workerIds: ['5'], priority: 'low', estimatedMinutes: 45, notes: 'Spot check', status: TASK_STATUS.PENDING_APPROVAL, gridRow: 15, gridCol: 1, gridSide: 'right', createdAt: now },
    /* Zone B */
    { id: 'T010B1', zoneId: 'b', taskType: 'quality', workerIds: ['5'], priority: 'low', estimatedMinutes: 45, notes: 'Quality check', status: TASK_STATUS.PENDING_APPROVAL, gridRow: 2, gridCol: 1, gridSide: 'left', createdAt: now },
    { id: 'T011B2', zoneId: 'b', taskType: 'storage', workerIds: ['6'], priority: 'medium', estimatedMinutes: 60, notes: '', status: TASK_STATUS.COMPLETED, gridRow: 1, gridCol: 1, gridSide: 'left', createdAt: yesterday },
    { id: 'T011B3', zoneId: 'b', taskType: 'maintenance', workerIds: ['7'], priority: 'high', estimatedMinutes: 90, notes: 'Conveyor B2', status: TASK_STATUS.IN_PROGRESS, gridRow: 3, gridCol: 2, gridSide: 'left', createdAt: hourAgo },
    { id: 'T011B4', zoneId: 'b', taskType: 'farming', workerIds: ['1', '4'], priority: 'medium', estimatedMinutes: 120, notes: 'Harvest Zone B', status: TASK_STATUS.COMPLETED, gridRow: 4, gridCol: 1, gridSide: 'right', createdAt: twoDaysAgo },
    /* Zone C */
    { id: 'T012C1', zoneId: 'c', taskType: 'farming', workerIds: ['4'], priority: 'high', estimatedMinutes: 120, notes: '', status: TASK_STATUS.IN_PROGRESS, gridRow: 7, gridCol: 3, gridSide: 'right', createdAt: hourAgo },
    { id: 'T012C2', zoneId: 'c', taskType: 'quality', workerIds: ['5'], priority: 'medium', estimatedMinutes: 50, notes: 'Cooling unit area', status: TASK_STATUS.COMPLETED, gridRow: 1, gridCol: 1, gridSide: 'left', createdAt: yesterday },
    { id: 'T012C3', zoneId: 'c', taskType: 'storage', workerIds: ['6'], priority: 'low', estimatedMinutes: 30, notes: '', status: TASK_STATUS.APPROVED, gridRow: 5, gridCol: 2, gridSide: 'left', createdAt: now },
    /* Zone D */
    { id: 'T013D1', zoneId: 'd', taskType: 'farming', workerIds: ['1', '4', '6'], priority: 'high', estimatedMinutes: 150, notes: 'Full zone harvest', status: TASK_STATUS.IN_PROGRESS, gridRow: 8, gridCol: 2, gridSide: 'left', createdAt: hourAgo },
    { id: 'T013D2', zoneId: 'd', taskType: 'maintenance', workerIds: ['7'], priority: 'medium', estimatedMinutes: 60, notes: '', status: TASK_STATUS.PENDING_APPROVAL, gridRow: 2, gridCol: 1, gridSide: 'right', createdAt: now },
    /* Inventory zone */
    { id: 'T014I1', zoneId: 'inventory', taskType: 'storage', workerIds: ['6'], priority: 'medium', estimatedMinutes: 45, notes: 'Stock count', status: TASK_STATUS.COMPLETED, gridRow: 1, gridCol: 1, gridSide: 'left', createdAt: yesterday },
    { id: 'T014I2', zoneId: 'inventory', taskType: 'quality', workerIds: ['5'], priority: 'low', estimatedMinutes: 30, notes: 'Packaging audit', status: TASK_STATUS.APPROVED, gridRow: 3, gridCol: 2, gridSide: 'left', createdAt: now },
  ]
}

/** Demo records for Reports & Analytics (production, quality). */
export function getInitialRecords() {
  const d = (daysAgo) => new Date(Date.now() - daysAgo * 86400000).toISOString()
  return [
    { id: 'R1', recordType: 'production', quantity: 120, department: 'Farming', dateTime: d(0), createdAt: d(0) },
    { id: 'R2', recordType: 'production', quantity: 85, department: 'Maintenance', dateTime: d(0), createdAt: d(0) },
    { id: 'R3', recordType: 'production', quantity: 200, department: 'Farming', dateTime: d(0), createdAt: d(0) },
    { id: 'R4', recordType: 'production', quantity: 150, department: 'Quality', dateTime: d(0), createdAt: d(0) },
    { id: 'R5', recordType: 'production', quantity: 90, department: 'Storage', dateTime: d(0), createdAt: d(0) },
    { id: 'R6', recordType: 'production', quantity: 180, department: 'Farming', dateTime: d(1), createdAt: d(1) },
    { id: 'R7', recordType: 'production', quantity: 70, department: 'Maintenance', dateTime: d(1), createdAt: d(1) },
    { id: 'R8', recordType: 'production', quantity: 220, department: 'Farming', dateTime: d(2), createdAt: d(2) },
    { id: 'R9', recordType: 'production', quantity: 95, department: 'Quality', dateTime: d(2), createdAt: d(2) },
    { id: 'R10', recordType: 'production', quantity: 110, department: 'Farming', dateTime: d(3), createdAt: d(3) },
    { id: 'R11', recordType: 'production', quantity: 130, department: 'Storage', dateTime: d(5), createdAt: d(5) },
    { id: 'R12', recordType: 'production', quantity: 165, department: 'Farming', dateTime: d(7), createdAt: d(7) },
    { id: 'R13', recordType: 'production', quantity: 88, department: 'Quality', dateTime: d(14), createdAt: d(14) },
    { id: 'R14', recordType: 'quality', zone: 'Zone A', dateTime: d(0), createdAt: d(0) },
    { id: 'R15', recordType: 'quality', zone: 'Zone B', dateTime: d(0), createdAt: d(0) },
    { id: 'R16', recordType: 'quality', zone: 'Zone A', dateTime: d(1), createdAt: d(1) },
    { id: 'R17', recordType: 'quality', zone: 'Zone C', dateTime: d(2), createdAt: d(2) },
    { id: 'R18', recordType: 'quality', zone: 'Zone D', dateTime: d(3), createdAt: d(3) },
    { id: 'R19', recordType: 'quality', zone: 'Zone B', dateTime: d(5), createdAt: d(5) },
    { id: 'R20', recordType: 'quality', zone: 'Zone A', dateTime: d(7), createdAt: d(7) },
  ]
}
