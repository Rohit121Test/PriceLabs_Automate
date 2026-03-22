// ─── Drag & Drop DSO ──────────────────────────────────────────────────
import mcPage from '../../pages/MultiCalendarPage'
import { MC } from '../../locators/MultiCalendarLocators'
import {
  LISTING_1, DSO_BAND_CLASS,
  API, HTTP_OK
} from '../../support/constants'
import { getFormattedDate } from '../../support/dateHelpers'

describe('Drag & Drop DSO', () => {
  beforeEach(() => {
    cy.intercept('GET', API.listings).as('listingApi')
    cy.intercept('POST', API.guides).as('guides')
    cy.login()
  })

  context('When dragging across pricing grid cells', () => {
    it('should open the DSO form with the correct date range pre-filled', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { dragStartIndex, dragEndIndex } = d.dragDrop

        const dragStartLocator = `price-tooltip--${LISTING_1}-${dragStartIndex}`
        const dragEndLocator = `price-tooltip--${LISTING_1}-${dragEndIndex}`

        cy.url().should('include', '/multicalendar')

        mcPage.dragAcrossPricingCells(dragStartLocator, dragEndLocator)

        cy.get(MC.dsoModalTitle).should('be.visible')

        // Normalize curly quotes in date Field in calender
        const normalize = (str) => str.replace(/[\u2018\u2019]/g, "'")

        cy.get(MC.datePickerStart).invoke('text').then((text) => {
          expect(normalize(text)).to.eq(normalize(d.drag_drop.expectedStartDate))
        })
        cy.get(MC.datePickerEnd).invoke('text').then((text) => {
          expect(normalize(text)).to.eq(normalize(d.drag_drop.expecetdEndDate))
        })

      })
    })

    it('should submit the drag-selected DSO and get a 200 response', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { dragStartIndex, dragEndIndex, finalPrice } = d.dragDrop

        cy.intercept('POST', API.addCustomPricing).as('addPricing')
        cy.intercept('GET', API.getCalendarData).as('getCalendarData')
        cy.intercept('POST', API.dsoAutoRefresh).as('dsoRefresh')

        const dragStartLocator = `price-tooltip--${LISTING_1}-${dragStartIndex}`
        const dragEndLocator = `price-tooltip--${LISTING_1}-${dragEndIndex}`

        cy.url().should('include', '/multicalendar')

        mcPage.dragAcrossPricingCells(dragStartLocator, dragEndLocator)
        mcPage.fillDsoPrice(finalPrice)
        mcPage.submitDso()

        cy.wait('@addPricing').its('response.statusCode').should('eq', HTTP_OK)
        cy.wait('@getCalendarData')
        cy.wait('@dsoRefresh')
      })
    })

    it('should show DSO bands on every cell in the dragged range', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { dragStartIndex, dragEndIndex, finalPrice } = d.dragDrop

        cy.intercept('POST', API.addCustomPricing).as('addPricing')
        cy.intercept('GET', API.getCalendarData).as('getCalendarData')
        cy.intercept('POST', API.dsoAutoRefresh).as('dsoRefresh')

        const dragStartLocator = `price-tooltip--${LISTING_1}-${dragStartIndex}`
        const dragEndLocator = `price-tooltip--${LISTING_1}-${dragEndIndex}`

        cy.url().should('include', '/multicalendar')

        mcPage.dragAcrossPricingCells(dragStartLocator, dragEndLocator)
        mcPage.fillDsoPrice(finalPrice)
        mcPage.submitDso()

        cy.wait('@addPricing')
        cy.wait('@getCalendarData')
        cy.wait('@dsoRefresh')

        Cypress._.range(dragStartIndex, dragEndIndex + 1).forEach((colIndex) => {
          mcPage.verifyDsoBandExists(LISTING_1, colIndex)
        })
      })
    })
  })
})
