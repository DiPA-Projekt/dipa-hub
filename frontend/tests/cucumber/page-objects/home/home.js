const { client } = require('nightwatch-api');

const ELEMENTS = {
  txt_unsereReiseDurchsProjekt: '*//*[contains(text(), "Unsere Reise durchs Projekt")]',
  txt_unserZeitplan: '*//*[contains(text(), "Unser Zeitplan")]',
  txt_favoritenLinks: '*//*[contains(text(), "Favoriten-Links")]',
};

const navigate = function (menu) {
  switch (menu) {
    // immer sichtbare Menüs
    case 'Home':
    case 'Projektübersicht':
    case 'Projekt anlegen':
      client.click('xpath', elementContainsText(menu));

    // Nur über Home zugängliche Menüs
    case 'Nützliche Links':
    case 'Eine Reise durchs Projekt':
      if (client.assert.urlContains('home')) {
        client.click('xpath', elementContainsText(menu));
      } else {
        client
          .click('xpath', elementContainsText('Home'))
          .click('xpath', elementContainsText(menu));
      }

    // Nur über ein Projekt zugängliche Menüs
    case 'Schnellstart Projektmanagement (Planung)':
    case 'Umsetzung und Steuerung':
    case 'Abschluss':
      client.elements('xpath', elementContainsText(menu), function (result) {
        // Wenn die Menüs unter "Unsere Reise durchs Projekt" nicht sichtbar sind, dann erst auf "Unsere Reise durchs Projekt" klicken
        if (result.status == 0) {
          client.click('xpath', ELEMENTS.txt_unsereReiseDurchsProjekt);
        }
        client
          .waitForElementVisible('xpath', elementContainsText(menu), 3000)
          .click('xpath', elementContainsText(menu));
      });

    case 'Unsere Aufgaben':
    case 'Unsere Termine':
    case 'Stöbern & Vergleichen':
      client.elements('xpath', elementContainsText(menu), function (result) {
        // Wenn die Menüs UNTER "Unser Zeitplan" nicht sichtbar sind, dann erst auf "Unser Zeitplan" klicken
        if (result.status == 0) {
          client.click('xpath', ELEMENTS.txt_unserZeitplan);
        }
        client
          .waitForElementVisible('xpath', elementContainsText(menu), 3000)
          .click('xpath', elementContainsText(menu));
      });

    case 'Unsere Projektorganisation':
      client.click('xpath', elementContainsText(menu));

    case 'Jira':
    case 'Service Desk und WebSelfService':
    case 'ITR4Web':
    case 'GGB':
    case 'Rahmenverträge des ITZBund':
    case 'Informationen zur Verpflichtungsabnahme':
    case 'IT-Planungsverfahren und ITR4Web':
      client.elements('xpath', elementContainsText(menu), function (result) {
        // Wenn die Menüs UNTER "Favoriten-Links" nicht sichtbar sind, dann erst auf "Favoriten-Links" klicken
        if (result.status == 0) {
          client.click('xpath', ELEMENTS.txt_favoritenLinks);
        }
        client
          .waitForElementVisible('xpath', elementContainsText(menu), 3000)
          .click('xpath', elementContainsText(menu));
      });

    default:
      console.log('"' + menu + '" does not exist. Please check typo or implement');
      break;
  }
};

const elementContainsText = function (text) {
  return '*//*[contains(text(), "' + text + '")]';
};

module.exports = {
  navigate: navigate,
};
