/**
 * Power BI Publish to Web embed URL.
 * Replace with your own report link from Power BI Service → File → Embed report → Publish to web.
 * Used for admin dashboard only; read-only, no auth required.
 * Admin can override in Settings; value is stored in localStorage under POWER_BI_STORAGE_KEY.
 */
export const POWER_BI_EMBED_URL = ''
export const POWER_BI_STORAGE_KEY = 'sarms-powerbi-url'

export function getPowerBiEmbedUrl() {
  try {
    const stored = localStorage.getItem(POWER_BI_STORAGE_KEY)?.trim()
    if (stored) return stored
  } catch {}
  return POWER_BI_EMBED_URL || ''
}
