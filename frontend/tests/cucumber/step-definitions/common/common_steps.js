const { client } = require('nightwatch-api');
const { Given, When, Then } = require('@cucumber/cucumber');
const { navigate } = require('../../page-objects/home/home');

Given(/^Ich starte die App$/i, async () => {
  await client.url('https://develop.dipa.online/');
  await client.waitForElementVisible('body', 1000);
  await client.maximizeWindow();
});

Then('Ich warte {int} Sekunden', seconds => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
});

When(/^Ich navigiere zu "([^"]*)"$/, menu => {
  navigate(menu)
});

Then(/^Ich lösche die Datei "([^"]*)" unter dem Pfad "([^"]*)"$/, (fileName, path) => {
  const pathToFile = path + '/' + fileName;
  if (!fs.existsSync(pathToFile)) {
    throw Error('Die Datei "' + pathToFile + '" existiert nicht');
  }else{
    fs.unlink(pathToFile)
  }
});
