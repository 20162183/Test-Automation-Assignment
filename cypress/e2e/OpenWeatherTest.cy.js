// cypress/integration/openWeatherTest.js
describe('OpenWeatherMap API keys automation', () => {
  it('should log in, generate an API key, edit it, and save the key', () => {
    // Visit the OpenWeatherMap home page
    cy.visit('https://home.openweathermap.org/');

    // Fill in the login form
    cy.get('input[placeholder="Enter email"]')
    .first()
    .click()
    .type('OpenWeatherTest@proton.me');
    cy.get('input[placeholder="Password"]')
    .first()
    .click()
    .type('Abcdefg123!');

    // Submit the login form
    cy.get('input[value="Submit"]')
    .click()

    // Navigate to the API keys tab
    cy.contains('API keys')
    .click({ force: true })

    // Confirm that the API keys tab is displayed
    cy.url().should('include', '/api_keys');

    // Enter key name and click generate
    cy.get('input[placeholder="API key name"]')
    .type('Automated_test_key');
    cy.get('input[value="Generate"]')
    .click();

    // Validate if key was created
    cy.contains('Automated_test_key').should('exist');

    // Click Edit and change key name to "Edited_test_key"
    cy.contains('Automated_test_key');
    cy.get('[class="fa fa-edit"]')
    .first()
    .click();
    cy.get('input[id="edit_key_form_name"]')
    .clear().type('Edited_test_key');
    cy.contains('Save').click();

    // Validate if key name was saved
    cy.contains('Edited_test_key').should('exist');
  
    // Save key in the framework repository
  cy.contains('Edited_test_key');
  cy.get('pre').first()
  .invoke('text').then((apiKey) => {
    cy.writeFile('cypress/fixtures/apiKey.json', { apiKey: apiKey });
  });
});
});
