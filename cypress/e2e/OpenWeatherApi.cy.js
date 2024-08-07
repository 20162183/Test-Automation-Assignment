/// <reference types="cypress" />

describe('OpenWeatherMap API Tests', () => {
    let apiKey;

    // Load the API key before running tests
    before(() => {
        cy.fixture('apiKey.json').then((key) => {
            apiKey = key.apiKey;
        });
    });

    // Positive test: Fetch current weather for a valid city
    it('should fetch current weather data for a valid city', () => {
        const city = 'London';
        cy.request({
            method: 'GET',
            url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('weather');
            expect(response.body).to.have.property('main');
            expect(response.body.name).to.eq(city);
        });
    });

    // Negative test: Fetch current weather for an invalid city
    it('should return an error for an invalid city', () => {
        const invalidCity = 'InvalidCityName';
        cy.request({
            method: 'GET',
            url: `https://api.openweathermap.org/data/2.5/weather?q=${invalidCity}&appid=${apiKey}`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('message', 'city not found');
        });
    });

    // Negative test: Fetch current weather with an invalid API key
    it('should return an error for an invalid API key', () => {
        const city = 'London';
        const invalidApiKey = 'InvalidApiKey';
        cy.request({
            method: 'GET',
            url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${invalidApiKey}`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body).to.have.property('message', 'Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.');
        });
    });

    // Positive test: Fetch current weather using geographic coordinates
    it('should fetch current weather data for valid geographic coordinates', () => {
        const lat = 51.5073;
        const lon = -0.1276; // Coordinates for London
        cy.request({
            method: 'GET',
            url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('weather');
            expect(response.body).to.have.property('main');
            expect(response.body.coord.lat).to.eq(lat);
            expect(response.body.coord.lon).to.eq(lon);
        });
    });

    // Negative test: Fetch current weather with missing required parameters
    it('should return an error when required parameters are missing', () => {
        cy.request({
            method: 'GET',
            url: `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('message', 'Nothing to geocode');
        });
    });
});