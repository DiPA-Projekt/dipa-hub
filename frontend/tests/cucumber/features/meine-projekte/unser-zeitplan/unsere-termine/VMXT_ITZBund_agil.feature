#encoding: utf-8
Feature: VMXT ITZBund agil

  Background: Navigation zu 'Unsere Termine'
    Given Ich starte die App
    When Ich melde mich als "MEYER" an
    And Ich klicke auf den Text "Meine Projekte"
    And Ich klicke auf den Text "Testprojekt"
    And Ich klicke auf den Text "Unser Zeitplan"
    And Ich klicke auf den Text "Unsere Termine"

  # Kann nur lokal funktionieren. Sollte dann in der CI angepasst werden
  Scenario: Export Kalender
    And Ich klicke auf den Text "Export"
    Then Ich warte 3 Sekunden
    # Muss
    And sollte die Datei "Meilensteine.ics" unter dem Pfad "C:/Users/Tansu/Downloads" existieren
