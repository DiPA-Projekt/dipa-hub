const { client } = require('nightwatch-api');
const { When } = require('@cucumber/cucumber');
const { klickeAufText } = require('../page-objects/reusable/click');


When('Ich klicke auf den Text {string}', (text) => {
  return klickeAufText(text);
});
