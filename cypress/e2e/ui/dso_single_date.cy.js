// ─── Single Date DSO ──────────────────────────────────────────────────
import mcPage from '../../pages/MultiCalendarPage'
import { MC } from '../../locators/MultiCalendarLocators'
import {
  LISTING_1, CURRENCY, DSO_BAND_CLASS, PRICE_SETTINGS_LABEL,
  API, HTTP_OK
} from '../../support/constants'

describe('Single Date DSO', () => {
  beforeEach(() => {
    cy.intercept('GET', API.listings).as('listingApi')
    cy.intercept('POST', API.guides).as('guides')
    cy.login()
  })

  context('When adding a DSO for one date', () => {
    let data

    beforeEach(() => {
      cy.fixture('dsoTestData').then((d) => {
        data = d.singleDate
      })
    })

    it('should open the DSO form after clicking a pricing cell', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { propertyName, colIndex, listingId } = d.singleDate

        mcPage.searchProperty(propertyName)
        cy.wait('@listingApi')
        cy.wait('@guides')

        cy.get('table tbody tr').should('have.length', 2)

        mcPage.openDsoForCell(listingId, colIndex)
        cy.get(MC.priceSettings).should('have.text', PRICE_SETTINGS_LABEL)
      })
    })

    it('should validate that start and end dates are equal for a single date', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { propertyName, colIndex, listingId } = d.singleDate

        mcPage.searchProperty(propertyName)
        cy.wait('@listingApi')
        cy.wait('@guides')

        mcPage.openDsoForCell(listingId, colIndex)

        cy.get(MC.datePickerStart)
          .invoke('text')
          .then((startDate) => {
            cy.get(MC.datePickerEnd)
              .invoke('text')
              .then((endDate) => {
                expect(startDate.trim()).to.eq(endDate.trim())
              })
          })
      })
    })

    it('should fill the DSO form and submit successfully', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { propertyName, colIndex, listingId, finalPrice, minPrice, maxPrice, basePrice } = d.singleDate

        cy.intercept('POST', API.addCustomPricing).as('addPricing')
        cy.intercept('GET', API.getCalendarData).as('getCalendarData')
        cy.intercept('POST', API.dsoAutoRefresh).as('dsoRefresh')

        mcPage.searchProperty(propertyName)
        cy.wait('@listingApi')
        cy.wait('@guides')

        mcPage.openDsoForCell(listingId, colIndex)
        mcPage.fillDsoPrice(finalPrice)
        mcPage.fillMinPrice(minPrice)
        mcPage.fillMaxPrice(maxPrice)
        mcPage.fillBasePrice(basePrice)
        mcPage.submitDso()

        cy.wait('@addPricing').its('response.statusCode').should('eq', HTTP_OK)
      })
    })

    it('should return correct calendar data from the API', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { propertyName, colIndex, listingId, finalPrice, minPrice, maxPrice, basePrice, currency } = d.singleDate

        cy.intercept('POST', API.addCustomPricing).as('addPricing')
        cy.intercept('GET', API.getCalendarData).as('getCalendarData')
        cy.intercept('POST', API.dsoAutoRefresh).as('dsoRefresh')

        mcPage.searchProperty(propertyName)
        cy.wait('@listingApi')
        cy.wait('@guides')

        mcPage.openDsoForCell(listingId, colIndex)
        mcPage.fillDsoPrice(finalPrice)
        mcPage.fillMinPrice(minPrice)
        mcPage.fillMaxPrice(maxPrice)
        mcPage.fillBasePrice(basePrice)
        mcPage.submitDso()

        cy.wait('@addPricing')
        cy.wait('@getCalendarData').then(({ response }) => {
          const list = response.body.response.calendar_data

          const target = list.find(
            (item) =>
              item.min_price === minPrice &&
              item.max_price === maxPrice &&
              item.base_price === basePrice
          )

          expect(target).to.exist

          const today = new Date()
          today.setDate(today.getDate() + 11)
          const futureDate = today.toISOString().split('T')[0]

          expect(response.statusCode).to.eq(HTTP_OK)
          expect(target.start_date).to.eq(futureDate)
          expect(target.end_date).to.eq(futureDate)
          expect(target.currency).to.eq(currency)
          expect(target.min_price).to.eq(minPrice)
          expect(target.max_price).to.eq(maxPrice)
          expect(target.base_price).to.eq(basePrice)
          expect(target.listing_id).to.eq(listingId)
        })

        cy.wait('@dsoRefresh')
      })
    })

    it('should show the DSO band on the target cell', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { propertyName, colIndex, listingId, finalPrice, minPrice, maxPrice, basePrice } = d.singleDate

        cy.intercept('POST', API.addCustomPricing).as('addPricing')
        cy.intercept('GET', API.getCalendarData).as('getCalendarData')
        cy.intercept('POST', API.dsoAutoRefresh).as('dsoRefresh')

        mcPage.searchProperty(propertyName)
        cy.wait('@listingApi')
        cy.wait('@guides')

        mcPage.openDsoForCell(listingId, colIndex)
        mcPage.fillDsoPrice(finalPrice)
        mcPage.fillMinPrice(minPrice)
        mcPage.fillMaxPrice(maxPrice)
        mcPage.fillBasePrice(basePrice)
        mcPage.submitDso()

        cy.wait('@addPricing')
        cy.wait('@getCalendarData')
        cy.wait('@dsoRefresh')

        cy.get(MC.dsoBand(listingId)).should('have.class', DSO_BAND_CLASS)

        cy.get(MC.priceTooltip(listingId, 5)).should('not.have.class', DSO_BAND_CLASS)
      })
    })

    it('should display correct prices in the tooltip', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { propertyName, colIndex, listingId, finalPrice, minPrice, maxPrice, basePrice, currency } = d.singleDate

        cy.intercept('POST', API.addCustomPricing).as('addPricing')
        cy.intercept('GET', API.getCalendarData).as('getCalendarData')
        cy.intercept('POST', API.dsoAutoRefresh).as('dsoRefresh')

        mcPage.searchProperty(propertyName)
        cy.wait('@listingApi')
        cy.wait('@guides')

        mcPage.openDsoForCell(listingId, colIndex)
        mcPage.fillDsoPrice(finalPrice)
        mcPage.fillMinPrice(minPrice)
        mcPage.fillMaxPrice(maxPrice)
        mcPage.fillBasePrice(basePrice)
        mcPage.submitDso()

        cy.wait('@addPricing')
        cy.wait('@getCalendarData')
        cy.wait('@dsoRefresh')

        // Re-open tooltip to verify values
        cy.get(MC.priceTooltip(listingId, colIndex)).click()

        mcPage.verifyBasePriceInTooltip(basePrice, currency)
        mcPage.verifyMinPriceInTooltip(minPrice, currency)
        mcPage.verifyMaxPriceInTooltip(maxPrice, currency)
        mcPage.verifyFinalPriceInTooltip(finalPrice, currency)
      })
    })
  })
})
