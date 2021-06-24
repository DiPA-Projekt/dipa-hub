const { client } = require('nightwatch-api');
const { Given, When, Then } = require('@cucumber/cucumber');
const { selectboxValueIs } = require('../page-objects/reusable/select');

// ********** Asserts **********

Then('sollte in der {string} Selectbox der Wert {string} ausgewählt sein', (selectboxTitle, selectboxValue) => {
  return selectboxValueIs
});
