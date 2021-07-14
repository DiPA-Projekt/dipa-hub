const { client } = require('nightwatch-api');
const fs = require('fs');

const sollteDateiUnterPfadExistieren = function (fileName, path) {
  const pathToFile = path + '/' + fileName;
  if (!fs.existsSync(pathToFile)) {
    throw Error('Die Datei "' + pathToFile + '" existiert nicht');
  }
};

const sollteTextSehen = function (text) {
  return client
  .useXpath()
  .assert.elementPresent('//*[contains(text(), "' + text + '")]');
};

const sollteTextNichtSehen = function (text) {
  return client
  .useXpath()
  .assert.not.elementPresent('//*[contains(text(), "' + text + '")]');
};

// module.exports = {
  // sollteDateiUnterPfadExistieren: sollteDateiUnterPfadExistieren,
  // sollteTextSehen: sollteTextSehen;
  // sollteTextNichtSehen: sollteTextNichtSehen;
// };

exports.sollteDateiUnterPfadExistieren = sollteDateiUnterPfadExistieren;
exports.sollteTextSehen = sollteTextSehen;
exports.sollteTextNichtSehen = sollteTextNichtSehen;
