const { client } = require('nightwatch-api');
const { Given, When, Then } = require('@cucumber/cucumber');
const { closeMilestoneDescription, createNewMilestone, fillMilestoneName, pickTodaysDate, axisContains, clickOnMilestone, shouldExistNumberMilestones, milestoneShouldExist, milestoneShouldNotExist} = require('../page-objects/meine-projekte/unser-zeitplan/unsere_termine');

When('Ich auf den Meilenstein {string} klicke', (milestoneName) => {
  return clickOnMilestone
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

When('Ich verschiebe den Meilenstein {string} zum {string}', (milestoneName, dateString) => {

})

// ********** Asserts **********

Then('sollten {int} Meilensteine existieren', (number) => {
  return shouldExistNumberMilestones(number)
});

Then('sollte der Meilenstein {string} existieren', (milestoneName) => {
  return milestoneShouldExist(milestoneName);
});

Then('sollte der Meilenstein {string} nicht existieren', (milestoneName) => {
  return milestoneShouldNotExist(milestoneName);
});

Then('Ich schließe die Meilensteindetails', () => {
  return closeMilestoneDescription();
});


Then('sollte die Zeitachse {string} beinhalten', (text) => {
  return axisContains(text);
});
