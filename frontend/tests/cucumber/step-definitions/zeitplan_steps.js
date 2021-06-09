const { client } = require('nightwatch-api');
const { Given, When, Then } = require('@cucumber/cucumber');
const { closeMilestoneDescription, createNewMilestone, fillMilestoneName, pickTodaysDate, axisContains} = require('../page-objects/meine-projekte/unser-zeitplan/unsere_termine');

When('Ich auf den Meilenstein {string} klicke', (milestoneName) => {
  // sucht und klickt auf das Meilenstein-Element mit einem bestimmten Titel
  return client.click(
    'xpath',
    '//*[local-name()="svg"]//*[local-name()="tspan" and text()="' +
      milestoneName +
      '"]/parent::*/parent::*/*[local-name()="path"]'
  );
});

// TODO: Funktioniert so nicht
When('Ich erstelle einen Meilenstein {string} mit dem Status {string}', (milestoneName, status) => {
  return createNewMilestone(milestoneName, status);
});

When('Ich fülle den Namen {string} für den Meilenstein aus', (milestoneName) => {
  return fillMilestoneName(milestoneName);
});

When('Ich wähle den heutigen Tag im Kalender aus', () => {
  return pickTodaysDate();
});

// ********** Asserts **********

// Checkt was in der Selectbox ausgewählt ist
Then('sollte die {string} Selectbox {string} beinhalten', (selectboxTitle, selectboxValue) => {
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

Then('sollte der Meilenstein {string} existieren', (milestoneName) => {
  return client
    .useXpath()
    .assert.elementPresent(
      '//*[local-name()="svg"]//*[local-name()="tspan" and text()="' +
      milestoneName +
      '"]/parent::*/parent::*/*[local-name()="path"]'
    );
});

Then('sollte der Meilenstein {string} nicht existieren', (milestoneName) => {
  return client
    .useXpath()
    .assert.not.elementPresent(
      '//*[local-name()="svg"]//*[local-name()="tspan" and text()="' +
      milestoneName +
      '"]/parent::*/parent::*/*[local-name()="path"]'
    );
});

Then('Ich schließe die Meilensteindetails', () => {
  return closeMilestoneDescription();
});


Then('sollte die Zeitachse {string} beinhalten', (text) => {
  return axisContains(text);
});
