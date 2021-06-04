const { client } = require('nightwatch-api');
const { Then } = require('@cucumber/cucumber');
const fs = require('fs');
// import assert from 'assert/strict';

Then(/^sollte die Datei "([^"]*)" unter dem Pfad "([^"]*)" existieren$/, (fileName, path) => {
  const pathToFile = path + '/' + fileName;
  if (!fs.existsSync(pathToFile)) {
    throw Error('Die Datei "' + pathToFile + '" existiert nicht');
  }
});

Then(/^sollte ich den Text "([^"]*)" sehen$/, (text) => {
  return client.waitForElementVisible('xpath', '*//*[contains(text(), "' + text + '")]')
});
