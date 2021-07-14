const { client } = require('nightwatch-api');
const { When, Then} = require('@cucumber/cucumber');
const { createServeraustauschProject, projekt } = require('../../page-objects/Projekt_anlegen/projekt_anlegen');
const { openProject, navigate } = require('../../page-objects/home/home');

// var projektname = "Servertausch_" + (new Date().toLocaleString("de-DE"));
var projektname = "Test Risikoabschätzung";

When(/^Ich öffne das Serveraustausch-Projekt$/, () => {
  client
  .click('xpath', '//span[@class="mat-button-wrapper" and contains(text(), "Meine Projekte")]')
  .isVisible('xpath', '//button[contains(text(), "' + projektname +'")]', result => {
    client.keys(client.Keys.ESCAPE);
    if (result.status) {  // => Element NICHT gefunden
      createServeraustauschProject(projektname);
    }
  });
  return openProject(projektname);
});

Then(/^Die Risikoabschätzung wird angezeigt$/, () => {
  // besser zu "Unsere Termine" navigieren?
  navigate("Stöbern & Vergleichen");

  return client
  .waitForElementVisible('xpath', '//figure[@id="chart"]')
  .waitForElementVisible('xpath', projekt.elements.txt_risikoabschaetzung)
  .assert.visible({
    selector: projekt.elements.txt_risikoabschaetzung, 
    locateStrategy: 'xpath'
  });
});

//
//werden nur benötigt, falls jedes Mal ein neues Projekt erstellt werden soll
//
When(/^Ich lege ein neues Serveraustausch-Projekt an$/, () => {
  return createServeraustauschProject(projektname);
});

When(/^Ich öffne das neue Serveraustausch-Projekt$/, () => {
  return openProject(projektname);
});

Then(/^Ich archiviere das Projekt$/, () => {
  return client
  .waitForElementVisible('xpath', projekt.elements.btn_trippleDot)
  .click('xpath', projekt.elements.btn_trippleDot)
  .waitForElementVisible('xpath', projekt.elements.btn_projektArchivieren)
  .click('xpath', projekt.elements.btn_projektArchivieren)
  .assert.containsText('xpath', 'span[@class="timelineName"]', projektname);
});
