# PriceLabs Cypress Automation Framework

This project is an automated testing framework for the PriceLabs Multi-Calendar and Date-Specific Override (DSO) features, covering both Frontend UI flows and Backend API endpoints.

## 🏗️ Architecture Overview

The framework is built using a **Hybrid TDD / Data-Driven Page Object Model (POM)** architecture. This approach separates concerns, making the tests highly readable, maintainable, and easy to scale.

Here is how the project is structured:

### 1. Test Specs (`cypress/e2e/`)
All test files follow a strict **TDD Contextual Structure**:
- `describe` blocks group major features.
- `context` blocks define specific states or scenarios.
- `it` blocks handle atomic, single-purpose assertions.
- Separated logically into `ui/` (frontend tests) and `api/` (backend tests).

### 2. Page Objects (`cypress/pages/`)
Contains classes like `MultiCalendarPage.js` that represent the UI pages.
- Houses all the **business logic** and user actions (e.g., `openDatePicker()`, `submitDso()`).
- Does **not** contain any raw CSS selectors or test data.

### 3. Locators Layer (`cypress/locators/`)
A dedicated layer that stores all UI selectors in one place (`MultiCalendarLocators.js`).
- Keeps the Page Objects clean.
- If a UI element changes on the website, you only need to update the selector here once, and it will fix all associated tests automatically.

### 4. Data-Driven Fixtures (`cypress/fixtures/`)
All test inputs are externalized into JSON files (like `dsoTestData.json` and `apiPayload.json`).
- Hard-coded values, property names, and even user credentials are removed from the test code.
- Makes it incredibly easy to test different scenarios just by updating the JSON data.

### 5. Support Utils & Constants (`cypress/support/`)
- **`constants.js`**: Centralized storage for shared error messages, listing IDs, API routes, and HTTP status codes.
- **`dateHelpers.js`**: Helper functions for handling date formats logically.
- **`commands.js`**: Custom Cypress commands, such as our streamlined `cy.login()` which dynamically pulls login credentials from the fixtures.

## 🚀 Running the Tests

To open the Cypress Test Runner (Interactive Mode):
```bash
npx cypress open
```

To run all tests in headless mode and generate MochaAwesome HTML Reports:
```bash
npx cypress run
```

Reports will be generated automatically in `cypress/reports/html/index.html`.
