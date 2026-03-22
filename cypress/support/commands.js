import { MC } from '../locators/MultiCalendarLocators'
import { API } from './constants'

Cypress.Commands.add('login', () => {
  cy.fixture('dsoTestData').then((data) => {
    const { email, password } = data.credentials

    cy.intercept('POST', API.sessionInit).as('sessionInit')
    cy.intercept('GET', API.getUserPrefs).as('getuser')

    cy.visit('/signin')
    cy.get(MC.emailInput).clear().type(email)
    cy.get(MC.passwordInput).clear().type(password)
    cy.get(MC.submitBtn).click()

    cy.wait(['@sessionInit', '@getuser'])
    cy.url().should('include', '/multicalendar')
  })
})
