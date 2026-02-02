/**
 * Log Fault & Maintenance – fault categories, severity, maintenance types.
 */

export const FAULT_CATEGORIES = [
  { id: 'mechanical', label: 'Mechanical' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'operational', label: 'Operational' },
  { id: 'other', label: 'Other' },
]

export const SEVERITY_OPTIONS = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
]

export const MAINTENANCE_TYPES = [
  { id: 'preventive', label: 'Preventive' },
  { id: 'corrective', label: 'Corrective' },
]

export function getInitialFaults() {
  const ts = (daysAgo) => new Date(Date.now() - daysAgo * 86400000).toISOString()
  return [
    { id: 'F001', equipmentId: 'eq2', equipmentName: 'Conveyor B2', category: 'mechanical', severity: 'high', stopWork: true, description: 'Belt slipping under load', createdAt: ts(2) },
    { id: 'F002', equipmentId: 'eq3', equipmentName: 'Cooling unit C1', category: 'electrical', severity: 'medium', stopWork: false, description: 'Compressor not starting', createdAt: ts(5) },
    { id: 'F003', equipmentId: 'eq1', equipmentName: 'Harvester A', category: 'operational', severity: 'low', stopWork: false, description: 'Sensor calibration needed', createdAt: ts(1) },
    { id: 'F004', equipmentId: 'eq7', equipmentName: 'Sorting line C2', category: 'mechanical', severity: 'medium', stopWork: false, description: 'Motor bearing noise', createdAt: ts(0) },
    { id: 'F005', equipmentId: 'eq5', equipmentName: 'Irrigation pump D1', category: 'operational', severity: 'low', stopWork: false, description: 'Pressure gauge fluctuating', createdAt: ts(3) },
    { id: 'F006', equipmentId: 'eq8', equipmentName: 'Packaging machine', category: 'electrical', severity: 'high', stopWork: true, description: 'Control panel intermittent fault', createdAt: ts(0) },
  ]
}

export function getInitialMaintenancePlans() {
  const d = (daysFromNow) => new Date(Date.now() + daysFromNow * 86400000).toISOString().slice(0, 10)
  return [
    { id: 'mp1', equipmentId: 'eq2', equipmentName: 'Conveyor B2', plannedDate: d(7), type: 'corrective', notes: 'Belt replacement', createdAt: new Date().toISOString() },
    { id: 'mp2', equipmentId: 'eq3', equipmentName: 'Cooling unit C1', plannedDate: d(14), type: 'corrective', notes: 'Compressor service', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'mp3', equipmentId: 'eq1', equipmentName: 'Harvester A', plannedDate: d(30), type: 'preventive', notes: 'Annual inspection', createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 'mp4', equipmentId: 'eq7', equipmentName: 'Sorting line C2', plannedDate: d(3), type: 'corrective', notes: 'Bearing replacement', createdAt: new Date().toISOString() },
    { id: 'mp5', equipmentId: 'eq8', equipmentName: 'Packaging machine', plannedDate: d(1), type: 'corrective', notes: 'Control panel check', createdAt: new Date().toISOString() },
  ]
}
