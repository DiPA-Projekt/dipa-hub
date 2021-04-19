--liquibase formatted sql

--changeset id:delete_project_id_project_task_template context:itzbund
UPDATE project_task_template
SET project_id = null
WHERE id = 1

--changeset id:delete_project_task_project_task_template_2 context:itzbund
DELETE FROM project_task
WHERE project_task_template_id = 2

--changeset id:delete_project_task_template_2 context:itzbund
DELETE FROM project_task_template
WHERE id = 2

--changeset id:delete_all_old_project_tasks context:itzbund
DELETE FROM project_task
WHERE project_task_template_id = 1

--changeset id:insert-project-task-01 context:itzbund
INSERT INTO project_task (id, title, optional, explanation, sort_order, project_task_template_id)
VALUES (1, 'Übergabe Auftragsplanung --> Projektleitung', false, 'Übergabe des Projektes (u.a. Planungsunterlagen, iSAR-Projekt mit vorausgefülltem PSB) von  Planenden, Einzelauftragsmanagement und PMO an die Projektleitung', 1, 1)

--changeset id:insert-project-task-02 context:itzbund
INSERT INTO project_task (id, title, optional, sort_order, project_task_template_id)
VALUES (2, 'Ansprechpartner der Referate ermitteln, die den Auftragsgegenstand umsetzen', false, 2, 1)

--changeset id:insert-project-task-03 context:itzbund
INSERT INTO project_task (id, title, optional, explanation, sort_order, project_task_template_id)
VALUES (3, 'Team zusammenstellen', true, 'Eingabe von weiteren Projektmitgliedern in iSAR, die auf das AKZ Zeiten zurückmelden sollen', 3, 1)

--changeset id:insert-project-task-04 context:itzbund
INSERT INTO project_task (id, title, optional, explanation, sort_order, project_task_template_id)
VALUES (4, 'Erste Terminserien wie z.B. Jour Fixe vereinbaren', true, '', 4, 1)

--changeset id:insert-project-task-05 context:itzbund
INSERT INTO project_task (id, title, optional, explanation, sort_order, project_task_template_id)
VALUES (5, 'Erste Termine setzen und steuern', true, 'Strukturieren des Projektablaufes mit internen Terminen, Überprüfen der Termineinhaltung und Steuerung von Auswirkungen bei Terminüberschreitungen“', 5, 1)

--changeset id:insert-project-task-06 context:itzbund
INSERT INTO project_task (id, title, optional, explanation, sort_order, project_task_template_id)
VALUES (6, 'Dokumentationsort festlegen', false, 'Ablageorte projektrelevanter Dokumente', 6, 1)

--changeset id:insert-project-task-07 context:itzbund
INSERT INTO project_task (id, title, optional, explanation, sort_order, project_task_template_id)
VALUES (7, 'Einkaufswagen in ELBE anlegen', false, 'Bestellung von Software, Hardware und externen Projektteammitgliedern', 7, 1)

--changeset id:insert-project-task-08 context:itzbund
INSERT INTO project_task (id, title, optional, explanation, sort_order, project_task_template_id)
VALUES (8, 'AeDL einrichten', true, 'Einrichtung der Verträge und der externen Kolleg:innen zu diesen Verträgen im Tool “AeDL“', 8, 1)

--changeset id:insert-project-task-09 context:itzbund
INSERT INTO project_task (id, title, optional, explanation, sort_order, project_task_template_id)
VALUES (9, 'Trackingtabelle für externe Dienstleistung einrichten', true, 'Tracking der monatlichen Aufwände und Zahlungen', 9, 1)

--changeset id:insert-project-task-10 context:itzbund
INSERT INTO project_task (id, title, optional, explanation, sort_order, project_task_template_id)
VALUES (10, 'Arbeitsmittel für externe Teamkolleg:innen bestellen und einrichten', true, 'Bestellung von notwendigen Arbeitsmitteln (z.B. Servista, Verpflichtung etc.) beim Einsatz externer Teamkolleg:innen', 10, 1)

--changeset id:insert-project-task-11 context:itzbund
INSERT INTO project_task (id, title, optional, explanation, sort_order, project_task_template_id)
VALUES (11, 'Ersten Projektstatusbericht schreiben', true, 'Erstellung des ersten Statusberichtes für den vorangegangenen Berichtsmonat in iSAR und Freigabe dessen durch den Projekteigner bis zum 10. Tag des Kalendermonats', 11, 1)

--changeset id:insert-project-task-12 context:itzbund
INSERT INTO project_task (id, title, optional, explanation, sort_order, project_task_template_id)
VALUES (12, 'Erste Risiken aufnehmen', true, 'Risikosteuerung durch diese Risikoliste, Bildung von Abstellmaßnahmen', 12, 1)

--changeset id:insert-project-task-13 context:itzbund
INSERT INTO project_task (id, title, optional, sort_order, project_task_template_id)
VALUES (13, 'Eskalationen durchführen', true, 13, 1)

--changeset id:insert-project-task-14 context:itzbund
INSERT INTO project_task (id, title, optional, explanation, sort_order, project_task_template_id)
VALUES (14, 'Auftragsänderung (Change Request) erstellen', false, 'sR bei Ressourcenmanagement und BfdH notwendig', 14, 1)

--changeset id:insert-project-task-15 context:itzbund
INSERT INTO project_task (id, title, optional, explanation, sort_order, project_task_template_id)
VALUES (15, 'Erledigungsanzeige erstellen und versenden', false, 'sR bei Ressourcenmanagement und BfdH notwendig', 15, 1)

--changeset id:insert-project-task-01-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (1, 'documentationLink', 'Link', 'Link zur Angebotsplanungsunterlage', false, 1, 'TEXTBOX', 'URL', true, 1)

--changeset id:insert-project-task-01-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (115, 'contactPerson', 'Name', 'Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', false, 1)

--changeset id:insert-project-task-01-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (116, 'department', 'Referat', false, 3, 'TEXTBOX', 'TEXT', false, 1)

--changeset id:insert-project-task-01-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (117, 'taskArea', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', false, 1)

--changeset id:insert-contact-person-project-task-01-result-01 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (1, 'TYPE_SUBTASK', 1)

--changeset id:insert-project-task-01-form-entry-subtask-result-01 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (2, 'Auftragsplanung an Projektleitung', 'subtask', 'Aufgabe', false, 1, 'TEXTBOX', 'TEXT', true, 1)

--changeset id:insert-project-task-01-form-entry-contactPerson-result-01 context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (3, 'contactPerson', 'Name', 'Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 1)

--changeset id:insert-project-task-01-form-entry-department-result-01 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (4, '4', 'department', 'Referat', false, 3, 'TEXTBOX', 'TEXT', true, 1)

--changeset id:insert-project-task-01-form-entry-taskArea-result-01 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (5, 'Servicemanagement Produkte und Lösungen', 'taskArea', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', true, 1)

--changeset id:insert-project-task-01-form-entry-note-result-01 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (6, 'note', 'Notizen', false, 5, 'TEXTAREA', true, 1)

--changeset id:insert-project-task-01-form-entry-status-result-01 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (112, 'status', 'Status', false, 6, 'DROPDOWN', true, 1)

--changeset id:insert-project-task-01-option-entry-person-OPEN-result-01 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('OPEN', 'offen', 112)

--changeset id:insert-project-task-01-option-entry-person-CONTACTED-result-01 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('CONTACTED', 'angesprochen', 112)

--changeset id:insert-project-task-01-option-entry-person-ANSWER_RECEIVED-result-01 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ANSWER_RECEIVED', 'Antwort erhalten', 112)

--changeset id:insert-project-task-01-option-entry-person-DONE-result-01 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('DONE', 'abgeschlossen', 112)

--changeset id:insert-contact-person-project-task-01-result-02 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (2, 'TYPE_SUBTASK', 1)

--changeset id:insert-project-task-01-form-entry-subtask-result-02 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (7, 'PMO/EAM an Projektleitung', 'subtask', 'Aufgabe', false, 1, 'TEXTBOX', 'TEXT', true, 2)

--changeset id:insert-project-task-01-form-entry-contactPerson-result-02 context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (8, 'contactPerson', 'Name', 'Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 2)

--changeset id:insert-project-task-01-form-entry-department-result-02 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (9, 'II A 1', 'department', 'Referat', false, 3, 'TEXTBOX', 'TEXT', true, 2)

--changeset id:insert-project-task-01-form-entry-taskArea-result-02 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (10, 'Projekt- und referatsübergreifende Koordinierung, Projektunterstützung', 'taskArea', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', true, 2)

--changeset id:insert-project-task-01-form-entry-note-result-02 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (11, 'note', 'Notizen', false, 5, 'TEXTAREA', true, 2)

--changeset id:insert-project-task-01-form-entry-status-result-02 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (113, 'status', 'Status', false, 6, 'DROPDOWN', true, 2)

--changeset id:insert-project-task-01-option-entry-person-OPEN-result-02 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('OPEN', 'offen', 113)

--changeset id:insert-project-task-01-option-entry-person-CONTACTED-result-02 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('CONTACTED', 'angesprochen', 113)

--changeset id:insert-project-task-01-option-entry-person-ANSWER_RECEIVED-result-02 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ANSWER_RECEIVED', 'Antwort erhalten', 113)

--changeset id:insert-project-task-01-option-entry-person-DONE-result-02 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('DONE', 'abgeschlossen', 113)

--changeset id:insert-contact-person-project-task-02-result-03 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (3, 'TYPE_CONTACT_PERS', 2)

--changeset id:insert-project-task-02-form-entry-contactPerson-result-03 context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (12, 'contactPerson', 'Name', 'Ansprechpartner', false, 1, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-project-task-02-form-entry-department-result-03 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (13, 'department', 'Referat', false, 2, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-project-task-02-form-entry-taskArea-result-03 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (14, 'taskArea', 'Aufgabenbereich', false, 3, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-project-task-02-form-entry-note-result-03 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (15, 'note', 'Notizen', false, 4, 'TEXTAREA', true, 3)

--changeset id:insert-project-task-02-form-entry-status-result-03 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (16, 'status', 'Status', false, 5, 'DROPDOWN', true, 3)

--changeset id:insert-project-task-02-option-entry-person-OPEN-result-03 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('OPEN', 'offen', 16)

--changeset id:insert-project-task-02-option-entry-person-CONTACTED-result-03 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('CONTACTED', 'angesprochen', 16)

--changeset id:insert-project-task-02-option-entry-person-ANSWER_RECEIVED-result-03 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ANSWER_RECEIVED', 'Antwort erhalten', 16)

--changeset id:insert-project-task-02-option-entry-person-DONE-result-03 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('DONE', 'abgeschlossen', 16)

--changeset id:insert-project-task-03-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (17, 'https://applpzport.zivit.iv.bfinv.de:52801/irj/portal', 'documentationLink', 'Link', 'Link zu iSAR', false, 1, 'TEXTBOX', 'URL', true, 3)

--changeset id:insert-project-task-03-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (18, 'contactPerson', 'Name', 'Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-project-task-03-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (19, 'department', 'Referat', false, 3, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-project-task-03-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (20, 'taskArea', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-contact-person-project-task-03-result-04 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (4, 'TYPE_TEAM_PERS', 3)

--changeset id:insert-project-task-03-form-entry-contactPerson-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (21, 'colleage', 'Name', 'Teamkollege', false, 1, 'TEXTBOX', 'TEXT', true, 4)

--changeset id:insert-project-task-03-form-entry-department-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (22, 'department', 'Referat', false, 2, 'TEXTBOX', 'TEXT', true, 4)

--changeset id:insert-project-task-03-form-entry-taskArea-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (23, 'taskArea', 'Aufgabenbereich', false, 3, 'TEXTBOX', 'TEXT', true, 4)

--changeset id:insert-project-task-03-form-entry-PT-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (24, 'PT', 'PT', 'Personentage', false, 4, 'TEXTBOX', 'NUMBER', true, 4)

--changeset id:insert-project-task-03-form-entry-note-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (25, 'note', 'Notizen', false, 5, 'TEXTAREA', true, 4)

--changeset id:insert-project-task-03-form-entry-status-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (26, 'status', 'Status', false, 6, 'DROPDOWN', true, 4)

--changeset id:insert-project-task-03-option-entry-person-planned-result-04 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 26)

--changeset id:insert-project-task-03-option-entry-person-booked-result-04 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('BOOKED', 'besetzt', 26)

--changeset id:insert-project-task-04-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (27, 'https://applpzport.zivit.iv.bfinv.de:52801/irj/portal', 'documentationLink', 'Link', 'Link zu iSAR', false, 1, 'TEXTBOX', 'URL', false, 4)

--changeset id:insert-project-task-04-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (28, 'contactPerson', 'Name', 'Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', false, 4)

--changeset id:insert-project-task-04-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (29, 'department', 'Referat', false, 3, 'TEXTBOX', 'TEXT', false, 4)

--changeset id:insert-project-task-04-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (30, 'taskArea', 'Aufgabenbereich',  false, 4, 'TEXTBOX', 'TEXT', false, 4)

--changeset id:insert-contact-person-project-task-04-result-05 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (5, 'TYPE_APPT_SERIES', 4)

--changeset id:insert-project-task-04-form-entry-serie-jf-result-05 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (31, 'Jour Fixe', 'serie', 'Name', 'Name der Serie', false, 1, 'TEXTBOX', 'TEXT', true, 5)

--changeset id:insert-project-task-04-form-entry-date-result-05 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (32, 'date', 'Termin', false, 2, 'TEXTBOX', 'TEXT', true, 5)

--changeset id:insert-project-task-04-form-entry-participants-result-05 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (33, 'participants', 'Teilnehmende', false, 3, 'TEXTAREA', true, 5)

--changeset id:insert-project-task-04-form-entry-link-result-05 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (34, 'link', 'Einwahllink', false, 4, 'TEXTBOX', 'URL', true, 5)

--changeset id:insert-project-task-04-form-entry-note-result-05 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (35, 'note', 'Notizen', false, 5, 'TEXTAREA', true, 5)

--changeset id:insert-project-task-04-form-entry-status-result-05 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (36, 'status', 'Status', false, 6, 'DROPDOWN', true, 5)

--changeset id:insert-project-task-04-option-entry-person-planned-result-05 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 36)

--changeset id:insert-project-task-04-option-entry-person-INVITED-result-05 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('INVITED', 'eingeladen', 36)

--changeset id:insert-project-task-05-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (37, 'https://applpzport.zivit.iv.bfinv.de:52801/irj/portal', 'documentationLink', 'Link', 'Link zu iSAR', false, 1, 'TEXTBOX', 'URL', false, 5)

--changeset id:insert-project-task-05-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (38, 'contactPerson', 'Name', 'Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', false, 5)

--changeset id:insert-project-task-05-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (39, 'department', 'Referat', false, 3, 'TEXTBOX', 'TEXT', false, 5)

--changeset id:insert-project-task-05-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (40, 'taskArea', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', false, 5)

--changeset id:insert-contact-person-project-task-05-result-06 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (6, 'TYPE_SINGLE_APPOINTMENT', 5)

--changeset id:insert-project-task-05-form-entry-serie-jf-result-06 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (41, 'date', 'Datum', false, 1, 'TEXTBOX', 'DATE', true, 6)

--changeset id:insert-project-task-05-form-entry-date-result-06 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (42, 'goal', 'Zielzustand', false, 2, 'TEXTBOX', 'TEXT', true, 6)

--changeset id:insert-project-task-05-form-entry-participants-result-06 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (43, 'responsible_person', 'Verantwortung', false, 3, 'TEXTBOX', 'TEXT', true, 6)

--changeset id:insert-project-task-05-form-entry-note-result-06 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (44, 'note', 'Notizen', false, 5, 'TEXTAREA', true, 6)

--changeset id:insert-project-task-05-form-entry-status-result-06 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (45, 'status', 'Status', false, 6, 'DROPDOWN', true, 6)

--changeset id:insert-project-task-05-option-entry-person-planned-result-06 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 45)

--changeset id:insert-project-task-05-option-entry-person-INVITED-result-06 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('INVITED', 'eingeladen', 45)

--changeset id:insert-project-task-05-option-entry-person-DONE-result-06 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('DONE', 'durchgeführt', 45)

--changeset id:insert-contact-person-project-task-06-result-07 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (7, 'TYPE_LINK', 6)

--changeset id:insert-project-task-06-form-entry-name-link-result-07 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (46, 'eAkte', 'name', 'Name', false, 1, 'TEXTBOX', 'TEXT', true, 7)

--changeset id:insert-project-task-06-form-entry-link-result-07 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (47, 'documentationLink', 'Link',  false, 2, 'TEXTBOX', 'URL', true, 7)

--changeset id:insert-project-task-06-form-entry-note-result-07 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (48, 'note', 'Notizen', false, 4, 'TEXTAREA', true, 7)

--changeset id:insert-contact-person-project-task-06-result-08 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (8, 'TYPE_LINK', 6)

--changeset id:insert-project-task-06-form-entry-name-link-result-08 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (49, 'SharePoint', 'name', 'Name', false, 1, 'TEXTBOX', 'TEXT', true, 8)

--changeset id:insert-project-task-06-form-entry-link-result-08 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (50, 'documentationLink', 'Link', false, 2, 'TEXTBOX', 'URL', true, 8)

--changeset id:insert-project-task-06-form-entry-note-result-08 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (51, 'note', 'Notizen', false, 4, 'TEXTAREA', true, 8)

--changeset id:insert-project-task-07-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (52, 'https://applnosrmp.zivit.iv.bfinv.de:8001/SAP/BC/NWBC/SRM', 'documentationLink', 'Link', 'Link zum Bestellungstool', false, 1, 'TEXTBOX', 'URL', true, 7)

--changeset id:insert-project-task-07-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (53, 'contactPerson', 'Name', 'Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 7)

--changeset id:insert-project-task-07-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (54, 'department', 'Referat', false, 3, 'TEXTBOX', 'TEXT', true, 7)

--changeset id:insert-project-task-07-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (55, 'taskArea', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', true, 7)

--changeset id:insert-contact-person-project-task-07-result-08 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (9, 'TYPE_ELBE_SC', 7)

--changeset id:insert-project-task-07-form-entry-shopping_cart_number-result-09 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (56, 'shopping_cart_number', 'EKW - Nummer', false, 1, 'TEXTBOX', 'TEXT', true, 9)

--changeset id:insert-project-task-07-form-entry-shopping_cart_content-result-09 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (57, 'shopping_cart_content', 'EKW - Inhalt', false, 2, 'TEXTBOX', 'URL', true, 9)

--changeset id:insert-project-task-07-form-entry-note-result-09 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (58, 'note', 'Notizen', false, 3, 'TEXTAREA', true, 9)

--changeset id:insert-project-task-07-form-entry-status-result-09 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (59, 'status', 'Status', false, 4, 'DROPDOWN',  true, 9)

--changeset id:insert-project-task-07-option-entry-person-planned-result-08 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 59)

--changeset id:insert-project-task-07-option-entry-person-ORDERED-result-08 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ORDERED', 'bestellt', 59)

--changeset id:insert-project-task-07-option-entry-person-APPROVED-result-08 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('APPROVED', 'genehmigt', 59)

--changeset id:insert-project-task-07-option-entry-person-DELIVERED-result-08 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('DELIVERED', 'geliefert', 59)

--changeset id:insert-project-task-08-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (60, 'https://aedl.itz.itzbund.net/AeDL-Web/sites/login.xhtml', 'documentationLink', 'Link', 'Link zum Abrechnungstool', false, 1, 'TEXTBOX', 'URL', true, 8)

--changeset id:insert-project-task-08-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (61, 'contactPerson', 'Name', 'Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 8)

--changeset id:insert-project-task-08-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (62, 'department', 'Referat', false, 3, 'TEXTBOX', 'TEXT', true, 8)

--changeset id:insert-project-task-08-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (63, 'taskArea', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', true, 8)

--changeset id:insert-contact-person-project-task-08-result-10 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (10, 'TYPE_STD', 8)

--changeset id:insert-project-task-08-form-entry-note-result-10 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (64, 'note', 'Notizen', false, 1, 'TEXTAREA', true, 10)

--changeset id:insert-project-task-08-form-entry-status-result-10 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (65, 'status', 'Status', false, 2, 'DROPDOWN', true, 10)

--changeset id:insert-project-task-08-option-entry-person-OPEN-result-10 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('OPEN', 'offen', 65)

--changeset id:insert-project-task-08-option-entry-person-CLOSED-result-10 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('CLOSED', 'geschlossen', 65)

--changeset id:insert-project-task-08-option-entry-person-PLANNED-result-10 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 65)

--changeset id:insert-project-task-08-option-entry-person-ASSIGNED-result-10 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ASSIGNED', 'zugewiesen', 65)

--changeset id:insert-project-task-08-option-entry-person-IN_PROGRESS-result-10 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('IN_PROGRESS', 'in Bearbeitung', 65)

--changeset id:insert-project-task-08-option-entry-person-SUBMITTED-result-10 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('SUBMITTED', 'vorgelegt', 65)

--changeset id:insert-project-task-08-option-entry-person-DONE-result-10 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('DONE', 'fertiggestellt', 65)

--changeset id:insert-project-task-09-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (66, 'documentationLink', 'Link', 'Link zur Trackingtabelle', true, 1, 'TEXTBOX', 'URL', true, 9)

--changeset id:insert-project-task-09-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (67, 'contactPerson', 'Name', 'Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', false, 9)

--changeset id:insert-project-task-09-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (68, 'department', 'Referat', false, 3, 'TEXTBOX', 'TEXT', false, 9)

--changeset id:insert-project-task-09-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (69, 'taskArea', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', false, 9)

--changeset id:insert-contact-person-project-task-09-result-11 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (11, 'TYPE_STD', 9)

--changeset id:insert-project-task-09-form-entry-note-result-11 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (70, 'note', 'Notizen', false, 1, 'TEXTAREA', true, 11)

--changeset id:insert-project-task-09-form-entry-status-result-11 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (71, 'status', 'Status', false, 2, 'DROPDOWN', true, 11)

--changeset id:insert-project-task-09-option-entry-person-OPEN-result-11 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('OPEN', 'offen', 71)

--changeset id:insert-project-task-09-option-entry-person-CLOSED-result-11 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('CLOSED', 'geschlossen', 71)

--changeset id:insert-project-task-09-option-entry-person-PLANNED-result-11 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 71)

--changeset id:insert-project-task-09-option-entry-person-ASSIGNED-result-11 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ASSIGNED', 'zugewiesen', 71)

--changeset id:insert-project-task-09-option-entry-person-IN_PROGRESS-result-11 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('IN_PROGRESS', 'in Bearbeitung', 71)

--changeset id:insert-project-task-09-option-entry-person-SUBMITTED-result-11 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('SUBMITTED', 'vorgelegt', 71)

--changeset id:insert-project-task-09-option-entry-person-DONE-result-11 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('DONE', 'fertiggestellt', 71)

--changeset id:insert-project-task-10-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (72, 'https://portal-zb.itsm-suite.service.itzbund.net/dwp/app', 'documentationLink', 'Link', 'Link zum Service Center', true, 1, 'TEXTBOX', 'URL', true, 10)

--changeset id:insert-project-task-10-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (73, 'contactPerson', 'Name', 'Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', false, 10)

--changeset id:insert-project-task-10-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (74, 'department', 'Referat', false, 3, 'TEXTBOX', 'TEXT', false, 10)

--changeset id:insert-project-task-10-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (75, 'taskArea', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', false, 10)

--changeset id:insert-contact-person-project-task-10-result-12 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (12, 'TYPE_STD', 10)

--changeset id:insert-project-task-10-form-entry-note-result-12 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (76, 'Accounts anlegen und anmelden (Servista)', 'note', 'Notizen', false, 1, 'TEXTAREA', true, 12)

--changeset id:insert-project-task-10-form-entry-status-result-12 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (77, 'status', 'Status', false, 2, 'DROPDOWN', true, 12)

--changeset id:insert-project-task-10-option-entry-person-OPEN-result-12 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('OPEN', 'offen', 77)

--changeset id:insert-project-task-10-option-entry-person-CLOSED-result-12 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('CLOSED', 'geschlossen', 77)

--changeset id:insert-project-task-10-option-entry-person-PLANNED-result-12 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 77)

--changeset id:insert-project-task-10-option-entry-person-ASSIGNED-result-12 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ASSIGNED', 'zugewiesen', 77)

--changeset id:insert-project-task-10-option-entry-person-IN_PROGRESS-result-12 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('IN_PROGRESS', 'in Bearbeitung', 77)

--changeset id:insert-project-task-10-option-entry-person-SUBMITTED-result-12 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('SUBMITTED', 'vorgelegt', 77)

--changeset id:insert-project-task-10-option-entry-person-DONE-result-12 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('DONE', 'fertiggestellt', 77)

--changeset id:insert-project-task-11-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (78, 'https://applpzport.zivit.iv.bfinv.de:52801/irj/portal', 'documentationLink', 'Link', 'Link zum PSB-Tool', true, 1, 'TEXTBOX', 'URL', true, 11)

--changeset id:insert-project-task-11-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (79, 'contactPerson', 'Name', 'Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', false, 11)

--changeset id:insert-project-task-11-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (80, 'department', 'Referat', false, 3, 'TEXTBOX', 'TEXT', false, 11)

--changeset id:insert-project-task-11-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (81, 'taskArea', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', false, 11)

--changeset id:insert-contact-person-project-task-11-result-13 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (13, 'TYPE_STD', 11)

--changeset id:insert-project-task-11-form-entry-note-result-13 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (82, 'note', 'Notizen', false, 1, 'TEXTAREA', true, 13)

--changeset id:insert-project-task-11-form-entry-status-result-13 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (83, 'status', 'Status', false, 2, 'DROPDOWN', true, 13)

--changeset id:insert-project-task-11-option-entry-person-OPEN-result-13 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('OPEN', 'offen', 83)

--changeset id:insert-project-task-11-option-entry-person-CLOSED-result-13 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('CLOSED', 'geschlossen', 83)

--changeset id:insert-project-task-11-option-entry-person-PLANNED-result-13 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 83)

--changeset id:insert-project-task-11-option-entry-person-ASSIGNED-result-13 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ASSIGNED', 'zugewiesen', 83)

--changeset id:insert-project-task-11-option-entry-person-IN_PROGRESS-result-13 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('IN_PROGRESS', 'in Bearbeitung', 83)

--changeset id:insert-project-task-11-option-entry-person-SUBMITTED-result-13 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('SUBMITTED', 'vorgelegt', 83)

--changeset id:insert-project-task-11-option-entry-person-DONE-result-13 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('DONE', 'fertiggestellt', 83)

--changeset id:insert-project-task-12-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (84, 'documentationLink', 'Link', false, 1, 'TEXTBOX', 'URL', true, 12)

--changeset id:insert-project-task-12-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (85, 'contactPerson', 'Name', 'Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', false, 12)

--changeset id:insert-project-task-12-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (86, 'department', 'Referat', false, 3, 'TEXTBOX', 'TEXT', false, 12)

--changeset id:insert-project-task-12-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (87, 'taskArea', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', false, 12)

--changeset id:insert-contact-person-project-task-12-result-13 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (14, 'TYPE_RISK', 12)

--changeset id:insert-project-task-12-form-entry-risk-description-result-14 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (88, 'description', 'Risikobezeichnung', false, 1, 'TEXTAREA', true, 14)

--changeset id:insert-project-task-12-form-entry-risk-value-result-14 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (89, 'value', 'Risikowert', false, 2, 'TEXTAREA', true, 14)

--changeset id:insert-project-task-12-form-entry-solution-result-14 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (90, 'solution', 'Abstellmaßnahme', false, 3, 'TEXTAREA', true, 14)

--changeset id:insert-project-task-12-form-entry-note-result-14 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (91, 'note', 'Notizen', false, 4, 'TEXTAREA', true, 14)

--changeset id:insert-project-task-12-form-entry-status-result-14 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (92, 'status', 'Status', false, 5, 'DROPDOWN', true, 14)

--changeset id:insert-project-task-12-option-entry-person-ACTIVE-result-14 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ACTIVE', 'aktiv', 92)

--changeset id:insert-project-task-12-option-entry-person-OCCURRED-result-14 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('OCCURRED', 'eingetreten', 92)

--changeset id:insert-project-task-12-option-entry-person-ELIMINATED-result-14 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ELIMINATED', 'beseitigt', 92)

--changeset id:insert-project-task-12-option-entry-person-INACTIVE-result-14 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('INACTIVE', 'inaktiv', 92)

--changeset id:insert-project-task-12-option-entry-person-RETURNED-result-14 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('RETURNED', 'zurückgestellt', 92)

--changeset id:insert-project-task-13-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (93, 'documentationLink', 'Link', false, 1, 'TEXTBOX', 'URL', true, 13)

--changeset id:insert-project-task-13-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (94, 'contactPerson', 'Name', 'Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 13)

--changeset id:insert-project-task-13-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (95, 'department', 'Referat', false, 3, 'TEXTBOX', 'TEXT', true, 13)

--changeset id:insert-project-task-13-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (96, 'taskArea', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', true, 13)

--changeset id:insert-contact-person-project-task-13-result-15 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (15, 'TYPE_STD', 13)

--changeset id:insert-project-task-13-form-entry-content-result-15 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (97, 'note', 'Notizen', false, 1, 'TEXTAREA', true, 15)

--changeset id:insert-project-task-13-form-entry-status-result-15 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (98, 'status', 'Status', false, 2, 'DROPDOWN', true, 15)

--changeset id:insert-project-task-13-option-entry-person-OPEN-result-15 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('OPEN', 'offen', 98)

--changeset id:insert-project-task-13-option-entry-person-CLOSED-result-15 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('CLOSED', 'geschlossen', 98)

--changeset id:insert-project-task-13-option-entry-person-PLANNED-result-15 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 98)

--changeset id:insert-project-task-13-option-entry-person-ASSIGNED-result-15 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ASSIGNED', 'zugewiesen', 98)

--changeset id:insert-project-task-13-option-entry-person-IN_PROGRESS-result-15 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('IN_PROGRESS', 'in Bearbeitung', 98)

--changeset id:insert-project-task-13-option-entry-person-SUBMITTED-result-15 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('SUBMITTED', 'vorgelegt', 98)

--changeset id:insert-project-task-13-option-entry-person-DONE-result-15 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('DONE', 'fertiggestellt', 98)

--changeset id:insert-project-task-14-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (99, 'documentationLink', 'Link', false, 1, 'TEXTBOX', 'URL', true, 14)

--changeset id:insert-project-task-14-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (100, 'contactPerson', 'Name', 'Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 14)

--changeset id:insert-project-task-14-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (101, 'department', 'Referat', false, 3, 'TEXTBOX', 'TEXT', true, 14)

--changeset id:insert-project-task-14-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (102, 'taskArea', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', true, 14)

--changeset id:insert-contact-person-project-task-14-result-16 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (16, 'TYPE_STD', 14)

--changeset id:insert-project-task-14-form-entry-content-result-16 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (103, 'note', 'Notizen', false, 1, 'TEXTAREA', true, 16)

--changeset id:insert-project-task-14-form-entry-status-result-16 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (104, 'status', 'Status', false, 2, 'DROPDOWN', true, 16)

--changeset id:insert-project-task-14-option-entry-person-OPEN-result-16 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('OPEN', 'offen', 104)

--changeset id:insert-project-task-14-option-entry-person-CLOSED-result-16 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('CLOSED', 'geschlossen', 104)

--changeset id:insert-project-task-14-option-entry-person-PLANNED-result-16 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 104)

--changeset id:insert-project-task-14-option-entry-person-ASSIGNED-result-16 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ASSIGNED', 'zugewiesen', 104)

--changeset id:insert-project-task-14-option-entry-person-IN_PROGRESS-result-16 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('IN_PROGRESS', 'in Bearbeitung', 104)

--changeset id:insert-project-task-14-option-entry-person-SUBMITTED-result-16 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('SUBMITTED', 'vorgelegt', 104)

--changeset id:insert-project-task-14-option-entry-person-DONE-result-16 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('DONE', 'fertiggestellt', 104)

--changeset id:insert-project-task-15-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (105, 'documentationLink', 'Link', false, 1, 'TEXTBOX', 'URL', true, 15)

--changeset id:insert-project-task-15-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, hint, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (106, 'contactPerson', 'Name', 'Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 15)

--changeset id:insert-project-task-15-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (107, 'department', 'Referat', false, 3, 'TEXTBOX', 'TEXT', true, 15)

--changeset id:insert-project-task-15-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (108, 'taskArea', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', true, 15)

--changeset id:insert-contact-person-project-task-15-result-17 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (17, 'TYPE_STD', 15)

--changeset id:insert-project-task-15-form-entry-content-result-17 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (109, 'note', 'Notizen', false, 1, 'TEXTAREA', true, 17)

--changeset id:insert-project-task-15-form-entry-status-result-17 context:itzbund
INSERT INTO project_task_form_field (id, key, label, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (110, 'status', 'Status', false, 2, 'DROPDOWN', true, 17)

--changeset id:insert-project-task-15-option-entry-person-OPEN-result-17 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('OPEN', 'offen', 110)

--changeset id:insert-project-task-15-option-entry-person-CLOSED-result-17 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('CLOSED', 'geschlossen', 110)

--changeset id:insert-project-task-15-option-entry-person-PLANNED-result-17 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 110)

--changeset id:insert-project-task-15-option-entry-person-ASSIGNED-result-17 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ASSIGNED', 'zugewiesen', 110)

--changeset id:insert-project-task-15-option-entry-person-IN_PROGRESS-result-17 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('IN_PROGRESS', 'in Bearbeitung', 110)

--changeset id:insert-project-task-15-option-entry-person-SUBMITTED-result-17 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('SUBMITTED', 'vorgelegt', 110)

--changeset id:insert-project-task-15-option-entry-person-DONE-result-17 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('DONE', 'fertiggestellt', 110)
--changeset id:template_Serveraustausch context:ba
INSERT INTO plan_template (id, name, project_id) VALUES (9, 'Serveraustausch Template', 1)

--changeset id:template_Cisco_Router_Nürnberg context:ba
INSERT INTO plan_template (id, name, project_id) VALUES (10, 'Cisco Router Nürnberg Template', 2)

--changeset id:template_Feldberg context:itzbund
INSERT INTO plan_template (id, name, project_id) VALUES (11, 'Feldberg Template', 3)

--changeset id:template_Zugspitze context:itzbund
INSERT INTO plan_template (id, name, project_id) VALUES (12, 'Zugspitze Template', 4)

--changeset id:template_Bergsteigerausrüstung context:itzbund
INSERT INTO plan_template (id, name, project_id) VALUES (13, 'Bergsteigerausrüstung Template', 5)

--changeset id:template_Oranienburg context:ba
INSERT INTO plan_template (id, name, project_id) VALUES (14, 'Routeraustasch Oranienburg Template', 6)

--changeset id:update_master_milestones context:itzbund
UPDATE milestone_template
SET is_master = true
WHERE plan_template_id = 2

--changeset id:milestones_template_Serveraustausch context:ba
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), 9 FROM milestone_template as m2 WHERE plan_template_id = 1

--changeset id:project_Serveraustausch_start_date_end_date context:ba
UPDATE project
SET start_date = NOW(),
    end_date = (
  SELECT NOW() + MAX(date_offset)
  FROM milestone_template WHERE plan_template_id = 9
)
WHERE ID = 1

--changeset id:milestones_template_Cisco_Router_Nürnberg context:ba
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), 10 FROM milestone_template WHERE plan_template_id = 5

--changeset id:project_Cisco_Router_Nürnberg_start_date_end_date context:ba
UPDATE project
SET start_date = NOW(),
    end_date = (
  SELECT NOW() + MAX(date_offset)
  FROM milestone_template WHERE plan_template_id = 10
)
WHERE ID = 2

--changeset id:milestones_template_Feldberg_master_milestones context:itzbund
INSERT INTO milestone_template (name, date_offset, date, is_master, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), true, 11 FROM milestone_template WHERE plan_template_id = 2

--changeset id:milestones_template_Feldberg context:itzbund
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), 11 FROM milestone_template WHERE plan_template_id = 3

--changeset id:project_Feldberg_start_date_end_date context:itzbund
UPDATE project
SET start_date = NOW(),
    end_date = (
  SELECT NOW() + MAX(date_offset)
  FROM milestone_template WHERE plan_template_id = 11
)
WHERE ID = 3

--changeset id:milestones_template_Agil_SWE_master_milestones context:itzbund
INSERT INTO milestone_template (name, date_offset, date, is_master, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), true, 3 FROM milestone_template WHERE plan_template_id = 2

--changeset id:milestones_template_Zugspitze_master_milestones context:itzbund
INSERT INTO milestone_template (name, date_offset, date, is_master, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), true, 12 FROM milestone_template WHERE plan_template_id = 2

--changeset id:milestones_template_Zugspitze context:itzbund
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), 12 FROM milestone_template WHERE plan_template_id = 4

--changeset id:project_Zugspitzeg_start_date_end_date context:itzbund
UPDATE project
SET start_date = NOW(),
    end_date = (
  SELECT NOW() + MAX(date_offset)
  FROM milestone_template WHERE plan_template_id = 12
)
WHERE ID = 4

--changeset id:milestones_template_inkrementell_SWE_master_milestones context:itzbund
INSERT INTO milestone_template (name, date_offset, date, is_master, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), true, 4 FROM milestone_template WHERE plan_template_id = 2

--changeset id:milestones_template_NonStandard_1_inkrementell_SWE_master_milestones context:itzbund
INSERT INTO milestone_template (name, date_offset, date, is_master, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), true, 7 FROM milestone_template WHERE plan_template_id = 2

--changeset id:milestones_template_NonStandard_2_inkrementell_SWE_master_milestones context:itzbund
INSERT INTO milestone_template (name, date_offset, date, is_master, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), true, 8 FROM milestone_template WHERE plan_template_id = 2

--changeset id:milestones_template_Bergsteigerausrüstung context:itzbund
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), 13 FROM milestone_template WHERE plan_template_id = 5

--changeset id:project_Bergsteigerausrüstung_start_date_end_date context:itzbund
UPDATE project
SET start_date = NOW(),
    end_date = (
  SELECT NOW() + MAX(date_offset)
  FROM milestone_template WHERE plan_template_id = 13
)
WHERE ID = 5

--changeset id:milestones_template_Oranienburg context:ba
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), 14 FROM milestone_template WHERE plan_template_id = 1

--changeset id:project_Oranienburg_start_date_end_date context:ba
UPDATE project
SET start_date = NOW(),
    end_date = (
  SELECT NOW() + MAX(date_offset)
  FROM milestone_template WHERE plan_template_id = 14
)
WHERE ID = 6

-- changeset id:delete_unused_milestones context:itzbund
DELETE FROM milestone_template WHERE plan_template_id = 2;

-- changeset id:delete_connection_operation_type_plan_template context:itzbund
DELETE FROM operation_type_plan_template_connection WHERE id = 1;

-- changeset id:delete_unused_plan_template context:itzbund
DELETE FROM plan_template WHERE id = 2;
