
Feature: Anzeige der Risikoabschaetzung

  Testet, ob bei BA-Projekten mit der Vorhabensart Servertausch die Risikoabschätzung angezeigt wird
  (DIPA-443)

  Background: DiPA Aufruf
    Given Ich starte die BA-Instanz
    And Ich melde mich als "MÜLLER" an
    Then sollte die Startseite zu sehen sein

  Scenario: Anzeige Risikoabschaetzung
    # When Ich lege ein neues Serveraustausch-Projekt an
    # And Ich öffne das neue Serveraustausch-Projekt
    When Ich öffne das Serveraustausch-Projekt
    Then Die Risikoabschätzung wird angezeigt
    # And Ich archiviere das Projekt
    And Ich melde mich ab
