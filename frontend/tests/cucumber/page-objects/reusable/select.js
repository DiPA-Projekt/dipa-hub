const { client } = require('nightwatch-api');

const selectboxValueIs = function (selectboxTitle, selectboxValue){
  //xpath sucht nach einem mat-select Element, welches ein Geschwister-Element mit einem bestimmten Text sucht
  return client.waitForElementVisible(
    'xpath',
    '//*[contains(text(), ' +
      selectboxTitle +
      ')]/preceding-sibling::mat-select//*[contains(text(), "' +
      selectboxValue +
      '")]'
  );
}

module.exports = {
  selectboxValueIs: selectboxValueIs,
};
