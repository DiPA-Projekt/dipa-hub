# TODO: ORDNEN: E2E-Testkonzept

- Nur die Development-Branch kann aktuell getestet werden
- die E2E-Tests werden nach einem Merge ausgeführt
- Nächtliche Durchläufe
- Läuft gegen ein einheitliches Backend (develop)
- Getestet wird auf develop.dipa.online
- E2E-Tests haben immer die Gefahr von asynchronen Problemen und Überlagerungen
- Einhaltung der Testpyramide!
- Die zu testenden Testfälle befinden sich im Sprint-Board in der Spalte "E-to-E Tests" und können vom Automatisierer erledigt werden
- Wenn Daten in einem Test umgeändert werden, dann müssen sie am Ende des Tests wieder zurückgesetzt werden
- Für jedes Ticket wird ein neuer Branch aufgemacht und nach dem Schema e2e/"Ticketnummer" benannt
- diese Branch darf nur bei einem erfolgreichen Durchlauf der E2E-Tests in den develop-Branch gemerged werden


## Handlungsschritte
[ ] cucumber-Branch in develop mergen
[ ] Vor dem mergen einer e2e/"Ticketnummer"-Branch müssen die vorhandenen E2E-Tests durchlaufen




# DiPA - Cucumber + nightwatch.js  

  - [Getting Started](#getting-started)
    - [Lokales Testen (Nutzung von localhost statt develop.dipa.online)](#lokales-testen-nutzung-von-localhost-statt-developdipaonline)
  - [Empfohlene Plugins für VSCode:](#empfohlene-plugins-für-vscode)
  - [Konfigurationen](#konfigurationen)
    - [Einträge in der settings.json für den Editor:](#einträge-in-der-settingsjson-für-den-editor)
  - [Ordnerstruktur](#ordnerstruktur)
    - [Inhalte der einzelnen Ordner](#inhalte-der-einzelnen-ordner)
  - [Good to know](#good-to-know)
    - [useXpath() und useCss()](#usexpath-und-usecss)
    - [Unterschied visible und present](#unterschied-visible-und-present)
    - [Ausführung einer einzelnen Feature](#ausführung-einer-einzelnen-feature)

## Getting Started
Ist die Einrichtung der Entwicklungsumgebung abgeschlossen muss anschließend im Root-Verzeichnis die Anwendung mit Maven istalliert werden:
```bash
mvn clean install
```

### Lokales Testen (Nutzung von localhost statt develop.dipa.online)
Dieser Abschnitt ist nur notwendig, wenn lokal (localhost) gearbeitet werden soll (standardmäßig wird die Anwendung auf https://develop.dipa.online/ getestet):
Mit einem Command Line Interface das Backend (den Server) starten
```bash
./mvnw -f server/pom.xml spring-boot:run
```

Wenn das Backend durch einen bereits besetzen Port nicht starten kann, kann man durch den nachfolgenden Befehl die Anwendung, die den Port blockt, finden. Diese muss dann beendet werden.
```bash
netstat -abn
```

Mit dem zweiten Command Line Interface das Frontend starten
```bash
cd frontend
npm start
```

In dem dritten Command Line Interface, können dann die Cucumber Tests ausgeführt werden.
```bash
cd frontend
npm run cucumber
```


## Empfohlene Plugins für VSCode:
- Cucumber (Gherkin) Full Support
- Snippets and Syntax Highlight for Gherkin (Cucumber)

## Konfigurationen

### Einträge in der settings.json für den Editor:
Es wird empfohlen die nachfolgenden Zeilen in der settings.json zu übernehmen:
```json
  //https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete
  "cucumberautocomplete.steps": [
      "frontend/tests/cucumber/step-definitions/*.js",
      "frontend/tests/cucumber/step-definitions/*/*.js"
  ],
  "cucumberautocomplete.syncfeatures": "frontend/tests/cucumber/features",
  "cucumberautocomplete.smartSnippets": true,
  "cucumberautocomplete.stepsInvariants": true,
  "cucumberautocomplete.skipDocStringsFormat": true,
  "cucumberautocomplete.onTypeFormat": true,
  "cucumberautocomplete.gherkinDefinitionPart": "(Given|When|Then)\\(",
  "cucumberautocomplete.formatConfOverride": {
    "Ability": 0,
    "Business Need": 0,
    "Feature:": 0,
    "Scenario:": 1,
    "Background:": 1,
    "Scenario Outline:": 1,
    "Examples:": 2,
    "Given": 2,
    "When": 2,
    "Then": 2,
    "And": 2,
    "But": 2,
    "\\*": 2,
    "\\|": 3,
    "#": "relative",
    "@": "relative"
  },
  "editor.quickSuggestions": {
    "comments": false,
      "strings": true,
      "other": true
  }
}
```

## Ordnerstruktur
Die Ordnerstruktur unter [frontend/cucumber](../cucumber/features) ist unterteilt in drei Hauptordnern **features**, **page-objects** und **step-definitions**
Die Tests in features und die Klassen in page-objects sollen abhängig von der Navigation von DiPA strukturiert werden.

Um dies zu verdeutlichen ist nachfolgend die Ordnerstruktur grob abgebildet.
```
cucumber
│   README.md
|
└───features
│   └───login
│       │   login.feature
│   
└───page-objects
|   |   login.js
│   └───home
│   |   │   home.js
│   └───meine-projekte
|       └───unser-zeitplan
│           │   unsere_termine.js
│   
└───step-definitions
│   └───common
│   |   │   common.js
│   |   │   ...
|   |   asserts.js
|   |   clicks.js
|   |   ...
```

### Inhalte der einzelnen Ordner
Im nachfolgenden wird erläutert, wie ein Best-Practice bei der Erstellung eines Tests aussieht.
1. In dem Ordner **features** werden alle Feature-Dateien abgelegt. Dort beginnt die Erstellung eines Tests, denn als erstes muss ein Test Szenario mit der Gherkin Syntax erstellt werden.
2. Vordefinierte Sätze befinden sich im Ordner step-definitions. Hier gibt es keine spezielle Ordnerstruktur bezüglich der Navigation in DiPA. Die Funktionalitäten hinter der Gherkin Syntax werden dort zur Verfügung gestellt:
      ```feature 
      When('Ich klicke auf den Button {string}', (buttonName) => {
        return clickOnButton(buttonName);
      });
      ```
3. In den page-objects werden dann die Funktionen geschrieben, die in den step-definitions aufgerufen werden.
   ```js
   const clickOnButton = function (buttonName) {
     return client
    .waitForElementVisible('xpath',
      '//button/span[contains(text(), "' + buttonName + '")]', 5000)
    .click('xpath', '//button/span[contains(text(), "' + buttonName + '")]');
    };
   ```
## Good to know

### useXpath() und useCss()
- Die Funktionen useXpath() und useCss() sollten mit Vorsicht genossen werden, da diese dann für die gesamte Laufzeit gesetzt sind.
Wenn ein Step useXpath() nutzt und der nächste Step ein Element mit einem CSS Locator sucht, wird das nicht klappen bevor useCss() gesetzt wird.

### Unterschied visible und present
**present** = Das Element ist im DOM zu finden, muss aber nicht visible auf der UI sein.
**visible** = überprüft, ob das Element auf der Oberfläche zu sehen ist --> present wird automatisch mit überprüft

### Ausführung einer einzelnen Feature
In der [package.json](../../package.json) befindet sich in Zeile 24 der Aufruf von Cucumber
```json
"cucumber": "cross-env NIGHTWATCH_ENV=chrome cucumber-js tests/cucumber/features/**/*.feature --require cucumber.conf.js --require tests/cucumber/step-definitions --format @cucumber/pretty-formatter --format json:.reports/cucumber/report.json"

```

An der Stelle "\*.feature" kann der Name der Feature Datei angegeben werden. Beispiel:
```
tests/cucumber/features/**/*.feature
```
ersetzen mit
```
tests/cucumber/features/**/Login.feature
```
Anschließend den Test mit npm run cucumber starten
.
