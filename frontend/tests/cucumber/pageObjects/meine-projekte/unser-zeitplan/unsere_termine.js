const { client } = require('nightwatch-api');

// TODO: Entscheiden, ob wir für alle Klicks Funktionen schreiben (mit export von Funktionen)
// Oder versuchen flexbiel zu sein mit --> Ich klicke auf den Button "Export"
// Oder beides kombinieren?
const BTN_EXPORT = 'button[title=Exportiere Meilensteine im iCal Format]'

//TODO: Cucumber Satz unter step-definitions muss noch geschrieben werden
// D.h. unter step-definitions auch Ordnerstruktur anlegen? Macht das Sinn?
export function exportMeilenstein() {
  return client
    .click(BTN_EXPORT);
};
