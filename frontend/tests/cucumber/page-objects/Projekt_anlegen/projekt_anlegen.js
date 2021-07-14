const { client } = require('nightwatch-api');
const { clickOnElement } = require('../reusable/click');

const NEWPROJECTDEFAULTS = {
  Projektgröße: 'klein',
  Vorhabensart: 'Softwareneuentwicklung',
  Vorgehensweise: 'VMXT ITZBund Kleinprojekte',
  Projekttyp: 'Internes Projekt'
};

const ELEMENTS = {
  dialog_newProject: '//app-project-dialog//h1[contains(text(), "Projekt anlegen")]',
  txt_risikoabschaetzung: '//*[local-name()="text" and @class="riskAlarmText"]',
  btn_trippleDot: '//span/*[contains(text(), "more_vert")]',
  input_projektname: 'app-project-dialog input[formcontrolname="name"]',
  select_projekteigner: '//app-project-dialog//mat-select[@formcontrolname="projectOwner"]',
  select_vorhabensart: '//app-project-dialog//mat-select[@formcontrolname="operationTypeId"]',
  select_vorgehensweise: '//app-project-dialog//mat-select[@formcontrolname="projectApproachId"]',
  select_projekttyp: '//app-project-dialog//mat-select[@formcontrolname="projectType"]',
  select_projektgröße: '//app-project-dialog//mat-select[@formcontrolname="projectSize"]',
  option_serveraustausch: '//mat-option//*[contains(text(), "Serveraustausch")]',
  option_baPhasenmodell: '//mat-option//*[contains(text(), "BA Phasenmodell")]',
  btn_neuesProjektAnlegen: '//*[contains(text(), "Projekt anlegen")]',
  btn_anlegen: '//button/span[contains(text(), "Anlegen")]',
  btn_projektArchivieren: '//button[contains(text(), "Projekt archivieren")]'
};

const PROJEKT = {
  elements: ELEMENTS
}

const CREATESERVERAUSTAUSCHPROJECT = function (projektname) {
  clickOnElement(ELEMENTS.btn_neuesProjektAnlegen);
  clickOnElement(ELEMENTS.dialog_newProject);
  client
  .waitForElementVisible('css selector', ELEMENTS.input_projektname)
  .setValue('css selector', ELEMENTS.input_projektname, projektname)
  .assert.valueContains(ELEMENTS.input_projektname, projektname, "Projektname '" + projektname + "' nicht übernommen!");
  clickOnElement(ELEMENTS.select_vorhabensart);
  clickOnElement(ELEMENTS.option_serveraustausch);
  clickOnElement(ELEMENTS.select_vorgehensweise);
  clickOnElement(ELEMENTS.option_baPhasenmodell);
  return clickOnElement(ELEMENTS.btn_anlegen);

};

// module.exports = {
//   createServeraustauschProject: CREATESERVERAUSTAUSCHPROJECT,
//   getElements: GETELEMENTS
// };

exports.createServeraustauschProject = CREATESERVERAUSTAUSCHPROJECT;
exports.projekt = PROJEKT;
