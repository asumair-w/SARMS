/**
 * Monitor Active Work – active sessions mock data and status logic.
 */

export const SESSION_STATUS = {
  ACTIVE: 'active',
  DELAYED: 'delayed',
  FLAGGED: 'flagged',
}

export const SESSION_STATUS_LABELS = {
  [SESSION_STATUS.ACTIVE]: 'Active',
  [SESSION_STATUS.DELAYED]: 'Delayed',
  [SESSION_STATUS.FLAGGED]: 'Flagged',
}

/** Mock active work sessions (worker + task + zone + start time + expected minutes). */
export function getInitialSessions() {
  const now = Date.now()
  return [
    {
      id: 's1',
      workerId: '1',
      workerName: 'Worker One',
      department: 'Farming',
      departmentId: 'farming',
      taskTypeId: 'farming',
      task: 'Harvest',
      zone: 'A',
      zoneId: 'a',
      linesArea: '1–20',
      startTime: new Date(now - 45 * 60 * 1000).toISOString(),
      expectedMinutes: 120,
      flagged: false,
      notes: [],
    },
    {
      id: 's2',
      workerId: '1',
      workerName: 'Worker One',
      department: 'Maintenance',
      departmentId: 'maintenance',
      taskTypeId: 'maintenance',
      task: 'Internal Transport',
      zone: 'B',
      zoneId: 'b',
      linesArea: '5–15',
      startTime: new Date(now - 90 * 60 * 1000).toISOString(),
      expectedMinutes: 60,
      flagged: true,
      notes: [{ at: new Date().toISOString(), text: 'Waiting for equipment' }],
    },
    {
      id: 's3',
      workerId: '4',
      workerName: 'Ahmed Hassan',
      department: 'Farming',
      departmentId: 'farming',
      taskTypeId: 'farming',
      task: 'Harvest Zone A',
      zone: 'A',
      zoneId: 'a',
      linesArea: '10–25',
      startTime: new Date(now - 30 * 60 * 1000).toISOString(),
      expectedMinutes: 90,
      flagged: false,
      notes: [],
    },
    {
      id: 's4',
      workerId: '5',
      workerName: 'Fatima Ali',
      department: 'Quality',
      departmentId: 'quality',
      taskTypeId: 'quality',
      task: 'Quality check Zone C',
      zone: 'C',
      zoneId: 'c',
      linesArea: '1–15',
      startTime: new Date(now - 20 * 60 * 1000).toISOString(),
      expectedMinutes: 45,
      flagged: false,
      notes: [],
    },
    {
      id: 's5',
      workerId: '6',
      workerName: 'Omar Khalid',
      department: 'Storage',
      departmentId: 'storage',
      taskTypeId: 'storage',
      task: 'Stock count',
      zone: 'Inventory',
      zoneId: 'inventory',
      linesArea: '—',
      startTime: new Date(now - 120 * 60 * 1000).toISOString(),
      expectedMinutes: 60,
      flagged: false,
      notes: [{ at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), text: 'Started count' }],
    },
    {
      id: 's6',
      workerId: '7',
      workerName: 'Sara Mohammed',
      department: 'Maintenance',
      departmentId: 'maintenance',
      taskTypeId: 'maintenance',
      task: 'Conveyor B2 repair',
      zone: 'B',
      zoneId: 'b',
      linesArea: '—',
      startTime: new Date(now - 75 * 60 * 1000).toISOString(),
      expectedMinutes: 90,
      flagged: true,
      notes: [{ at: new Date().toISOString(), text: 'Waiting for spare parts' }],
    },
  ]
}

/** Compute status: delayed if elapsed > expected, else active; flagged overrides display. */
export function getSessionStatus(session, now = Date.now()) {
  if (session.flagged) return SESSION_STATUS.FLAGGED
  const start = new Date(session.startTime).getTime()
  const elapsedMinutes = (now - start) / (60 * 1000)
  return elapsedMinutes > session.expectedMinutes ? SESSION_STATUS.DELAYED : SESSION_STATUS.ACTIVE
}

/** Elapsed duration in minutes. */
export function getElapsedMinutes(session, now = Date.now()) {
  const start = new Date(session.startTime).getTime()
  return Math.floor((now - start) / (60 * 1000))
}
