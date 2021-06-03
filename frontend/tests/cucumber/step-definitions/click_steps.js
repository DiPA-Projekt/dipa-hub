const { client } = require('nightwatch-api');
const { When } = require('@cucumber/cucumber');

// Nicht überprüft, da es ein Beispiel ist
When(/^Ich klicke auf den Button "([^"]*)"$/, title => {
  return client.click('button[title="' + title + '"]')
});

When(/^Ich klicke auf den Text "([^"]*)"$/, text => {
  return client
    .waitForElementVisible('xpath', '*//*[contains(text(), "' + text + '")]', 5000)
    .click('xpath', '*//*[contains(text(), "' + text + '")]')
});
