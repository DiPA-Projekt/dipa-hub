# OpenAPI des DiPA

## Organisation

Das OpenAPI-Modul wird neu gebaut sobald auf den `develop`-Branch gemerged wird. Anschließend wird versucht das Modul in die GitHub-Registry zu publishen. (Hinweis: Es kann zu Versionskollissionen kommen, die wir irgnorieren können.)

## Verwendung

### GitHub Personal Access Tokens

Projekte die die versionierten Artefakt der DiPA-OpenAPI wiederverwenden möchten, müssen das mittels des **GitHub Personal Access Tokens** (https://github.com/settings/tokens) tun.

Für die **GitHub-Workflows** wurden die beiden _Secrets_ **GitHub Personal Access Tokens** und **Benutzername** in den **Organisationseinstellungen** (https://github.com/organizations/DiPA-Projekt/settings/secrets/actions) hinterlegt. Die **GitHub-Workflows** in unsere GitHub-Organisation können diesen über den Secret-Namen `GIT_HUB_PACKAGES_TOKEN` und  `GIT_HUB_PACKAGES_USER` zum Installieren von Abhängigkeiten aus unseren Organisationsrepository verwenden.

### Scopes einstellen

- Maven: https://docs.github.com/en/packages/guides/configuring-apache-maven-for-use-with-github-packages
- NPM: https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages

## Referenzen

- https://github.community/t/how-to-allow-unauthorised-read-access-to-github-packages-maven-repository/115517

