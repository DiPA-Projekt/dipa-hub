#encoding: utf-8
# Reihenfolge der Szenarios:
# Start mit erfolgreichem Login verhindert Test von fehlgeschlagenen Login

Feature: Login Tests

  Background: DiPA Aufruf
    Given Ich starte die App

  Scenario: fehlschlagender Login
    When Ich melde mich als "MEYER" mit "falschesPasswort" an
    Then Wird der Login wegen falscher Credentials abgewiesen

  Scenario: Login ohne Credentials
    When Ich melde mich ohne Credentials an
    Then sollte ich den Text "Invalid username or password." sehen

  Scenario: erfolgreicher Login
    When Ich melde mich als "MEYER" an
    Then sollte die Startseite zu sehen sein

