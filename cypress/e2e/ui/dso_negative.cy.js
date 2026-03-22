// ─── DSO Negative Tests ───────────────────────────────────────────────
import mcPage from '../../pages/MultiCalendarPage'
import { MC } from '../../locators/MultiCalendarLocators'
import {
  LISTING_1,
  ERR_CUSTOM_PRICING_REQUIRED, ERR_MIN_PRICE, CONFIRM_DSO_MODAL_TITLE,
  API
} from '../../support/constants'

describe('DSO Negative Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', API.listings).as('listingApi')
    cy.intercept('POST', API.guides).as('guides')
    cy.login()
  })

  context('When submitting the DSO form with invalid data', () => {
    it('should show a toast error when no pricing fields are filled', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { colIndex } = d.negative

        cy.intercept('POST', API.addCustomPricing).as('addPricing')
        cy.intercept('GET', API.getCalendarData).as('getCalendarData')
        cy.intercept('POST', API.dsoAutoRefresh).as('dsoRefresh')

        mcPage.openDsoForCell(LISTING_1, colIndex)
        mcPage.submitDso()

        cy.get(MC.chakraToast)
          .should('be.visible')
          .and('contain.text', ERR_CUSTOM_PRICING_REQUIRED)
      })
    })

    it('should show an inline error for a negative final price', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { colIndex, negativeFinalNumber } = d.negative

        mcPage.openDsoForCell(LISTING_1, colIndex)
        mcPage.fillDsoPrice(negativeFinalNumber)
        mcPage.submitDso()

        cy.get(MC.dsoPriceError).should('contain.text', ERR_MIN_PRICE)
        cy.get(MC.chakraSlide).find(MC.dsoPrice).should('contain.text', '')
      })
    })

    it('should show the confirm date-override modal', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { colIndex, negativeFinalNumber } = d.negative

        mcPage.openDsoForCell(LISTING_1, colIndex)
        mcPage.fillDsoPrice(negativeFinalNumber)
        mcPage.submitDso()

        cy.get(MC.dsoWarningModalTitle).should('contain.text', CONFIRM_DSO_MODAL_TITLE)
      })
    })
  })
})
