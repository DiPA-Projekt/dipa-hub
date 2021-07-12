#encoding: utf-8
Feature: Allgemeine Funktionalitäten des Zeitplans

  Scenario: Navigation zu 'Unsere Termine'
    Given Ich starte die App
    When Ich melde mich als "MEYER" an
    And Ich klicke auf den Text "Meine Projekte"
    And Ich klicke auf den Text "Testprojekt"
    And Ich warte 2 Sekunden
    And Ich navigiere zu "Unsere Termine"

# TODO: Datentabelle?
  Scenario: Überprüfung der Elemente
    # Standardansicht
    Then sollte die Zeitachse "Apr" beinhalten
    And sollte die Zeitachse "Mai" beinhalten
    And sollte die Zeitachse "Jun" beinhalten
    And sollte die Zeitachse "Jul" beinhalten
    And sollte die Zeitachse "Aug" beinhalten
    And sollte die Zeitachse "Sep" beinhalten
    And sollte die Zeitachse "Okt" beinhalten
    And sollte die Zeitachse "Nov" beinhalten
    And sollte die Zeitachse "Dez" beinhalten
    And sollte die Zeitachse "2022" beinhalten

    When Ich klicke auf den Button "Jahre"
    Then sollte die Zeitachse "2022" beinhalten

    When Ich klicke auf den Button "Monate"
    Then sollte die Zeitachse "April" beinhalten
    And sollte die Zeitachse "Mai" beinhalten
    And sollte die Zeitachse "Juni" beinhalten
    And sollte die Zeitachse "Juli" beinhalten
    And sollte die Zeitachse "August" beinhalten
    And sollte die Zeitachse "September" beinhalten
    And sollte die Zeitachse "Oktober" beinhalten
    And sollte die Zeitachse "November" beinhalten
    And sollte die Zeitachse "Dezember" beinhalten
    And sollte die Zeitachse "Jan 22" beinhalten

    When Ich klicke auf den Button "Wochen"
    Then sollte die Zeitachse "KW 09" beinhalten
    And sollte die Zeitachse "KW 13" beinhalten
    And sollte die Zeitachse "KW 17" beinhalten
    And sollte die Zeitachse "KW 22" beinhalten
    And sollte die Zeitachse "KW 26" beinhalten
    And sollte die Zeitachse "KW 30" beinhalten
    And sollte die Zeitachse "KW 35" beinhalten
    And sollte die Zeitachse "KW 39" beinhalten
    And sollte die Zeitachse "KW 44" beinhalten
    And sollte die Zeitachse "KW 48" beinhalten
    And sollte die Zeitachse "KW 52" beinhalten

    When Ich klicke auf den Button "Tage"
    Then sollte die Zeitachse "01. Mär" beinhalten
    And sollte die Zeitachse "01. Mai" beinhalten
    And sollte die Zeitachse "01. Jun" beinhalten
    And sollte die Zeitachse "01. Jul" beinhalten
    And sollte die Zeitachse "01. Aug" beinhalten
    And sollte die Zeitachse "01. Sep" beinhalten
    And sollte die Zeitachse "01. Okt" beinhalten
    And sollte die Zeitachse "01. Nov" beinhalten
    And sollte die Zeitachse "01. Dez" beinhalten
    And sollte die Zeitachse "01.01.22" beinhalten

  Scenario: Meilenstein hinzufügen
    When Ich klicke auf den Text "Meilenstein hinzufügen"
    Then sollte ich den Text "Meilenstein anlegen" sehen

    When Ich fülle den Namen "Test Meilenstein" für den Meilenstein aus
    And Ich wähle den heutigen Tag im Kalender aus
    And Ich klicke auf den Text "Apply"
    And Ich klicke auf den Text "Anlegen"
    Then sollte der Meilenstein "Test Meilenstein" existieren
    And sollten 9 Meilensteine existieren

  Scenario: Meilenstein löschen
    When Ich auf den Meilenstein "Test Meilenstein" klicke
    And Ich klicke auf den Text "Löschen"
    Then sollte der Meilenstein "Test Meilenstein" nicht existieren
    And sollten 8 Meilensteine existieren

  # Noch nicht ganz implementiert
  # Scenario: Meilenstein verschieben
  #   When Ich auf den Meilenstein "Projekteinrichtung" klicke
  #   Then sollte ich den Text "Fällig am 24.4.2021" sehen

  #   When Ich verschiebe den Meilenstein "Projekteinrichtung" zum "29.4.2021"
  #   Then sollte ich den Text "Fällig am 24.4.2021" sehen

  #   When Ich verschiebe den Meilenstein "Projekteinrichtung" zum "29.4.2021"
  #   Then sollte ich den Text "Fällig am 24.4.2021" sehen
  #   And Ich melde mich ab

# Kann nur lokal funktionieren. Sollte dann in der CI angepasst werden
 Scenario: Export Kalender
   And Ich klicke auf den Text "Export"
   Then Ich warte 3 Sekunden
   And sollte die Datei "Meilensteine.ics" unter dem Pfad "C:/Users/Tansu/Downloads" existieren
   And Ich lösche die Datei "Meilensteine.ics" unter dem Pfad "C:/Users/Tansu/Downloads"
