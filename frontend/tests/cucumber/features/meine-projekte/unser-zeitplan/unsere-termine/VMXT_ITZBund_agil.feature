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
    And sollte ich den Text "PHB-Vorlage Internes Projekt (Agile SWE)" sehen
    And sollte ich den Text "ITZBund Risikoliste" sehen
    And sollte ich den Text "Trackingtabelle externe Dienstleistung" sehen
    And sollte ich den Text "QS-Handbuch" sehen
    When Ich schließe die Meilensteindetails
    Then sollte ich den Text "Fällig am 24.4.2021" nicht sehen
