const { client } = require('nightwatch-api');
const { Then } = require('@cucumber/cucumber');
const { sollteDateiUnterPfadExistieren, sollteTextSehen, sollteTextNichtSehen } = require('../page-objects/reusable/assert');

Then('sollte die Datei {string} unter dem Pfad {string} existieren', (fileName, path) => {
  return sollteDateiUnterPfadExistieren(fileName, path);
});

Then('sollte ich den Text {string} sehen', (text) => {
  return sollteTextSehen(text);
});

Then('sollte ich den Text {string} nicht sehen', (text) => {
  return sollteTextNichtSehen(text);
});
