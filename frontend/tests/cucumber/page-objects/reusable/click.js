const { client } = require('nightwatch-api');

const klickeAufText = function (text) {
  return client
    .waitForElementVisible('xpath', '*//*[contains(text(), "' + text + '")]', 5000)
    .click('xpath', '*//*[contains(text(), "' + text + '")]');
};

module.exports = {
  klickeAufText: klickeAufText,
};
