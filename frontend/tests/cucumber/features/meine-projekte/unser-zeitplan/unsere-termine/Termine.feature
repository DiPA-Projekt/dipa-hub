#encoding: utf-8
Feature: Allgemeine Funktionalitäten des Zeitplans

  Scenario: Navigation zu 'Unsere Termine'
    Given Ich starte die App
    When Ich melde mich als "MEYER" an
    And Ich klicke auf den Text "Meine Projekte"
    And Ich klicke auf den Text "Testprojekt"
    And Ich navigiere zu "Unsere Termine"

  Scenario: Überprüfung der Elemente
    Then sollte die "Projekttyp" Selectbox "internes Projekt" beinhalten
    And sollte die "Vorhabensart" Selectbox "Softwareneuentwicklung" beinhalten
    And sollte die "Vorgehensweise" Selectbox "VMXT ITZBund agil" beinhalten
    And sollten 8 Meilensteine existieren
    When Ich auf den Meilenstein "Projekteinrichtung" klicke
    Then sollte ich den Text "Fällig am 24.4.2021" sehen
    And sollte ich den Text "PHB-Vorlage Internes Projekt (Agile SWE)" sehen
    And sollte ich den Text "ITZBund Risikoliste" sehen
    And sollte ich den Text "Trackingtabelle externe Dienstleistung" sehen
    And sollte ich den Text "QS-Handbuch" sehen
    When Ich schließe die Meilensteindetails
    Then sollte ich den Text "Fällig am 24.4.2021" nicht sehen

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


#Kann nur lokal funktionieren. Sollte dann in der CI angepasst werden
# Scenario: Export Kalender
#   And Ich klicke auf den Text "Export"
#   Then Ich warte 3 Sekunden
#   And sollte die Datei "Meilensteine.ics" unter dem Pfad "C:/Users/Tansu/Downloads" existieren
#And Ich lösche die Datei "Meilensteine.ics" unter dem Pfad "C:/Users/Tansu/Downloads"
