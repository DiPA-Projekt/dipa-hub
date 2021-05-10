const { client } = require('nightwatch-api');
const { Given, When, Then } = require('@cucumber/cucumber');

Given(/^Ich starte die App$/i, async () => {
  await client.url('http://localhost:4200');
  await client.waitForElementVisible('body', 1000);
});

// TODO: Erkennungsmerkmale für Elemente auslagern in pageObjects
When(/^Ich melde mich als "([^"]*)" an$/, username => {
  return client
    .assert.visible('input[id="username"]')
    .setValue('input[id="username"]', username)
    .assert.visible('input[id="password"]')
    .setValue('input[id="password"]', 12345)
    .click('input[id=kc-login]');
});

When(/^Ich melde mich als "{string}" mit "{string}" an$/, (username, password) => {
  return client
    .assert.visible('input[id="username"]')
    .setValue('input[id="username"]', username)
    .assert.visible('input[id="password"]')
    .setValue('input[id="password"]', password)
    .click('input[id=kc-login]');
});

Then(/^sollte die Startseite zu sehen sein$/, () => {
  return client
    .waitForElementVisible('//*[text()="account_circle"]');
});
