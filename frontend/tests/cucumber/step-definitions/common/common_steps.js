const { client } = require('nightwatch-api');
const { Given, When, Then } = require('@cucumber/cucumber');
const { navigate } = require('../../page-objects/home/home');

Given(/^Ich starte die App$/i, async () => {
  await client.url('https://develop.dipa.online/');
  await client.waitForElementVisible('body', 1000);
  await client.maximizeWindow();
});

Then('Ich warte {int} Sekunden', seconds => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
});

When(/^Ich navigiere zu "([^"]*)"$/, menu => {
  navigate(menu)
});
