const { client } = require('nightwatch-api');
const fs = require('fs');

const sollteDateiUnterPfadExistieren = function (fileName, path) {
  const pathToFile = path + '/' + fileName;
  if (!fs.existsSync(pathToFile)) {
    throw Error('Die Datei "' + pathToFile + '" existiert nicht');
  }
};

const sollteTextSehen = function (text) {
  return client.waitForElementVisible('xpath', '*//*[contains(text(), "' + text + '")]');
};

module.exports = {
  sollteDateiUnterPfadExistieren: sollteDateiUnterPfadExistieren,
  sollteTextSehen: sollteTextSehen
};
