// ─── Multi-Calendar Page Object ───────────────────────────────────────
// Business-logic methods for the Multi-Calendar & DSO workflows.
// All selectors come from the Locators layer.

import { MC } from '../locators/MultiCalendarLocators'
import { getDateLabel } from '../support/dateHelpers'

class MultiCalendarPage {
  // ── Search ──────────────────────────────────────────────────────────

  searchProperty(name) {
    cy.get(MC.searchInput).type(name)
  }

  // ── DSO Side Panel ──────────────────────────────────────────────────

  openDsoForCell(listingId, colIndex) {
    cy.get(MC.priceTooltip(listingId, colIndex)).realClick()
    cy.get(MC.dsoModalTitle).should('be.visible')
  }

  fillDsoPrice(price) {
    cy.get(MC.chakraSlide).find(MC.dsoPrice).clear().type(price)
  }

  fillMinPrice(price) {
    cy.contains(MC.dsoMinPriceLabel, 'Minimum Price')
      .parent()
      .find(MC.addValueBtn)
      .click()

    cy.get(MC.minPriceSelect)
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.eq('Fixed')
      })

    cy.get(MC.dsoMinPrice).type(price)
  }

  fillMaxPrice(price) {
    cy.contains(MC.dsoMaxPriceLabel, 'Maximum Price')
      .parent()
      .find(MC.addValueBtn)
      .click()

    cy.get(MC.maxPriceSelect)
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.eq('Fixed')
      })

    cy.get(MC.dsoMaxPrice).type(price)
  }

  fillBasePrice(price) {
    cy.get(MC.addBasePriceBtn).click()
    cy.get(MC.dsoBasePrice).clear().type(price)
  }

  submitDso() {
    cy.get(MC.addDsoButton).click()
  }

  // ── Date Picker ─────────────────────────────────────────────────────

  openDatePicker() {
    cy.get(MC.datePickerStart).click()
    cy.get(MC.datePickerPopper).should('be.visible')
  }

  selectDate(daysOffset) {
    const label = getDateLabel(daysOffset)

    cy.get(MC.datePickerPopper)
      .find(`${MC.datePickerDay}[aria-label="${label}"]`)
      .not(MC.datePickerDayOutside)
      .should('have.attr', 'aria-disabled', 'false')
      .click({ force: true })
  }

  // ── Bulk Actions ────────────────────────────────────────────────────

  selectBulkProperty(listingId) {
    cy.get(MC.bulkCheckbox(listingId))
      .find('input')
      .should('not.be.checked')
      .click({ force: true })
  }

  openBulkOverride() {
    cy.get(MC.applyOverrideBtn).click()
    cy.get(MC.dsoModalTitle).should('be.visible')
  }

  // ── Drag & Drop ─────────────────────────────────────────────────────

  dragAcrossPricingCells(startQaId, endQaId) {
    cy.get(`[qa-id="${startQaId}"]`)
      .closest(MC.pricingCell)
      .then(($startCell) => {
        cy.get(`[qa-id="${endQaId}"]`)
          .closest(MC.pricingCell)
          .then(($endCell) => {
            const endRect = $endCell[0].getBoundingClientRect()
            const endX = Math.round(endRect.left + endRect.width / 2)
            const endY = Math.round(endRect.top + endRect.height / 2)

            cy.get(`[qa-id="${startQaId}"]`).closest(MC.pricingCell).realMouseDown()
            cy.get(`[qa-id="${endQaId}"]`).closest(MC.pricingCell).realMouseMove(endX, endY)
            cy.get(`[qa-id="${endQaId}"]`).closest(MC.pricingCell).realMouseUp()
          })
      })
  }

  // ── Verification Helpers ────────────────────────────────────────────

  verifyDsoBandExists(listingId, colIndex) {
    cy.get(MC.priceTooltip(listingId, colIndex))
      .closest('td')
      .find(MC.dsoBand(listingId))
      .should('have.class', 'mc-dso-band')
  }

  verifyDsoBandNotExists(listingId, colIndex) {
    cy.get(MC.priceTooltip(listingId, colIndex))
      .closest('td')
      .find(MC.dsoBand(listingId))
      .should('not.exist')
  }

  verifyBasePriceInTooltip(expectedPrice, currency) {
    cy.get(MC.basePriceValue)
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.equal(`${expectedPrice} ${currency}`)
      })
  }

  verifyMinPriceInTooltip(expectedPrice, currency) {
    cy.get(MC.minPriceTitle).should(($el) => {
      const text = $el.parent().text().replace(/\s+/g, ' ').trim()
      expect(text).to.eq(`Min Price (Listing Override)${expectedPrice} ${currency}`)
    })
  }

  verifyMaxPriceInTooltip(expectedPrice, currency) {
    cy.get(MC.maxPriceTitle).should(($el) => {
      const text = $el.parent().text().replace(/\s+/g, ' ').trim()
      expect(text).to.eq(`Max Price (Listing Override)${expectedPrice} ${currency}`)
    })
  }

  verifyFinalPriceInTooltip(expectedPrice, currency) {
    cy.get(MC.finalValue).should(($el) => {
      const text = $el.text().replace(/\s+/g, ' ').trim()
      expect(text).to.eq(`${expectedPrice} ${currency}`)
    })
  }
}

export default new MultiCalendarPage()
