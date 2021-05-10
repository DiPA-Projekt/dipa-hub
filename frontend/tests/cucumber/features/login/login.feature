#encoding: utf-8

Feature: Login Tests

  Background: DiPA Aufruf
    Given Ich starte die App

  Scenario: erfolgreicher Login
    When Ich melde mich als "MEYER" an
    Then sollte die Startseite zu sehen sein

  Scenario: fehlschlagender Login
    When Ich melde mich als "MEYER" mit "falschesPasswort" an
    Then sollte ich den Text "Invalid username or password." sehen

  Scenario: Login ohne Credentials
    When ich klicke auf den Button "Sign in"
    Then sollte ich den Text "Invalid username or password." sehen

