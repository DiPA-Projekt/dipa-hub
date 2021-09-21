# DiPA Hub Server

## Datenbank / Schema-Änderungen

Das Datenbank-Schema wird mit über die Anwendung versioniert auf Basis
von [Liquibase](https://www.liquibase.org/get-started). Liquibase prüft anhand entsprechender Tracking-Tables in der
Datenbank welchen Stand die Datenbank bzw. das Schema hat und führt beim Start der Anwendung notwendige Migrationen
automatisch durch.

Dafür sind unter `src/main/resources/db/changelog` entsprechende Migrationsskripte zu hinterlegen (gegliedert
nach `minor` Version). Neue Migrations-Dateien müssen in der `db.changelog-master.yaml` hinterlegt werden. Liquibase
unterstützt sowohl Migrationsskripten in seiner eigenen Migrationssprache (Datenbanktyp unabhängig), als auch in nativem
SQL.

### Migrationen von Mandanten Datenbank

Die Liquibase Migrationen werden automatisch für alle Mandanten-Datenbanken durchgeführt. Dabei wird jeweils der Mandant
als Liquibase [Context](https://docs.liquibase.com/concepts/contexts.html) gesetzt. Es können also Migrationsskripten
wie folgt spezifisch für einen oder mehrere Mandanten ausgeführt werden:

```yaml
- changeSet:
  id: insert-milestones-softwareneuentwicklung
  author: becker
  context:weit
  changes:
    ...
```  

## Multi Tenancy (Mandantenfähigkeit)

Der Server ist mandantenfähig. Die grundsätzlich Funktionsweise ist
in [diesem Artikel](https://tech.asimio.net/2017/01/17/Multitenant-applications-using-Spring-Boot-JPA-Hibernate-and-Postgres.html)
recht gut erläutert. Die Umsetzung in DiPA ist ähnlich (nicht identisch). Alle notwendigen Klassen finden sich im
Package: `online.dipa.hub.tenancy`.

Die Mandanten sind in der `application.yml` definiert. Jeder Mandant hat seine eigene Datenbank. Der erste in der
Konfiguration hinterlegte Mandant ist der "Default" Mandant. Wird für Request kein Mandant ermittelt, oder ist der
Mandant nicht konfiguriert wir der Default Mandant verwendet.

Der Mandant wird aus der "niedrigsten" Subdomain des Requests ermittelt. Also z.B.

```
<tenantid>.develop.dipa.online
itzbund.develop.dipa.online
ba.develop.dipa.online
```

Um in der lokalen Entwicklungsumgebung mandantenfähig arbeiten zu können, müssen also lokal entsprechende DNS Einträge
existieren. Unter Windows kann man diese in der `C:\Windows\System32\drivers\etc\hosts` konfigurieren. z.B. mit
folgendem Ausschnitt:

```
127.0.0.1 ba.dipa.local
127.0.0.1 itzbund.dipa.local
127.0.0.1 test.dipa.local
```

## Build / Continous Deployment

Derzeit werden drei Deployments für die unterschiedlichen "tracks" erstellt:

- **production**: Production wird von der CI aus dem `main` Branch für jedes Release erstellt.
- **develop**: Develop wird von der CI für jeden Commit in den `develop` Branch erstellt.
- **manual**: Manual kann lokal von Hand erstellt werden.

Diese können Zeitgleich im Cluster der VM bereitgestellt werden und sind parallel verfügbar.

### Spring Boot Jar

Für die Anwendung wird mit Hilfe des `maven-springboot-plugins` ein ausführbares Uber-Jar gebaut.

### Docker Image

Versionierung / Tagging der Docker Images. Images für den "production"-Track werden mit der Maven Release Version
getagged (z.B. `1.2.3`). Images für den "develop"-Track werden mit Maven Versions-Nummer (ohne Snapshot) + qualifier "
develop" + Commit-SHA-7 getagged (z.B. `1.2.3-develop_ffa4733`). Dies ist notwendig, damit neue Develop-Versionen von
K8S-Cluster auch erkannt werden.

Der Bau des Docker Images ist mit der Hilfe des `dockerfile-maven-plugin` in den Build-Prozess integriert. Per Default
ist der Docker Build nur bei CI Builds in aktiviert. Soll dieser auch für lokale Builds aktiviert werden, muss man
entweder die Environment Variable `CI=true`definieren oder das Profil explizit aktivieren:

```bash
mvn -P github ...
``` 

Bauen und gleichzeitiges Pushen in die Registry geht wie folgt:

```
mvn -P github clean install dockerfile:push
```

Hier für müssen allerdings in der Maven Settings XML passende Credentials angelegt werden. Wie dies möglich ist, ist in
der Betriebsdoku der VM beschrieben.

```xml

<server>
    <id>docker.dipa.online</id>
    <username>
        <your-user-name>
    </username>
    <password>your-password</password>
</server>
```

Die github workflows sind so konfiguriert, dass die gebauten images direkt in die Docker Registry der VM gepushed
werden. siehe `/.github/workflows`

### K8S Deployments

Die K8S Depoyment Descriptoren liegen unter `src/main/k8s`. Diese enthalten Property Placeholder für Optionen in denen
sich die Deployments unterscheiden und werden während des Builds mit Hilfe des Maven Resource Filterings mit den
richtigen Werten belegt. Diese finden sich unter `target\deployment\k8s`.

Das Kopieren und Updaten der Deployments erfolgt per ssh über entsprechende GitHub Actions.

### Config

Konfigurationseigenschaften die Profil-abhängig definiert werden sind in entsprechende Property-Dateien
unter `/config/config-<profile>.properties` ausgelagert und werden vom entsprechenden Profile importiert.

### K8S Cheat Sheet

Lokales Kubernetes Cluster in "Docker for Windows"

#### Dashboard installieren

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.2.0/aio/deploy/recommended.yaml
```

Authentifizerung umgehen durch Bearbeitung der Konfiguration

```shell
kubectl edit deployment kubernetes-dashboard -n kubernetes-dashboard
```

Dann folgende Args ergänzen:

```yaml
--enable-skip-login
--disable-settings-authorizer
```

Proxy starten

```shell
kubectl proxy
```

Lokales Dashboard über Proxy aufrufen:

http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/overview?namespace=default

#### Pod in endless loop laufen lassen

Das ist nützlich wenn man sich mit einem Pod verbinden will der nicht hochkommt weil er beim start schon abstürzt. Bspw.
korrupte _postgres_ Datenbank. Dann kann ins volume und die Datenbank löschen.

```yaml
command: [ "/bin/sh" ]
args: [ "-c", "while true; do echo hello; sleep 10;done" ]
```

### Postgres Cheat Sheet

Table Autoincrement Id Sequences zurücksetzen:

```sql
ALTER SEQUENCE tablename_colname_seq RESTART WITH 42;

SELECT setval('tablename_colname_seq', (SELECT max(colname) FROM tablename));
```
