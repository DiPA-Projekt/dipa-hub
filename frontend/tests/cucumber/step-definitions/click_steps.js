const { client } = require('nightwatch-api');
const { Given, When, Then } = require('@cucumber/cucumber');

// Nicht überprüft, da es ein Beispiel ist
When(/^Ich klicke auf den Button "([^"]*)" $/, title => {
  return client
    .click('button[title="' + title + '"]')
});
