#encoding: utf-8

Feature: VMXT ITZBund inkrementell

  Background: DiPA Aufruf
    Given Ich starte die App
    When Ich melde mich als "MEYER" an
    And Ich klicke auf den Text "Meine Projekte"
    And Ich klicke auf den Text "Testprojekt"
    And Ich navigiere zu "Unsere Termine"
    And Ich warte 2 Sekunden

  Scenario: Navigation zu 'Unsere Termine'
    Given Ich starte die App
    When Ich melde mich als "MEYER" an
    And Ich klicke auf den Text "Meine Projekte"
    And Ich klicke auf den Text "Testprojekt"
    And Ich navigiere zu "Unsere Termine"

  Scenario: Änderung der Vorgehensart zu inkrementell
    Then sollte in der "Vorhabensart" Selectbox der Wert "VMXT ITZBund agil" ausgewählt sein

    # Selectbox Vorgehensweise zu inkrementell umändern
    Then sollte in der "Vorhabensart" Selectbox der Wert "VMXT ITZBund inkrementell" ausgewählt sein
    And sollten 10 Meilensteine existieren
    And sollte der Meilenstein "Projekteinrichtung" existieren
    And sollte der Meilenstein "Inkrement geplant" existieren
    And sollte der Meilenstein "System spezifiziert" existieren
    And sollte der Meilenstein "System entworfen" existieren
    And sollte der Meilenstein "Feinentwurf" existieren
    And sollte der Meilenstein "Systemelemente realisiert" existieren
    And sollte der Meilenstein "System integriert" existieren
    And sollte der Meilenstein "Lieferung durchgeführt" existieren
    And sollte der Meilenstein "Abnahme erfolgt" existieren
    And sollte der Meilenstein "Projektabschluss" existieren

  Scenario: Änderung der Vorgehensart zu agil
    # Selectbox Vorgehensweise zurück auf agil umändern
    When Ich klicke auf den Text "VMXT ITZBund inkrementell"
    And Ich klicke auf den Text "VMXT ITZBund agil"
    Then sollte in der "Vorhabensart" Selectbox der Wert "VMXT ITZBund agil" ausgewählt sein
    And sollten 8 Meilensteine existieren
    And sollte der Meilenstein "Projekteinrichtung" existieren
    And sollte der Meilenstein "Entwicklung Pre-Alpha" existieren
    And sollte der Meilenstein "Entwicklung Alpha" existieren
    And sollte der Meilenstein "Entwicklung Beta" existieren
    And sollte der Meilenstein "Entwicklung Release Candidate" existieren
    And sollte der Meilenstein "Entwicklung Release 1.0" existieren
    And sollte der Meilenstein "Release 1.0" existieren
    And sollte der Meilenstein "Projektabschluss" existieren
    And Ich melde mich ab
