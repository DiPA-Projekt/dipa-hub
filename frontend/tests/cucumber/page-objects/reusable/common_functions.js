

const elementContainsText = function (text) {
  return '//*[contains(text(), "' + text + '")]';
};



exports.elementContainsText = elementContainsText;