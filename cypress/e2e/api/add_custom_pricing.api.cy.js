// ─── Add Custom Pricing API Tests ─────────────────────────────────────
import {
  HTTP_OK, API_FORBIDDEN, API_BAD_REQUEST,
  ERR_CODE_NO_SESSION, ERR_UNAUTHORIZED, ERR_PAYLOAD_EMPTY,
  API_URL
} from '../../support/constants'

describe('Add Custom Pricing API', () => {
  const headers = {
    'content-type': 'application/json',
    'origin': 'https://app.pricelabs.co',
    'referer': 'https://app.pricelabs.co/multicalendar',
  }

  context('When sending a valid request with a valid cookie', () => {
    it('should return 200 with SUCCESS message', () => {
      cy.fixture('apiPayload').then((payload) => {
        cy.request({
          method: 'POST',
          url: API_URL.addCustomPricing,
          headers: {
            ...headers,
            cookie: Cypress.env('PRICELABS_COOKIE'),
          },
          body: { ...payload, cacheBuster: Date.now() },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(HTTP_OK)
          expect(response.body.message).to.eq('SUCCESS')
        })
      })
    })
  })

  context('When sending a request with an expired cookie', () => {
    it('should return 403 with an unauthorized error', () => {
      cy.fixture('invalidCookie').then((cookieData) => {
        cy.fixture('apiPayload').then((payload) => {
          cy.request({
            method: 'POST',
            url: API_URL.addCustomPricing,
            headers: {
              ...headers,
              cookie: cookieData.cookie,
            },
            body: { ...payload, cacheBuster: Date.now() },
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.eq(HTTP_OK)
            expect(response.body.status).to.eq(API_FORBIDDEN)
            expect(response.body.response.error_code).to.eq(ERR_CODE_NO_SESSION)
            expect(response.body.response.error).to.eq(ERR_UNAUTHORIZED)
            expect(response.body.message).to.eq('SUCCESS')
          })
        })
      })
    })
  })

  context('When sending a request with an empty payload', () => {
    it('should return 400 with a listing-not-found error', () => {
      cy.request({
        method: 'POST',
        url: API_URL.addCustomPricing,
        headers: {
          ...headers,
          cookie: Cypress.env('PRICELABS_COOKIE'),
        },
        body: {},
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body.status).to.eq(API_BAD_REQUEST)
        expect(response.body.response.message).to.eq(ERR_PAYLOAD_EMPTY)
      })
    })
  })
})
