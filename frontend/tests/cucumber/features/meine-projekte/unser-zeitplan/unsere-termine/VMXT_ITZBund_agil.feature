#encoding: utf-8
Feature: VMXT ITZBund agil

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

#Kann nur lokal funktionieren. Sollte dann in der CI angepasst werden
# Scenario: Export Kalender
# And Ich klicke auf den Text "Export"
# Then Ich warte 3 Sekunden
# And sollte die Datei "Meilensteine.ics" unter dem Pfad "C:/Users/Tansu/Downloads" existieren
