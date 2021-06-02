const { client } = require('nightwatch-api');
const { Then } = require('@cucumber/cucumber');
const fs = require('fs')
// import assert from 'assert/strict';


Then(/^sollte die Datei "([^"]*)" unter dem Pfad "([^"]*)" existieren$/, (fileName, path) => {
  const pathToFile = path + '/' + fileName
  if (!fs.existsSync(pathToFile)) {
    return client
      .assert.ok(false, 'Die Datei "' + pathToFile + '" existiert nicht')
  }
  // vorheriger Versuch mit
  //https://nodejs.org/api/assert.html#assert_assert_ok_value_message
  //assert.ok(fs.existsSync(pathToFile), 'Datei ' + pathToFile + ' existiert nicht')
});
