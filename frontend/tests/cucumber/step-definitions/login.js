const { client } = require('nightwatch-api');
const { When, Then } = require('@cucumber/cucumber');
const { loginpage, login } = require('../page-objects/login');


When('Ich melde mich mit falschen Daten an', () => {
  return login(loginpage.credentials.invalid.user, loginpage.credentials.invalid.pass);
});

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
    .waitForElementVisible(loginpage.elements.span_input_error)
    .assert.containsText(loginpage.elements.span_input_error, 'Invalid username or password');
});


