const { client } = require('nightwatch-api');
const { sollteTextSehen } = require('../../reusable/assert');
const { clickOnText } = require('../../reusable/click');

const ELEMENTS = {
  // css
  btn_close_milestone_detail: 'button[color="warn"]',
  tf_new_milestone_name: 'input[formcontrolname="name"]',
  icon_open_calendar: 'button[aria-label="Open calendar"]',
  // xpath
  cal_today: '//*[contains(@class, "mat-calendar-body-today")]',
  // text
  btn_meilenstein_hinzufuegen: 'Meilenstein hinzufügen',
  txt_meilenstein_anlegen: 'Meilenstein anlegen',
  chkbx_erledigt: 'erledigt',
  btn_apply: 'Apply',
  btn_anlegen: 'Anlegen',
};

const CLOSEMILESTONEDESCRIPTION = function () {
  return client.useCss().click(ELEMENTS.btn_close_milestone_detail);
};

// TODO: Ist es überhaupt möglich functions die etwas returnen wiederzuverwenden....?
const CREATENEWMILESTONE = function (milestoneName, milestoneStatus) {
  clickOnText(ELEMENTS.btn_meilenstein_hinzufuegen);
  sollteTextSehen(ELEMENTS.txt_meilenstein_anlegen);
  //default Status ist "offen"
  if (milestoneStatus == 'erledigt') {
    clickOnText(ELEMENTS.chkbx_erledigt);
  }
  //Name & Datum
  client
    .setValue(ELEMENTS.tf_new_milestone_name, milestoneName)
    .click(ELEMENTS.icon_open_calendar)
    .click('xpath', ELEMENTS.cal_today);
  clickOnText(ELEMENTS.btn_apply);
  clickOnText(ELEMENTS.btn_anlegen);
};

const FILLMILESTONENAME = function (milestoneName) {
  return client.useCss().setValue(ELEMENTS.tf_new_milestone_name, milestoneName);
};

const PICKTODAYSDATE = function () {
  return client.click(ELEMENTS.icon_open_calendar).click('xpath', ELEMENTS.cal_today);
};

const AXISCONTAINS = function (text) {
  return client
    .useXpath()
    .assert.elementPresent('//*[local-name()="svg"]//*[local-name()="text" and text()="' + text + '"]');
};

const DRAGANDDROPMILESTONETODATE = function (milestoneName, dateString) {
  browser.moveToElement(
    'xpath', '//*[local-name()="svg"]//*[local-name()="tspan" and text()="' + milestoneName + '"]/parent::*/parent::*/*[local-name()="path"]', 0, 0);
  // browser.mouseButtonDown(0);
  // browser.moveToElement('yourLocator', '#endingElement', 0, 0);
  // browser.mouseButtonUp(0);
};

module.exports = {
  closeMilestoneDescription: CLOSEMILESTONEDESCRIPTION,
  createNewMilestone: CREATENEWMILESTONE,
  fillMilestoneName: FILLMILESTONENAME,
  pickTodaysDate: PICKTODAYSDATE,
  axisContains: AXISCONTAINS,
  dragAndDropMilestoneToDate: DRAGANDDROPMILESTONETODATE,
};
