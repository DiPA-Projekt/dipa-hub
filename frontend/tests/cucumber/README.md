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

