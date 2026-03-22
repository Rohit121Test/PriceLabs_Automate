// ─── Bulk Update DSO ──────────────────────────────────────────────────
import mcPage from '../../pages/MultiCalendarPage'
import { MC } from '../../locators/MultiCalendarLocators'
import {
  LISTING_1, LISTING_2, DSO_BAND_CLASS, PRICE_SETTINGS_LABEL,
  API, HTTP_OK
} from '../../support/constants'
import { getISODate } from '../../support/dateHelpers'

describe('Bulk Update DSO', () => {
  beforeEach(() => {
    cy.intercept('GET', API.listings).as('listingApi')
    cy.intercept('POST', API.guides).as('guides')
    cy.login()
  })

  context('When applying a DSO to multiple properties', () => {
    it('should select multiple properties and verify bulk action buttons', () => {
      cy.url().should('include', '/multicalendar')

      mcPage.selectBulkProperty(LISTING_2)
      mcPage.selectBulkProperty(LISTING_1)

      cy.get(MC.saveAndRefreshBtn).should('be.visible')
      cy.get(MC.syncNowBtn).should('be.visible')
      cy.get(MC.applyOverrideBtn).should('be.visible')
      cy.get(MC.clearBulkBtn).should('be.visible')
    })

    it('should open the bulk DSO form and fill a date range', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { finalPrice, listingIds, dateOffsetStart, dateOffsetEnd } = d.bulkUpdate

        cy.intercept('POST', API.addBulkCustomPricing).as('addBulkPricing')
        cy.intercept('POST', API.getBulkCalendarData).as('getBulkCalendarData')
        cy.intercept('POST', API.bulkDsoAutoRefreshPoll).as('dsoBulkRefresh')

        cy.url().should('include', '/multicalendar')

        mcPage.selectBulkProperty(listingIds[0])
        mcPage.selectBulkProperty(listingIds[1])
        mcPage.openBulkOverride()

        cy.get(MC.priceSettings).should('have.text', PRICE_SETTINGS_LABEL)

        mcPage.openDatePicker()
        mcPage.selectDate(dateOffsetStart)
        mcPage.selectDate(dateOffsetEnd)

        mcPage.fillDsoPrice(finalPrice)
        mcPage.submitDso()

        cy.wait('@addBulkPricing').its('response.statusCode').should('eq', HTTP_OK)
        cy.wait('@getBulkCalendarData')
        cy.wait('@dsoBulkRefresh')
      })
    })

    it('should return correct bulk calendar data from the API', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { finalPrice, listingIds, dateOffsetStart, dateOffsetEnd } = d.bulkUpdate

        cy.intercept('POST', API.addBulkCustomPricing).as('addBulkPricing')
        cy.intercept('POST', API.getBulkCalendarData).as('getBulkCalendarData')
        cy.intercept('POST', API.bulkDsoAutoRefreshPoll).as('dsoBulkRefresh')

        cy.url().should('include', '/multicalendar')

        mcPage.selectBulkProperty(listingIds[0])
        mcPage.selectBulkProperty(listingIds[1])
        mcPage.openBulkOverride()

        mcPage.openDatePicker()
        mcPage.selectDate(dateOffsetStart)
        mcPage.selectDate(dateOffsetEnd)

        mcPage.fillDsoPrice(finalPrice)
        mcPage.submitDso()

        const expectedStartISO = getISODate(dateOffsetStart)
        const expectedEndISO = getISODate(dateOffsetEnd)

        cy.wait('@addBulkPricing')
        cy.wait('@getBulkCalendarData').then(({ response }) => {
          expect(response.statusCode).to.eq(HTTP_OK)

          const overrides = response.body.response.date_specific_overrides

          const actualKeys = Object.keys(overrides).sort()
          const expectedKeys = [...listingIds].sort()
          expect(actualKeys).to.deep.equal(expectedKeys)

          expectedKeys.forEach((listingId) => {
            const match = overrides[listingId].calendar_data.find(
              (item) =>
                item.start_date === expectedStartISO &&
                item.end_date === expectedEndISO
            )
            expect(
              match,
              `No entry with start: ${expectedStartISO} and end: ${expectedEndISO} found for ${listingId}`
            ).to.exist
          })
        })

        cy.wait('@dsoBulkRefresh')
      })
    })

    it('should show DSO bands on the correct cells for both properties', () => {
      cy.fixture('dsoTestData').then((d) => {
        const { finalPrice, listingIds, dateOffsetStart, dateOffsetEnd } = d.bulkUpdate

        cy.intercept('POST', API.addBulkCustomPricing).as('addBulkPricing')
        cy.intercept('POST', API.getBulkCalendarData).as('getBulkCalendarData')
        cy.intercept('POST', API.bulkDsoAutoRefreshPoll).as('dsoBulkRefresh')

        cy.url().should('include', '/multicalendar')

        mcPage.selectBulkProperty(listingIds[0])
        mcPage.selectBulkProperty(listingIds[1])
        mcPage.openBulkOverride()

        mcPage.openDatePicker()
        mcPage.selectDate(dateOffsetStart)
        mcPage.selectDate(dateOffsetEnd)

        mcPage.fillDsoPrice(finalPrice)
        mcPage.submitDso()

        cy.wait('@addBulkPricing')
        cy.wait('@getBulkCalendarData')
        cy.wait('@dsoBulkRefresh')

        // Verify DSO bands for both properties (columns 5–7 present, 8 absent)
        listingIds.forEach((listingId) => {
          ;[5, 6, 7].forEach((col) => {
            mcPage.verifyDsoBandExists(listingId, col)
          })
          mcPage.verifyDsoBandNotExists(listingId, 8)
        })
      })
    })
  })
})
