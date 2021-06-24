const { client } = require('nightwatch-api');
const { Given, When, Then } = require('@cucumber/cucumber');
const { navigate, logout } = require('../../page-objects/home/home');
const fs = require('fs');

Given('Ich starte die App', async () => {
  await client.url('https://develop.dipa.online/');
  await client.waitForElementVisible('body', 1000);
  await client.maximizeWindow();
});

Then('Ich warte {int} Sekunden', (seconds) => {
  return client.pause(seconds * 1000);
});

When('Ich navigiere zu {string}', (menu) => {
  navigate(menu);
});

When('Ich melde mich ab', () => {
  return logout();
})

Then('Ich lösche die Datei {string} unter dem Pfad {string}', (fileName, path) => {
  const pathToFile = path + '/' + fileName;
  if (!fs.existsSync(pathToFile)) {
    throw Error('Die Datei "' + pathToFile + '" existiert nicht');
  } else {
    fs.unlinkSync(pathToFile);
  }
});
