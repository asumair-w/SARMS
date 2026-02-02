/**
 * Engineer sidebar and section navigation.
 */

export const SIDEBAR_ITEMS = [
  { path: '/engineer', labelKey: 'navHome', icon: 'home' },
  { path: '/engineer/register', labelKey: 'navRegister', icon: 'users' },
  { path: '/engineer/assign-task', labelKey: 'navAssignTask', icon: 'clipboard-document-list' },
  { path: '/engineer/monitor', labelKey: 'navMonitor', icon: 'signal' },
  { path: '/engineer/production', labelKey: 'navProduction', icon: 'check-circle' },
  { path: '/engineer/inventory', labelKey: 'navInventory', icon: 'cube' },
  { path: '/engineer/faults', labelKey: 'navFaults', icon: 'wrench' },
  { path: '/engineer/reports', labelKey: 'navReports', icon: 'chart-bar' },
  { path: '/engineer/settings', labelKey: 'navSettings', icon: 'cog-6-tooth', end: true },
]

/** Same 6 action sections (excluding Home) for the green boxes on Home. */
export const SECTION_ACTIONS = SIDEBAR_ITEMS.filter((item) => item.path !== '/engineer')
