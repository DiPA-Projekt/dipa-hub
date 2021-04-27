#encoding: utf-8
#language: de

Feature: Login Tests

        Scenario: erfolgreicher Login
            Given Ich starte die App
             When Ich gebe "" in "" ein
              And Ich gebe "" in "" ein
              And Ich klicke auf den Button "Sign In"
             Then sollte die Startseite zu sehen sein
