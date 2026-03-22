// ─── Multi-Calendar Page Locators ─────────────────────────────────────
// All selectors live here. Specs and Page Objects import from this file.

export const MC = {
  // ── Search ──────────────────────────────────────────────────────────
  searchInput: '[qa-id="search-input"]',

  // ── Calendar Grid ───────────────────────────────────────────────────
  priceTooltip: (listingId, col) => `[qa-id="price-tooltip--${listingId}-${col}"]`,
  pricingCell: 'td.pricing-cell',

  // ── DSO Side Panel ──────────────────────────────────────────────────
  dsoModalTitle: '[qa-id="dso-modal-title"]',
  chakraSlide: '.chakra-slide',
  dsoPrice: '[qa-id="dso-price"]',
  dsoPriceError: '[qa-id="dso-price-error"]',
  addDsoButton: '[qa-id="add-dso-button"]',
  priceSettings: '[qa-id="price-settings"]',

  // ── Date Pickers ────────────────────────────────────────────────────
  datePickerStart: '#chakra-modal-dso-modal-v2 [qa-id="date-picker-calendar-start"]',
  datePickerEnd: '#chakra-modal-dso-modal-v2 [qa-id="date-picker-calendar-end"]',
  datePickerPopper: '.react-datepicker-popper',
  datePickerDay: '.react-datepicker__day',
  datePickerDayOutside: '.react-datepicker__day--outside-month',

  // ── Min / Max / Base Price ──────────────────────────────────────────
  dsoMinPriceLabel: '[qa-id="dso-min-price-label"]',
  addValueBtn: '[qa-id="add-value-btn"]',
  minPriceSelect: '[qa-id="min-price-select"]',
  dsoMinPrice: '[qa-id="dso-min-price"]',

  dsoMaxPriceLabel: '[qa-id="dso-max-price-label"]',
  maxPriceSelect: '[qa-id="max-price-select"]',
  dsoMaxPrice: '[qa-id="dso-max-price"]',

  addBasePriceBtn: '#add-base-price-btn',
  dsoBasePrice: '[qa-id="dso-base-price"]',

  // ── DSO Band ────────────────────────────────────────────────────────
  dsoBand: (listingId) => `[qa-id="mc-dso-band-${listingId}"]`,

  // ── Tooltip Detail Values ───────────────────────────────────────────
  basePriceValue: '[qa-id="BASE PRICE (Listing Override)-value"]',
  minPriceTitle: '[qa-id="title-Min Price (Listing Override)"]',
  maxPriceTitle: '[qa-id="title-Max Price (Listing Override)"]',
  finalValue: '[qa-id="Final-value"]',

  // ── Bulk Actions ────────────────────────────────────────────────────
  bulkCheckbox: (listingId) => `[qa-id="bulk-${listingId}___vrm"]`,
  saveAndRefreshBtn: '[qa-id="save-and-refresh-mc-bulk-btn"]',
  syncNowBtn: '[qa-id="sync-now-mc-bulk"]',
  applyOverrideBtn: '[qa-id="apply-override-mc-bulk"]',
  clearBulkBtn: '[qa-id="clear-bulk-selection-mc"]',

  // ── Warning / Toast ─────────────────────────────────────────────────
  dsoWarningModalTitle: '[qa-id="dso-warning-modal-title"]',
  chakraToast: '.chakra-toast',

  // ── Login Page ──────────────────────────────────────────────────────
  emailInput: '#user_email',
  passwordInput: '#password-field',
  submitBtn: 'input[type="submit"]',
}
