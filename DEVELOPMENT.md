# Entwickeln im DiPA

Das OpenSource-Projekt (OSS) DiPA wird auf GitHub entwickelt und ist für jeden frei zugänglich.

## Einleitung

Für die Entwicklung von DiPA und deren Module verwenden wir ebenfalls stets freie Werkzeuge. Hierdurch wird allen die Beteiligung
am DiPA-Projekt ermöglicht, die Interesse haben mitzugestalten und Neues kennenzulernen.

## Scope dieses Dokuments

In diesem Dokument werden nur die übergreifenden Aspekte im Projekt beschrieben. Dinge die spezifisch für ein Modul / 
Komponente sind, werden in der `README.md` des jeweiligen Moduls beschrieben (und auch dort bei Änderungen zu dokumentieren).

## Offene Punkte

- [] Templates für PRs anlegen.
- [] Umgang mit Issues

## GIT Guidelines

### Workflow
Das Projekt verwendet den Git-Flow-Workflow. Ein detaillierte Erklärung ist 
[hier nachzulesen](https://www.atlassian.com/de/git/tutorials/comparing-workflows/gitflow-workflow). Dies wesentlichen 
Punkte sind: 
1. Das Projekt enthält zwei Hauptzweige (`develop`und `main`). 
2. In beide Zweige wird **nie** direkt comitted / gepushed.
3. Für Änderungen wird ein Branch erstellt und dann PR gegen den `develop` erstellt.
4. `develop` enthält jeweils den aktuellen Entwicklungsstand. PRs werden in der Regel immer gegen diesen 
Branch gestellt. 
 5. `main`: Ist der Hauptzweig der nur Stände enthält die als Release veröffentlicht wurde. Während des 
 Release-Prozess wird jeweils der aktuelle `develop` in den `main` gemerged und dort mit der Versionsnummer getagged. 

### Conventions

1. Commits sollten als Semantic Commits mit entsprechendem Prefix gestaltet sein (s.u.)
2. Commit-Kommentar sollten immer aussagekräftig sein. 
3. Branches sollten vor dem Erstellen eine PR nach Möglichkeit gesquashed sein (ansonsten werden sie dies 
während der Annahme des PR)

### Semantic Commits

Im Projekt verwenden wir [Semantic Commits](https://www.conventionalcommits.org/en/v1.0.0/). Folgende Typen sind erlaubt:

- feat (new feature)
- fix (bug fix)
- docs (changes to documentation)
- style (formatting, missing semi colons, etc; no code change)
- refactor (refactoring production code)
- test (adding missing tests, refactoring tests; no production code change)
- chore (updating grunt tasks etc; no production code change)
(Ausgeliehen von: http://karma-runner.github.io/0.10/dev/git-commit-msg.html)   

## Entwicklungsumgebung einrichten

Folgende Tools werden im Projekt benötigt bzw. kommen zum Einsatz.

- GitSCM (https://git-scm.com/)
- Node.js (https://nodejs.org/de/download/)
- Java (OpenJDK 11 or later)
- Maven
- Docker (Linux oder Docker for Windows)
- Editor
  - **Visual Studio Code** (https://code.visualstudio.com/) (Angular / Web-Entwicklung) und
  - **IntelliJ IDEA Community Edition** (https://www.jetbrains.com/de-de/idea/download/) (Java Backend)
- Command line interface
  - Entweder (Git-)**Bash** oder
  - **Cmder** (https://cmder.net/) oder
  - **Powershell**
  
## Build from Source

Der folgende Abschnitt beschreibt das Minimalsetup um DiPA auf Basis des Source zu bauen:

1. Java 11 muss lokal verfügbar sein (inkl. korrekt gesetzter `JAVA_HOME`-Variable)
2. Die Entwicklungs-Infrastruktur muss laufen, siehe [Lokale Entwicklungs-Infrastruktur](#lokale-entwicklungsinfrastruktur).
3. Im Basis-Verzeichnis `mvnw clean install` ausführen (oder `mvnw -DskipTests clean install` ohne Testfälle).
4. Mit `java -jar .\server\target\dipa-server-<current-version>.jar` kann der DiPA Server lokal gestartet werden. Dabei ist `<current-version>` zu ersetzen durch jeweils aktuelle Version des gebauten Branches (z.B. `0.0.1-SNAPSHOT`). 
5. Im Browser http://localhost:9080 öffnen. 

## Architektur

DiPA ist eine Webanwendung, die der Client-Server-Architektur entspricht. Derzeit besteht DiPA aus drei Modulen:

- Schnittsellen-Definition Client/Server (OpenAPI REST) `\open-api`
- Client (Frontend), SPA/PWA, JavaScript/TypeScript `\frontend`
- Server (Backend), Java Spring Boot `\server`

### API mit OpenAPI

Das _API-Modul_ definiert die Schnittstelle zwischen Client & Server 
gem. [OpenAPI Specification](https://swagger.io/specification/). Zitat aus der Spezifikation:

> The OpenAPI Specification (OAS) defines a standard, language-agnostic interface to RESTful APIs 
> which allows both humans and computers to discover and understand the capabilities of the service 
> without access to source code, documentation, or through network traffic inspection. When properly 
> defined, a consumer can understand and interact with the remote service with a minimal amount of 
> implementation logic.

Die _API-Modul_ besteht im Wesentlichen aus einer Sammlung von YAML-Dateien die die API beschreiben. Während des 
Build-Prozess werden diese in eine jar-Datei gepackaged und den anderen Modulen als Maven-Dependency zur Verfügung 
gestellt. Dort wird die Spezifikation genutzt um die passenden API-Stubs (Server-Interfaces, Api-Client) während es 
Build Prozesses zu generieren.

**Wichtig**: Um während der Entwicklung sicher zu gehen, dass Änderungen an der API Spezifikation in den Projekten der
anderen Module berücksichtigt werden, empfiehlt es sich nach Änderung an der am _API-Modul_ einen vollständigen 
"Build-From-Source" durchzuführen (`mvnw clean install`).        

### Client mit Angular

Das _Frontend-Modul_ enthält dien DiPA Client. Dieser ist als Angular-Anwendung aufgesetzt. Während der 
Frontend-Entwicklung können die üblichen Standard-Werkzeuge verwendet werden (z.B. npm, Angular-CLI, ...). 

Zur Integration des Frontends in den Gesamt-Build-Prozess werden diese mit Hilfe des 
[frontend-maven-plugin](https://github.com/eirslett/frontend-maven-plugin) gewrapped. Das Ergebnis des Frontend Builds
wird ebenfalls als jar-Datei gepackaged (diese jar entspricht den 
[Konventionen](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-spring-mvc-static-content), 
damit Spring Boot den Inhalt als "static resources" hosten kann). Dadurch kann das Frontend über den gleichen Server 
bereitgestellt werden wie das Backend. 

### Server mit Spring Boot

Der DiPA-Server ist eine Java Spring Boot Anwendung und implementiert u.a. die API, Validierung und Businesslogik 
der Backend-Seite. Im vollständig gebauten Zustand ist ein einzelnes Spring-Boot "Uber-Jar", welches alle von DiPA 
benötigten Resourcen enthält und direkt gestartet werden kann (exkl. Datenbank).

## Continous Deployment to Kubernetes (K8S)

An dieser Stelle wird nur eine kurze Übersicht über das Continous Deployment (CD) von DiPA gegeben. Die Details finden 
sich in der [Beschreibung](server/README.md#continous-deployment) der `dipa-server`-Komponente.
Der Ablauf ist dabei wie folgt (vollautomatisiert):
1. Die Anwendung wird regulär als Spring Boot Jar gebaut.
2. Für den Server wird ein Docker Image gebaut
3. Das Docker Image wird in eine private Docker Registry auf der DiPA VM gepushed. 
4. Während des Builds werden passende Kubernetes Deployment Descriptoren erstellt.
5. Nach erfolgreichem Build werden die Deployment Descriptoren auf die VM gepushed 
   und dort ein Update des Deployments durchgeführt. 
   
Aus dem CI Build heraus entstehen 2 automatische Deployments jeweils für den `HEAD` 
des `develop` branches (aktuellster Stand der Entwicklung) und den `main` (letztes Release).
Beim lokalen Build auf der Entwickler-Maschine kann ein drittes Deployment erzeugt werden um bspw. 
bestimmte Sacherverhalte vorab testen zu können (siehe Detail Beschreibung).
 
## Lokale Entwicklungs-Infrastruktur

Um einen möglichst einfachen und leichtgewichten Einstieg in DiPA zu ermöglichen wird die gesamte zusätzlich 
benötigte Infrastruktur (z.B. Datenbank-Server o.ä.) als Docker-Images integriert. Unter `environments/dev-stack.yml` 
findet sich eine Docker Compose Konfiguration welche die Infrastruktur in der benötigten Form definiert. 

Diese kann mit folgendem gestartet werden:
```bash
docker-compose -f environments/dev-stack.yml up
```
Mit folgendem Befehl wird Umgebung gestoppt und entfernt.
```bash
docker-compose -f environments/dev-stack.yml down
```
Führt man Änderung in der Umgebung durch (z.B. Einträge in der Datenbank, Schema-Änderung etc.) werden diese in den 
`Volumes` der `Container` gespeichert. Diese bedeutet, dass die Änderungen so lange erhalten bleiben (auch über eine 
Rechnerneustart), bis die Container (und damit auch die Volumes) explizit entfernt werden. Dies geschieht mit dem oben 
beschriebene `down` Befehl. Vorteil dabei ist, dass man mittels Nacheinander ausgeführtem `down` und `up` immer wieder 
auf einer sauberen Umgebung aufsetzt. 

## Build

Das Projekt verwendet den [Maven Wrapper](https://github.com/takari/maven-wrapper).
Dies bedeutet, dass keine lokale Installation notwendig ist. Es muss lediglich Java 
verfügbar und eingerichtet sein (gesetztes `JAVA_HOME`). 

Der Build wird mit folgenden Befehl gestartet. Für die Testfälle die dabei ausgeführt 
werden, muss die Entwicklungsinfrastruktur laufen.

```bash
mvnw clean install
```
