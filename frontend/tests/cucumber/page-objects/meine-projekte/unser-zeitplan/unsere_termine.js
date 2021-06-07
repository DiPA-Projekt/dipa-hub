const { client } = require('nightwatch-api');
const { sollteTextSehen } = require('../../reusable/assert');
const { klickeAufText } = require('../../reusable/click');

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
  btn_anlegen: 'Anlegen'
};

const closeMilestoneDescription = function () {
  return client.click(ELEMENTS.btn_close_milestone_detail);
};

const createNewMilestone = function (milestoneName, milestoneStatus) {
  klickeAufText(ELEMENTS.btn_meilenstein_hinzufuegen);
  sollteTextSehen(ELEMENTS.txt_meilenstein_anlegen);
  //default Status ist "offen"
  if (milestoneStatus == 'erledigt') {
    klickeAufText(ELEMENTS.chkbx_erledigt)
  }
  //Name & Datum
  client
    .setValue(ELEMENTS.tf_new_milestone_name, milestoneName)
    .click(ELEMENTS.icon_open_calendar)
    .click('xpath', ELEMENTS.cal_today);
    klickeAufText(ELEMENTS.btn_apply);
    klickeAufText(ELEMENTS.btn_anlegen);
};

module.exports = {
  closeMilestoneDescription: closeMilestoneDescription,
  createNewMilestone: createNewMilestone,
};
