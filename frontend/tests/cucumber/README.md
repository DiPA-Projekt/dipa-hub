# Getting Started

```bash
// Als erstes die Anwendung mit Maven instalieren
mvn clean install

// Wir müssen 3 Command Line Interfaces parallel starten

// 1. Backend (Server) starten
./mvnw -f server/pom.xml spring-boot:run

// Wenn das Backend durch einen bereits besetzen Port nicht starten kann durch den nachfolgenden Befehl die Anwendung, die den Port blockt, finden. Diese muss dann beendet werden.

netstat -abn


// 2. Frontend
cd frontend
npm start


// 3. CLI
cd frontend
npm run cucumber

```

Empfohlene Plugins für VSCode:
Cucumber (Gherkin) Full Support


Einträge für settings.json für den Editor:
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

## Good to know

### useXpath() und useCss()
- Die Funktionen useXpath() und useCss() sollten mit Vorsicht genossen werden, da diese dann für die gesamte Laufzeit gesetzt sind.
Wenn ein Step useXpath() nutzt und der nächste Step ein Element mit einem CSS Locator sucht, wird das nicht klappen bevor useCss() gesetzt wird.
