const { client } = require('nightwatch-api');
const { When } = require('@cucumber/cucumber');
const { clickOnText, clickOnButton } = require('../page-objects/reusable/click');

When('Ich klicke auf den Button {string}', (buttonName) => {
  return clickOnButton(buttonName);
});

When('Ich klicke auf den Text {string}', (text) => {
  return clickOnText(text);
});
