const { client } = require('nightwatch-api');
const { Given, When, Then } = require('@cucumber/cucumber');
const { ELEMENTS, CREDENTIALS, login } = require('../page-objects/login');


When('Ich melde mich mit falschen Daten an', () => {
  return login(CREDENTIALS.invalid.user, CREDENTIALS.invalid.pass);
});

// TODO: Erkennungsmerkmale für Elemente auslagern in pageObjects
When('Ich melde mich als {string} an', username => {
  return login(username, "12345");
});

When('Ich melde mich als {string} mit {string} an', (username, password) => {
  return login(username, password);
});

When('Ich melde mich ohne Credentials an', () => {
  return login("", "");
});

Then('sollte die Startseite zu sehen sein', () => {
  return client
    .waitForElementVisible('app-root')
    .assert.containsText("mat-nav-list", "Eine Reise durchs Projekt");
});

Then('Wird der Login wegen falscher Credentials abgewiesen', () => {
  return client
    .waitForElementVisible(ELEMENTS.span_input_error)
    .assert.containsText(ELEMENTS.span_input_error, 'Invalid username or password');
});


