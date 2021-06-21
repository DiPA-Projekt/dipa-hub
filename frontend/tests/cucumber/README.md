# DiPA - Cucumber + nightwatch.js  

  - [Getting Started](#getting-started)
    - [Lokales Testen (Nutzung von localhost statt develop.dipa.online)](#lokales-testen-nutzung-von-localhost-statt-developdipaonline)
  - [Empfohlene Plugins für VSCode:](#empfohlene-plugins-für-vscode)
  - [Konfigurationen](#konfigurationen)
    - [Einträge in der settings.json für den Editor:](#einträge-in-der-settingsjson-für-den-editor)
  - [Ordnerstruktur](#ordnerstruktur)
  - [Good to know](#good-to-know)
    - [useXpath() und useCss()](#usexpath-und-usecss)
    - [Unterschied visible und present](#unterschied-visible-und-present)
  

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
## Good to know

### useXpath() und useCss()
- Die Funktionen useXpath() und useCss() sollten mit Vorsicht genossen werden, da diese dann für die gesamte Laufzeit gesetzt sind.
Wenn ein Step useXpath() nutzt und der nächste Step ein Element mit einem CSS Locator sucht, wird das nicht klappen bevor useCss() gesetzt wird.

<a name="visiblePresent"></a>
### Unterschied visible und present
