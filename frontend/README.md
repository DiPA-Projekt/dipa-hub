# DIPA Frontend

Frontend lokal starten:
```
npm start
```
Dadurch wird der lokale Dev-Server für die UI gestartet, allerdings im Gegensatz zu `ng serve` bereits mit der richtigen `proxy.conf` um auf einen lokal laufenden Back-End-Server zu kommen.

## Eingesetzte Frameworks / Technologie

- Angular
- Angular Material
- Bootstrap (CSS Grid Only)

## Struktur Frontend

Das Frontend besteht aus 2 Angular Projekten:

- **dipa-api-client**: Enthält die Client Stubs zum Zugriff auf die Rest-API des Servers. Wird in wesentlichen Teilen aus der OpenAPI Spec generiert. 
- **dipa-frontend**: Enthält den eigentlichen Client Code.

### Aufbau `dipa-frontend`

- Das Angular `AppModule` enthält selbst keine eigene Funktionalität, sondern wird nur verwendet um in die anderen Module der Anwendung zu routen & globale Imports zu definieren.
- Für die `AppComponent` gilt Gleiches. Dies enthält höchstens einen Header (Navbar) und Footer der auf allen Seiten anzeigt werden soll. 
- Im Top-Level gibt es drei Module: 
  - `CoreModule`: Wird nur einmal im `AppModule` importiert und enthält bspw. Service Singletons oder Guards die applikationsweit genutzt werden sollen.  
  - `SharedModule`: Kann von jedem Modul importiert werden, dass Inhalte daraus benötigt. Typischerweise werden dort häufig verwendete Components oder Pipes definiert. 
  - `MaterialModule`: Hilfsmodul das alle verwendeten Material Komponenten  importiert (um diese nicht einzeln in jeder Verwendung importieren zu müssen).
- Alle "Seiten-Module" befinden sich unter `modules/<seiten-name>`. "Home" für die "Default-Startseite". 
- Alle Module (auch `shared` und `core`) enthalten im Basis-Verzeichnis jeweils nur die Standard-Elemente (am Beispiel des `HomeModules`):
  - `home.module.ts`
  - `home-routing.module.ts`
  - `home.component.*`
  - plus `.spec`-Dateien
  - Alle anderen Elemente sind jeweils in einem Unterordner je Art (also `components`,`pipes`, `guards`,...)

TODO: Der Nav-Bar sollte in `shared` ausgelagert werden.

## CLI Cheat Sheet

Neues "Seiten-Module" anlegen.
```
ng g m modules/home -m app --route home --routing
```

**TODO: Change everthing below**

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
