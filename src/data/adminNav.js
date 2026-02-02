/**
 * Admin sidebar navigation.
 * Only admin-specific routes: Dashboard, Register & Manage Workers, Settings.
 */

export const ADMIN_SIDEBAR_ITEMS = [
  { path: '/admin', labelKey: 'navHome', icon: 'home', end: true },
  { path: '/admin/register', labelKey: 'navRegister', icon: 'users', end: true },
  { path: '/admin/settings', labelKey: 'navSettings', icon: 'cog-6-tooth', end: true },
]
