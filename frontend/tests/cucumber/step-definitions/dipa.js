const { client } = require('nightwatch-api');
const { Given, When, Then } = require('@cucumber/cucumber');

Given(/^Ich starte die App$/i, async () => {
  await client.url('http://localhost:4200');
  await client.waitForElementVisible('body', 1000);
});