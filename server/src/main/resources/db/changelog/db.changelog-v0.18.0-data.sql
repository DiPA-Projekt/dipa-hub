--liquibase formatted sql

--changeset id:update-project-flow-step-remove-[PL]-from-name context:weit
UPDATE project_flow_step
SET name=REPLACE(name, '[PL] ', '')


--changeset id:update-external_link-elbe-rename context:weit
UPDATE external_link
SET name = 'Bestellungen'
WHERE id=10 AND name = 'Elbe'

--changeset id:update-external_link-rahmenvertraege-itzbund-rename context:weit
UPDATE external_link
SET name = 'Laufende Rahmenverträge'
WHERE id=21 AND name = 'Rahmenverträge des ITZBund'

--changeset id:update-external_link-kaufhaus-des-bundes-rename context:weit
UPDATE external_link
SET name = 'Informationen zu Rahmenverträgen'
WHERE id=22 AND name = 'Kaufhaus des Bundes'

--changeset id:update-project-flow-step-action-beauftragung-share-point-rename context:weit
UPDATE project_flow_step_action
SET explanation = 'Zur Beauftragung eines Projekt-Arbeitsbereichs.'
WHERE id=5 AND explanation = 'Zur Beauftragung einer Projekt-Share-Point-Seite.'

--changeset id:update-external_link-isar-rename context:weit
UPDATE external_link
SET name = 'Ressourcen-Verwaltung', description = 'Personal und Budget verwalten'
WHERE id=11 AND name = 'iSAR'

--changeset id:update-project-flow-step-action-kommunikation-ohne-sina-rename context:weit
UPDATE project_flow_step_action
SET explanation = 'Zur Kommunikation mit Teammitgliedern.'
WHERE id=8 AND explanation = 'Zur Kommunikation mit Teammitgliedern ohne SINA.'

--changeset id:update-external_link-kommunikation-ohne-sina-rename context:weit
UPDATE external_link
SET name = 'Videokonferenz-Tool'
WHERE id=19 AND name = 'WebEx'

--changeset id:insert-external_link-collaboration-tool context:weit
INSERT INTO external_link (id, name, description, url, img, category, sort_order)
VALUES (26, 'Kollaborations-Tool', '', '', null, null, 26)

--changeset id:insert-project-flow-step-action-link-collaboration-tool context:weit
INSERT INTO project_flow_step_action_link (project_flow_step_action_id, external_link_id)
VALUES (8, 26)

--changeset id:update-project-flow-step-auftraggeber-managen-rename context:weit
UPDATE project_flow_step
SET name = 'Kunden managen'
WHERE id=5 AND name = 'Auftraggeber managen'

--changeset id:update-project-flow-step-action-kontaktdaten-anderer-behoerden-rename context:weit
UPDATE project_flow_step_action
SET explanation = 'Zur Suche nach Kontaktdaten von Kolleginnen und Kollegen anderer Organisationen.'
WHERE id=9 AND explanation = 'Zur Suche nach Kontaktdaten von Kolleginnen und Kollegen anderer Behörden.'

--changeset id:update-external_link-adressbuch-bundesverwaltung-rename context:weit
UPDATE external_link
SET name = 'CRM / Adressbuch externer Kontakte'
WHERE id=20 AND name = 'Adressbuch der Bundesverwaltung'

--changeset id:update-external_link-social-intranet-bund-rename context:weit
UPDATE external_link
SET name = 'Social Media'
WHERE id=16 AND name = 'Social Intranet des Bundes'

--changeset id:insert-external_link-social-media-channel-1 context:weit
INSERT INTO external_link (id, name, description, url, img, category, sort_order)
VALUES (27, 'Social Media Kanal 1', '', '', null, 'Weiteres', 27)

--changeset id:insert-project-flow-step-action-link-social-media-channel-1 context:weit
INSERT INTO project_flow_step_action_link (project_flow_step_action_id, external_link_id)
VALUES (10, 27)

--changeset id:update-project-flow-step-action-vertraege-externer--erstellung-leistungsnachweise-rename context:weit
UPDATE project_flow_step_action
SET explanation = 'Zur Verwaltung der Verträge Externer und zur Erstellung von Leistungsnachweisen.'
WHERE id=11 AND explanation = 'Zur Verwaltung der Verträge Externer und Erstellung von Leistungsnachweisen.'

--changeset id:update-external_link-aedl-rename context:weit
UPDATE external_link
SET name = 'Vertragsverwaltung'
WHERE id=12 AND name = 'AeDL'

--changeset id:update-external_link-itr4web-rename context:weit
UPDATE external_link
SET name = 'Ressourcen-Planung'
WHERE id=13 AND name = 'ITR4Web'

--changeset id:update-external_link-jira-rename context:weit
UPDATE external_link
SET name = 'Aufgaben-Verwaltung', description = 'Projektaufgaben verwalten', img = null
WHERE id=1 AND name = 'Jira'

--changeset id:update-external_link-vmxt-produktvorlagen-rename context:weit
UPDATE external_link
SET name = 'Dokumentvorlagen'
WHERE id=18 AND name = 'VMXT Produktvorlagen'

--changeset id:update-external_link-wiki-projektleitung-rename context:weit
UPDATE external_link
SET name = 'Projektleitungs-Infos'
WHERE id=3 AND name = 'Wiki Projektleitung (II A 1)'

--changeset id:update-external_link-it-planung-itr4web-rename context:weit
UPDATE external_link
SET name = 'Infos zu Planungsverfahren'
WHERE id=5 AND name = 'IT-Planungsverfahren und ITR4Web'

--changeset id:update-external_link-projekte-itzbund-rename context:weit
UPDATE external_link
SET name = 'Projekte in unserer Organisation'
WHERE id=14 AND name = 'Projekte im ITZBund'

--changeset id:delete-external-link-agile-swe-itzbund context:weit
DELETE FROM external_link
WHERE id=15 AND name = 'Agile SWE im ITZBund'

--changeset id:delete-external-link-ggb context:weit
DELETE FROM external_link
WHERE id=17 AND name = 'GGB'


--changeset id:update-project-task-form-field-join-contact-person-and-department context:weit
UPDATE project_task_form_field as a
SET label = 'Organisationseinheit',
    key = 'organizationalUnit',
    value = a.value || ' (' || b.value || ')'
FROM project_task_form_field as b
WHERE
    (
        a.project_task_id IS NOT NULL AND b.project_task_id = a.project_task_id OR
        a.result_id IS NOT NULL AND b.result_id = a.result_id
    ) AND a.key = 'department' AND b.key = 'taskArea'

--changeset id:delete-project-task-form-field-taskArea context:weit
DELETE FROM project_task_form_field
WHERE key = 'taskArea'

--changeset id:update-project-task-01-rename context:weit
UPDATE project_task
SET explanation = 'Übergabe des Projektes (u.a. Vertragsunterlagen, Zugriffe) von Auftragsplanung/PMO an die Projektleitung'
WHERE task_number = 1 AND explanation = 'Übergabe des Projektes (u.a. Planungsunterlagen, iSAR-Projekt mit vorausgefülltem PSB) von  Planenden, Einzelauftragsmanagement und PMO an die Projektleitung'

--changeset id:delete-project-task-02 context:weit
DELETE FROM project_task
WHERE task_number = 2

--changeset id:update-project-task-03-rename context:weit
UPDATE project_task
SET explanation = 'Personal-Ressourcen im ERP-System reservieren'
WHERE task_number = 3 AND explanation = 'Eingabe von weiteren Projektmitgliedern in iSAR, die auf das AKZ Zeiten zurückmelden sollen'

--changeset id:update-project-task-form-field-documentationLink-rename context:weit
UPDATE project_task_form_field
SET label = 'Link zum ERP-System'
WHERE key = 'documentationLink' AND label = 'Link zur iSAR'

--changeset id:update-project-task-form-field-colleague-rename context:weit
UPDATE project_task_form_field
SET key = 'teamMember', label = 'Teammitglied'
WHERE key = 'colleage' AND label = 'Teamkollege'

--changeset id:update-project-task-form-field-eAkte-rename context:weit
UPDATE project_task_form_field
SET value = 'Projekt-Arbeitsbereich'
WHERE value = 'eAkte'

--changeset id:delete-project-task-form-field_SharePoint context:weit
WITH sharepoints AS (
    SELECT DISTINCT result_id
    FROM project_task_form_field
    WHERE value = 'SharePoint'
)
DELETE FROM project_task_result
WHERE id IN (SELECT result_id from sharepoints)

--changeset id:update-non_permanent_project_task-07-rename context:weit
UPDATE non_permanent_project_task
SET title = 'Einkaufswagen für Bestellungen anlegen'
WHERE title = 'Einkaufswagen in ELBE anlegen'

--changeset id:update-non_permanent_project_task-08-rename context:weit
UPDATE non_permanent_project_task
SET title = 'Abrechnungstool für externe Aufwände einrichten'
WHERE title = 'AeDL einrichten'

--changeset id:update-project-task-08-explanation context:weit
UPDATE project_task
SET explanation = 'Einrichtung der Verträge und der Externen zu diesen Verträgen und Erstellung der monatlichen Leistungsnachweise im Abrechnungstool'
WHERE task_number = 8 AND explanation = 'Einrichtung der Verträge und der Externen zu diesen Verträgen und Erstellung der monatlichen Leistungsnachweise im Tool "AeDL"'

--changeset id:delete-all-project-task-09 context:weit
DELETE FROM project_task
WHERE task_number = 9 AND explanation = 'Tracking der monatlichen Aufwände und Zahlungen'

--changeset id:update-project-task-12-explanation context:weit
UPDATE project_task
SET explanation = 'Erstellung des Statusberichts für den vorangegangenen Berichtsmonat im PSB-Tool'
WHERE task_number = 12 AND explanation = 'Erstellung des Statusberichtes für den vorangegangenen Berichtsmonat in iSAR und Freigabe dessen durch den Projekteigner bis zum 10. Tag des Kalendermonats'


--changeset id:update_permanent-project-task-03-rename context:weit
UPDATE permanent_project_task
SET title = 'Besetzungen im ERP-Tool verwalten'
WHERE title = 'Besetzungen in iSAR verwalten'

--changeset id:update_permanent-project-task-07-rename context:weit
UPDATE permanent_project_task
SET title = 'Einkaufswagen für Bestellungen verwalten'
WHERE title = 'ELBE Einkaufswagen verwalten'


--changeset id:update_final-project-task-15-rename context:weit
UPDATE final_project_task
SET title = 'Projektabschlussbericht erstellen'
WHERE title = 'Erledigungsanzeige erstellen und versenden'

--changeset id:update_project-task-15-description context:weit
UPDATE project_task
SET explanation = ''
WHERE task_number = 15 AND explanation = 'sR bei Ressourcenmanagement und BfdH notwendig'
