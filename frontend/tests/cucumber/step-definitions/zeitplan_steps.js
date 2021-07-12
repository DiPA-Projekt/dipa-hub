const { client } = require('nightwatch-api');
const { Given, When, Then } = require('@cucumber/cucumber');

When(/^Ich auf den Meilenstein "([^"]*)" klicke$/, (mileStoneName) => {
  // sucht und klickt auf das Meilenstein-Element mit einem bestimmten Titel
  return client.click('xpath', '//*[local-name()="svg"]//*[local-name()="tspan" and text()="' + mileStoneName + '"]/parent::*/parent::*/*[local-name()="path"]');
});

// ********** Asserts **********

// Checkt was in der Selectbox ausgewählt ist
Then(/^sollte die "([^"]*)" Selectbox "([^"]*)" beinhalten$/, (selectboxTitle, selectboxValue) => {
  //xpath sucht nach einem mat-select Element, welches ein Geschwister-Element mit einem bestimmten Text sucht
  return client.waitForElementVisible(
    'xpath',
    '//*[contains(text(), ' +
      selectboxTitle +
      ')]/preceding-sibling::mat-select//*[contains(text(), "' +
      selectboxValue +
      '")]'
  );
});

Then('sollten {int} Meilensteine existieren', (number) => {
  return client.elements('xpath', '//*[@class="milestoneEntry"]', function (result) {
    if (result.value.length !== number) {
      throw Error('Expected: ' + number + ' elements but got: ' + result.value.length);
    }
  });
});
