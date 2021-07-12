#encoding: utf-8
Feature: VMXT ITZBund agil

  Scenario: Navigation zu 'Unsere Termine'
    Given Ich starte die App
    When Ich melde mich als "MEYER" an
    And Ich klicke auf den Text "Meine Projekte"
    And Ich klicke auf den Text "Testprojekt"
    And Ich warte 2 Sekunden
    And Ich navigiere zu "Unsere Termine"
    And Ich warte 5 Sekunden

   Scenario: Überprüfung der Elemente
     Then sollte in der "Projekttyp" Selectbox der Wert "internes Projekt" ausgewählt sein
     And sollte in der "Vorhabensart" Selectbox der Wert "Softwareneuentwicklung" ausgewählt sein
     And sollte in der "Vorgehensweise" Selectbox der Wert "VMXT ITZBund agil" ausgewählt sein
     And sollten 8 Meilensteine existieren
     And sollte der Meilenstein "Projekteinrichtung" existieren
    # And sollte der Meilenstein "Entwicklung Pre-Alpha" existieren
    # And sollte der Meilenstein "Entwicklung Alpha" existieren
    # And sollte der Meilenstein "Entwicklung Beta" existieren
    # And sollte der Meilenstein "Entwicklung Release Candidate" existieren
    # And sollte der Meilenstein "Entwicklung Release 1.0" existieren
    # And sollte der Meilenstein "Release 1.0" existieren
    And sollte der Meilenstein "Projektabschluss" existieren

    When Ich auf den Meilenstein "Projekteinrichtung" klicke
    Then sollte ich den Text "Fällig am 24.4.2021" sehen
    And sollte ich den Text "PHB-Vorlage Internes Projekt (Agile SWE)" sehen
    And sollte ich den Text "ITZBund Risikoliste" sehen
    And sollte ich den Text "Trackingtabelle externe Dienstleistung" sehen
    And sollte ich den Text "QS-Handbuch" sehen
    When Ich schließe die Meilensteindetails
    Then sollte ich den Text "Fällig am 24.4.2021" nicht sehen

  Scenario: Abmeldung
    When Ich melde mich ab
