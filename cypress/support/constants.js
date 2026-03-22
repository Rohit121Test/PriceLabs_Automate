// ─── Shared Constants ─────────────────────────────────────────────────
// Error messages, status codes, listing IDs, and other shared values.

// ── Listing IDs ───────────────────────────────────────────────────────
export const LISTING_1 = 'VRMREALTY___50'
export const LISTING_2 = 'VRMREALTY___246'

// ── Currency ──────────────────────────────────────────────────────────
export const CURRENCY = 'USD'

// ── CSS Classes ───────────────────────────────────────────────────────
export const DSO_BAND_CLASS = 'mc-dso-band'

// ── UI Labels ─────────────────────────────────────────────────────────
export const PRICE_SETTINGS_LABEL = 'Price Settings'
export const CONFIRM_DSO_MODAL_TITLE = 'Confirm Date-specific Override'

// ── Error Messages ────────────────────────────────────────────────────
export const ERR_CUSTOM_PRICING_REQUIRED =
  'You need to set at least one custom pricing setting before you add.'
export const ERR_MIN_PRICE = 'Cannot be less than 10'
export const ERR_PAYLOAD_EMPTY = 'Listing not found'
export const ERR_UNAUTHORIZED =
  'Unauthorized Access. Please sign out and sign back in.'

// ── API Status Codes ──────────────────────────────────────────────────
export const HTTP_OK = 200
export const API_FORBIDDEN = 403
export const API_BAD_REQUEST = 400

// ── API Error Codes ───────────────────────────────────────────────────
export const ERR_CODE_NO_SESSION = 'ERR-403-NS'

// ── API Routes (globs for cy.intercept) ───────────────────────────────
export const API = {
  listings: '**/api/listings**',
  guides: '**/guide.json/**',
  addCustomPricing: '**/add_custom_pricing',
  getCalendarData: '**/get_calendar_data*',
  dsoAutoRefresh: '**/dso_auto_refresh',
  addBulkCustomPricing: '**/add_bulk_custom_pricing',
  getBulkCalendarData: '**/get_bulk_calendar_data',
  bulkDsoAutoRefreshPoll: '**/bulk_dso_auto_refresh_poll',
  sessionInit: '**/session/initialize',
  getUserPrefs: '**/get_user_preferences',
}

// ── Full API URLs (for cy.request) ────────────────────────────────────
export const API_URL = {
  addCustomPricing: 'https://app.pricelabs.co/api/add_custom_pricing',
}
