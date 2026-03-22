// ─── Date Helper Utilities ────────────────────────────────────────────
// Reusable date functions for calendar interactions and API assertions.

/**
 * Build the aria-label string the react-datepicker uses for a given day offset.
 * Example: "Choose Wednesday, March 25th, 2026"
 */
export function getDateLabel(daysOffset) {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)

  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' })
  const month = date.toLocaleDateString('en-US', { month: 'long' })
  const day = date.getDate()
  const year = date.getFullYear()

  const s = ['th', 'st', 'nd', 'rd']
  const v = day % 100
  const ordinal = day + (s[(v - 20) % 10] || s[v] || s[0])

  return `Choose ${weekday}, ${month} ${ordinal}, ${year}`
}

/**
 * Return an ISO-8601 date string (YYYY-MM-DD) offset from today.
 */
export function getISODate(daysOffset) {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)
  return date.toISOString().split('T')[0]
}

/**
 * Return a short display-format date offset from today.
 * Example: "Mar 28, '26"
 */
export function getFormattedDate(daysOffset) {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)

  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const day = date.getDate()
  const year = String(date.getFullYear()).slice(-2)

  return `${month} ${day}, '${year}`
}
