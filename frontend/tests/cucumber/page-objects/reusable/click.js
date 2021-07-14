const { client } = require('nightwatch-api');

const clickOnText = function (text) {
  return client
    .waitForElementVisible('xpath', '//*[contains(text(), "' + text + '")]', 5000)
    .click('xpath', '//*[contains(text(), "' + text + '")]');
};

const clickOnButton = function (buttonName) {
  return client
    .waitForElementVisible('xpath', '//button/span[contains(text(), "' + buttonName + '")]', 5000)
    .click('xpath', '//button/span[contains(text(), "' + buttonName + '")]');
};

const CLICKONELEMENT = function(xpath) {
  return client
    .waitForElementVisible('xpath', xpath, 5000)
    .click('xpath', xpath);
}

// module.exports = {
//   clickOnText: clickOnText,
//   clickOnButton: clickOnButton,
//   clickOnElement: CLICKONELEMENT
// };

exports.clickOnText = clickOnText;
exports.clickOnButton = clickOnButton;
exports.clickOnElement = CLICKONELEMENT;
