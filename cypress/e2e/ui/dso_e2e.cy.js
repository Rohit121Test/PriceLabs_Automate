// ─── DSO E2E Smoke Test ───────────────────────────────────────────────
import mcPage from '../../pages/MultiCalendarPage'
import { MC } from '../../locators/MultiCalendarLocators'
import {
  LISTING_1, DSO_BAND_CLASS,
  API, HTTP_OK
} from '../../support/constants'

describe('DSO End-to-End Smoke', () => {
  beforeEach(() => {
    cy.intercept('GET', API.listings).as('listingApi')
    cy.intercept('POST', API.guides).as('guides')
    cy.login()
  })

  context('When performing a basic DSO creation flow', () => {
    it('should create a DSO with only final price and verify success', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { colIndex, listingId, finalPrice } = d.singleDate

        cy.intercept('POST', API.addCustomPricing).as('addPricing')
        cy.intercept('GET', API.getCalendarData).as('getCalendarData')
        cy.intercept('POST', API.dsoAutoRefresh).as('dsoRefresh')

        cy.url().should('include', '/multicalendar')

        mcPage.openDsoForCell(listingId, colIndex)

        // Fill only the final price (minimal smoke)
        mcPage.fillDsoPrice(finalPrice)
        mcPage.submitDso()

        // Verify API call succeeds
        cy.wait('@addPricing').its('response.statusCode').should('eq', HTTP_OK)
        cy.wait('@getCalendarData')
        cy.wait('@dsoRefresh')

        // Verify DSO band appears
        cy.get(MC.dsoBand(listingId)).should('have.class', DSO_BAND_CLASS)
      })
    })
  })
})
