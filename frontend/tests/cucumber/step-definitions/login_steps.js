const { client } = require('nightwatch-api');
const { Given, When, Then } = require('@cucumber/cucumber');

Given(/^Ich starte die App$/i, async () => {
  await client.url('https://develop.dipa.online/');
  await client.waitForElementVisible('body', 1000);
});

// TODO: Erkennungsmerkmale für Elemente auslagern in pageObjects
When(/^Ich melde mich als "([^"]*)" an$/, username => {
  return login(username, "12345");
});

When(/^Ich melde mich als "([^"]*)" mit "([^"]*)" an$/, (username, password) => {
  return login(username, password);
});

When(/^Ich melde mich ohne Credentials an$/, () => {
  return login("", "");
});

Then(/^sollte die Startseite zu sehen sein$/, () => {
  return client
    .waitForElementVisible('app-root')
    .assert.containsText("mat-nav-list", "Eine Reise durchs Projekt");
//  .waitForElementVisible('//*[text()="account_circle"]');
});

Then (/^Wird der Login wegen falscher Credentials abgewiesen$/, () => {
  return client
    .waitForElementVisible('span[id="input-error"]')
    .assert.containsText('span[id="input-error"]', 'Invalid username or password');
});

Then(/^sollte ich den Text "([^"]*)" sehen$/, errorText => {
  return client
    .waitForElementVisible('span[id="input-error"]')
    .assert.containsText('span[id="input-error"]', errorText);
});


// functions section
function login (username, password) {
  return client
  .assert.visible('input[id="username"]')
  .setValue('input[id="username"]', username)
  .assert.visible('input[id="password"]')
  .setValue('input[id="password"]', password)
  .click('input[id=kc-login]');
};
