const { client } = require('nightwatch-api');
const { elementContainsText } = require('../reusable/common_functions');

const ELEMENTS = {
  txt_unsereReiseDurchsProjekt: '//*[contains(text(), "Unsere Reise durchs Projekt")]',
  txt_unserZeitplan: '//*[contains(text(), "Unser Zeitplan")]',
  txt_favoritenLinks: '//*[contains(text(), "Favoriten-Links")]',
  icon_profil: '//*[contains(text(), "account_circle")]',
  txt_logout: '//*[contains(text(), "Ausloggen")]',
  menu_meineProjekte: '//span[@class="mat-button-wrapper" and contains(text(), "Meine Projekte")]'
};

const OPENPROJECT = function (projektname) {
  return client
  .waitForElementVisible('xpath', ELEMENTS.menu_meineProjekte)
  .click('xpath', ELEMENTS.menu_meineProjekte)
  .waitForElementVisible('xpath', '//button[contains(text(), "' + projektname +'")]')
  .click('xpath', '//button[contains(text(), "' + projektname +'")]')
  .waitForElementVisible('xpath', '//div[@class="mat-card-title" and contains(text(), "' + projektname +'")]');
};

const logout = function () {
  return client
    .click('xpath', ELEMENTS.icon_profil)
    .click('xpath', ELEMENTS.txt_logout)
    .useCss()
    .assert.elementPresent('.card-pf');
}

// TODO: Wait until ein Element auf der Fogleseite zu finden ist
const navigate = function (menu) {
  switch (menu) {
    // immer sichtbare Menüs
    case 'Home':
    case 'Projektübersicht':
    case 'Projekt anlegen':
      client.click('xpath', elementContainsText(menu));
      break;

    // Nur über Home zugängliche Menüs
    case 'Nützliche Links':
    case 'Eine Reise durchs Projekt':
      if (client.assert.urlContains('home')) {
        client.click('xpath', elementContainsText(menu));
      } else {
        client
          .click('xpath', elementContainsText('Home'))
          .pause(1000)
          .click('xpath', elementContainsText(menu));
      }
      break;

    // Nur über ein Projekt zugängliche Menüs
    case 'Schnellstart Projektmanagement (Planung)':
    case 'Umsetzung und Steuerung':
    case 'Abschluss':
      client.elements('xpath', elementContainsText(menu), function (result) {
        // Wenn die Menüs unter "Unsere Reise durchs Projekt" nicht sichtbar sind, dann erst auf "Unsere Reise durchs Projekt" klicken
        if (result.status == 0) {
          client.click('xpath', ELEMENTS.txt_unsereReiseDurchsProjekt)
          .pause(1000);
        }
        client
          .waitForElementVisible('xpath', elementContainsText(menu), 3000)
          .click('xpath', elementContainsText(menu));
      });
      break;

    case 'Unsere Aufgaben':
    case 'Unsere Termine':
    case 'Stöbern & Vergleichen':
      client.elements('xpath', elementContainsText(menu), function (result) {
        // Wenn die Menüs UNTER "Unser Zeitplan" nicht sichtbar sind, dann erst auf "Unser Zeitplan" klicken
        if (result.value.length == 0) {
          client.click('xpath', ELEMENTS.txt_unserZeitplan)
          .pause(1000);
        }
        client
          .waitForElementVisible('xpath', elementContainsText(menu), 3000)
          .click('xpath', elementContainsText(menu));
      });
      break;

    case 'Unsere Projektorganisation':
      client.click('xpath', elementContainsText(menu));
      break;

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
          client.click('xpath', ELEMENTS.txt_favoritenLinks)
          .pause(1000);
        }
        client
          .waitForElementVisible('xpath', elementContainsText(menu), 3000)
          .click('xpath', elementContainsText(menu));
      });
      break;

    default:
      console.log('"' + menu + '" does not exist. Please check typo or implement');
      break;
  }
};

// module.exports = {
//   navigate: navigate,
//   logout: logout,
//   openProject: OPENPROJECT
// };

exports.navigate = navigate;
exports.logout = logout;
exports.openProject = OPENPROJECT;
