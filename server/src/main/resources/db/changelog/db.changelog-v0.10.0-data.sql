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
VALUES (1, 'Übergabe Auftragsplanung --> Projektleitung', false, 'Übergabe der Projekte (u.a. Planungsunterlagen, iSAR-Projekt mit vorausgefülltem PSB) von  Planenden, Einzelauftragsmanagement und PMO an die Projektleitung', 1, 1)

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
VALUES (5, 'Erste Termine setzen und steuern', true, 'Strukturieren des Projektablaufes mit internen Terminen, Überprüfen der Termineinhaltung und Steuerung von Auswirkungen von Terminüberschreitungen“', 5, 1)

--changeset id:insert-project-task-06 context:itzbund
INSERT INTO project_task (id, title, optional, explanation, sort_order, project_task_template_id)
VALUES (6, 'Dokumentationsort festlegen', false, 'festlegen, wo projektrelevante Dokumente abgelegt werden', 6, 1)

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
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (1, 'documentationLink', 'Link', 'Link zur Angebotsplanungsunterlage', false, 1, 'TEXTBOX', 'URL', true, 1)

--changeset id:insert-contact-person-project-task-01-result-01 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (1, 'TYPE_CONTACT_PERS', 1)

--changeset id:insert-project-task-01-form-entry-subtask-result-01 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (2, 'Auftragsplanung an Projektleitung', 'subtask', 'Aufgabe', 'Aufgabe', false, 1, 'TEXTBOX', 'TEXT', true, 1)

--changeset id:insert-project-task-01-form-entry-contactPerson-result-01 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (3, 'contactPerson', 'Name Ansprechpartner', 'Name Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 1)

--changeset id:insert-project-task-01-form-entry-department-result-01 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (4, '4', 'department', 'Referat', 'Referat', false, 3, 'TEXTBOX', 'TEXT', true, 1)

--changeset id:insert-project-task-01-form-entry-taskArea-result-01 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (5, 'Servicemanagement Produkte und Lösungen', 'taskArea', 'Aufgabenbereich', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', true, 1)

--changeset id:insert-project-task-01-form-entry-note-result-01 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (6, 'note', 'Notizen', 'Notizen', false, 5, 'TEXTAREA', 'TEXT', true, 1)

--changeset id:insert-contact-person-project-task-01-result-02 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (2, 'TYPE_CONTACT_PERS', 1)

--changeset id:insert-project-task-01-form-entry-subtask-result-02 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (7, 'PMO/EAM an Projektleitung', 'subtask', 'Aufgabe', 'Aufgabe', false, 1, 'TEXTBOX', 'TEXT', true, 2)

--changeset id:insert-project-task-01-form-entry-contactPerson-result-02 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (8, 'contactPerson', 'Name Ansprechpartner', 'Name Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 2)

--changeset id:insert-project-task-01-form-entry-department-result-02 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (9, 'II A 1', 'department', 'Referat', 'Referat', false, 3, 'TEXTBOX', 'TEXT', true, 2)

--changeset id:insert-project-task-01-form-entry-taskArea-result-02 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (10, 'Projekt- und referatsübergreifende Koordinierung, Projektunterstützung', 'taskArea', 'Aufgabenbereich', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', true, 2)

--changeset id:insert-project-task-01-form-entry-note-result-02 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (11, 'note', 'Notizen', 'Notizen', false, 5, 'TEXTAREA', 'TEXT', true, 2)

--changeset id:insert-contact-person-project-task-02-result-03 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (3, 'TYPE_CONTACT_PERS', 2)

--changeset id:insert-project-task-02-form-entry-contactPerson-result-03 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (12, 'contactPerson', 'Name Ansprechpartner', 'Name Ansprechpartner', false, 1, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-project-task-02-form-entry-department-result-03 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (13, 'department', 'Referat', 'Referat', false, 2, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-project-task-02-form-entry-taskArea-result-03 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (14, 'taskArea', 'Aufgabenbereich', 'Aufgabenbereich', false, 3, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-project-task-02-form-entry-note-result-03 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (15, 'note', 'Notizen', 'Notizen', false, 4, 'TEXTAREA', 'TEXT', true, 3)

--changeset id:insert-project-task-02-form-entry-status-result-03 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (16, 'status', 'Status', 'Status', false, 5, 'DROPDOWN', false, 3)

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
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (17, 'https://applpzport.zivit.iv.bfinv.de:52801/irj/portal', 'documentationLink', 'Link', 'Link zu iSAR', false, 1, 'TEXTBOX', 'URL', true, 3)

--changeset id:insert-project-task-03-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (18, 'contactPerson', 'Name', 'Name Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-project-task-03-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (19, 'department', 'Referat', 'Referat', false, 3, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-project-task-03-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (20, 'taskArea', 'Aufgabenbereich', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-contact-person-project-task-03-result-04 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (4, 'TYPE_STD', 3)

--changeset id:insert-project-task-03-form-entry-contactPerson-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (21, 'colleage', 'Name', 'Name Teamkollege', false, 1, 'TEXTBOX', 'TEXT', true, 4)

--changeset id:insert-project-task-03-form-entry-department-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (22, 'department', 'Referat', 'Referat', false, 2, 'TEXTBOX', 'TEXT', true, 4)

--changeset id:insert-project-task-03-form-entry-taskArea-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (23, 'taskArea', 'Aufgabenbereich', 'Aufgabenbereich', false, 3, 'TEXTBOX', 'TEXT', true, 4)

--changeset id:insert-project-task-03-form-entry-PT-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (24, 'PT', 'PT', 'Personentage', false, 4, 'TEXTBOX', 'NUMBER', true, 4)

--changeset id:insert-project-task-03-form-entry-note-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (25, 'note', 'Notizen', 'Notizen', false, 5, 'TEXTAREA', 'TEXT', true, 4)

--changeset id:insert-project-task-03-form-entry-status-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (26, 'status', 'Status', 'Status', false, 6, 'DROPDOWN', false, 4)

--changeset id:insert-project-task-03-option-entry-person-planned-result-04 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 26)

--changeset id:insert-project-task-03-option-entry-person-booked-result-04 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('BOOKED', 'besetzt', 26)
--
----changeset id:insert-contact-person-project-task-04-result-05 context:itzbund
--INSERT INTO project_task_result (id, result_type, project_task_id)
--VALUES (5, 'TYPE_CONTACT_PERS', 4)
--
----changeset id:insert-project-task-04-form-entry-contactPerson-result-05 context:itzbund
--INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
--VALUES (28, 'contactPerson', 'Name Ansprechpartner', 'Name Ansprechpartner', false, 1, 'TEXTBOX', 'TEXT', true, 5)
--
----changeset id:insert-project-task-04-form-entry-department-result-05 context:itzbund
--INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
--VALUES (29, 'department', 'Referat', 'Referat', false, 2, 'TEXTBOX', 'TEXT', true, 5)
--
----changeset id:insert-project-task-04-form-entry-taskArea-result-05 context:itzbund
--INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
--VALUES (30, 'taskArea', 'Aufgabenbereich', 'Aufgabenbereich', false, 3, 'TEXTBOX', 'TEXT', true, 5)
--
----changeset id:insert-project-task-04-form-entry-note-result-05 context:itzbund
--INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
--VALUES (31, 'note', 'Notizen', 'Notizen', false, 4, 'TEXTAREA', 'TEXT', true, 5)
--
----changeset id:insert-project-task-04-form-entry-status-result-05 context:itzbund
--INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, show, result_id)
--VALUES (32, 'status', 'Status', 'Status', false, 5, 'DROPDOWN', false, 5)
--
----changeset id:insert-project-task-04-option-entry-person-OPEN-result-05 context:itzbund
--INSERT INTO option_entry (key, value, form_field_id)
--VALUES ('OPEN', 'offen', 32)
--
----changeset id:insert-project-task-04-option-entry-person-CONTACTED-result-05 context:itzbund
--INSERT INTO option_entry (key, value, form_field_id)
--VALUES ('CONTACTED', 'angesprochen', 32)
--
----changeset id:insert-project-task-04-option-entry-person-ANSWER_RECEIVED-result-05 context:itzbund
--INSERT INTO option_entry (key, value, form_field_id)
--VALUES ('ANSWER_RECEIVED', 'Antwort erhalten', 32)
--
----changeset id:insert-project-task-04-option-entry-person-DONE-result-05 context:itzbund
--INSERT INTO option_entry (key, value, form_field_id)
--VALUES ('DONE', 'abgeschlossen', 32)

--changeset id:insert-project-task-04-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (27, 'https://applpzport.zivit.iv.bfinv.de:52801/irj/portal', 'documentationLink', 'Link', 'Link zu iSAR', false, 1, 'TEXTBOX', 'URL', false, 4)

--changeset id:insert-project-task-04-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (28, 'contactPerson', 'Name Ansprechpartner', 'Name Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', false, 4)

--changeset id:insert-project-task-04-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (29, 'department', 'Referat', 'Referat', false, 3, 'TEXTBOX', 'TEXT', false, 4)

--changeset id:insert-project-task-04-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (30, 'taskArea', 'Aufgabenbereich', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', false, 4)

--changeset id:insert-contact-person-project-task-04-result-05 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (5, 'TYPE_APPT_SERIES', 4)

--changeset id:insert-project-task-04-form-entry-serie-jf-result-05 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (31, 'Jour Fixe', 'serie', 'Name der Serie', 'Name der Serie', false, 1, 'TEXTBOX', 'TEXT', true, 5)

--changeset id:insert-project-task-04-form-entry-date-result-05 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (32, 'date', 'Termin', 'Termin', false, 2, 'TEXTBOX', 'DATE', true, 5)

--changeset id:insert-project-task-04-form-entry-participants-result-05 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (33, 'participants', 'Teilnehmende', 'Teilnehmende', false, 3, 'TEXTAREA', 'TEXT', true, 5)

--changeset id:insert-project-task-04-form-entry-link-result-05 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (34, 'link', 'Einwahllink', 'Einwahllink', false, 4, 'TEXTBOX', 'TEXT', true, 5)

--changeset id:insert-project-task-04-form-entry-note-result-05 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (35, 'note', 'Notizen', 'Notizen', false, 5, 'TEXTAREA', 'TEXT', true, 5)

--changeset id:insert-project-task-04-form-entry-status-result-05 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (36, 'status', 'Status', 'Status', false, 6, 'DROPDOWN', false, 5)

--changeset id:insert-project-task-04-option-entry-person-planned-result-05 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 36)

--changeset id:insert-project-task-04-option-entry-person-booked-result-05 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('BOOKED', 'besetzt', 36)

--changeset id:insert-project-task-05-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (37, 'https://applpzport.zivit.iv.bfinv.de:52801/irj/portal', 'documentationLink', 'Link', 'Link zu iSAR', false, 1, 'TEXTBOX', 'URL', false, 5)

--changeset id:insert-project-task-05-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (38, 'contactPerson', 'Name Ansprechpartner', 'Name Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', false, 5)

--changeset id:insert-project-task-05-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (39, 'department', 'Referat', 'Referat', false, 3, 'TEXTBOX', 'TEXT', false, 5)

--changeset id:insert-project-task-05-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (40, 'taskArea', 'Aufgabenbereich', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', false, 5)

--changeset id:insert-contact-person-project-task-05-result-06 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (6, 'TYPE_APPT_SERIES', 5)

--changeset id:insert-project-task-05-form-entry-serie-jf-result-06 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (41, 'date', 'Datum', 'Datum', false, 1, 'TEXTBOX', 'DATE', true, 5)

--changeset id:insert-project-task-05-form-entry-date-result-06 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (42, 'goal', 'Zielzustand', 'Zielzustand', false, 2, 'TEXTBOX', 'TEXT', true, 5)

--changeset id:insert-project-task-05-form-entry-participants-result-06 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (43, 'responsible_person', 'Verantwortung', 'Verantwortung', false, 3, 'TEXTAREA', 'TEXT', true, 5)

--changeset id:insert-project-task-05-form-entry-note-result-06 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (44, 'note', 'Notizen', 'Notizen', false, 5, 'TEXTAREA', 'TEXT', true, 5)

--changeset id:insert-project-task-05-form-entry-status-result-06 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (45, 'status', 'Status', 'Status', false, 6, 'DROPDOWN', false, 5)

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
VALUES (7, 'TYPE_APPT_SERIES', 6)

--changeset id:insert-project-task-06-form-entry-name-link-result-07 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (46, 'eAkte', 'name', 'Name', 'Name', false, 1, 'TEXTBOX', 'TEXT', true, 7)

--changeset id:insert-project-task-06-form-entry-link-result-07 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (47, 'documentationLink', 'Link', 'Link', false, 2, 'TEXTBOX', 'URL', true, 7)

--changeset id:insert-project-task-06-form-entry-note-result-07 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (48, 'note', 'Notizen', 'Notizen', false, 4, 'TEXTAREA', 'TEXT', true, 7)

--changeset id:insert-contact-person-project-task-06-result-08 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (8, 'TYPE_APPT_SERIES', 6)

--changeset id:insert-project-task-06-form-entry-name-link-result-08 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (49, 'SharePoint', 'name', 'Name', 'Name', false, 1, 'TEXTBOX', 'TEXT', true, 8)

--changeset id:insert-project-task-06-form-entry-link-result-08 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (50, 'documentationLink', 'Link', 'Link', false, 2, 'TEXTBOX', 'URL', true, 8)

--changeset id:insert-project-task-06-form-entry-note-result-08 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (51, 'note', 'Notizen', 'Notizen', false, 4, 'TEXTAREA', 'TEXT', true, 8)

--changeset id:insert-project-task-07-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (52, 'https://applnosrmp.zivit.iv.bfinv.de:8001/SAP/BC/NWBC/SRM', 'documentationLink', 'Link', 'Link zum Bestellungstool', false, 1, 'TEXTBOX', 'URL', true, 7)

--changeset id:insert-project-task-07-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (53, 'contactPerson', 'Name Ansprechpartner', 'Name Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 7)

--changeset id:insert-project-task-07-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (54, 'department', 'Referat', 'Referat', false, 3, 'TEXTBOX', 'TEXT', true, 7)

--changeset id:insert-project-task-07-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (55, 'taskArea', 'Aufgabenbereich', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', true, 7)

--changeset id:insert-contact-person-project-task-07-result-08 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (9, 'TYPE_APPT_SERIES', 7)

--changeset id:insert-project-task-07-form-entry-shopping_cart_number-result-09 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (56, 'shopping_cart_number', 'EKW - Nummer', 'EKW - Nummer', false, 1, 'TEXTBOX', 'TEXT', true, 9)

--changeset id:insert-project-task-07-form-entry-shopping_cart_content-result-09 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (57, 'shopping_cart_content', 'EKW - Inhalt', 'EKW - Inhalt', false, 2, 'TEXTBOX', 'URL', true, 9)

--changeset id:insert-project-task-07-form-entry-note-result-09 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (58, 'note', 'Notizen', 'Notizen', false, 3, 'TEXTAREA', 'TEXT', true, 9)

--changeset id:insert-project-task-07-form-entry-status-result-09 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (59, 'status', 'Status', 'Status', false, 4, 'DROPDOWN', 'TEXT', true, 9)

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

--changeset id:insert-project-task-09-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (59, 'https://aedl.itz.itzbund.net/AeDL-Web/sites/login.xhtml', 'documentationLink', 'Link', 'Link zum Abrechnungstool', false, 1, 'TEXTBOX', 'URL', true, 9)

--changeset id:insert-project-task-09-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (60, 'contactPerson', 'Name Ansprechpartner', 'Name Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 9)

--changeset id:insert-project-task-09-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (61, 'department', 'Referat', 'Referat', false, 3, 'TEXTBOX', 'TEXT', true, 9)

--changeset id:insert-project-task-09-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (62, 'taskArea', 'Aufgabenbereich', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', true, 9)

--changeset id:insert-contact-person-project-task-09-result-10 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (10, 'TYPE_APPT_SERIES', 9)

--changeset id:insert-project-task-09-form-entry-note-result-10 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (63, 'note', 'Notizen', 'Notizen', false, 1, 'TEXTAREA', 'TEXT', true, 10)

--changeset id:insert-project-task-08-form-entry-status-result-10 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (64, 'status', 'Status', 'Status', false, 2, 'DROPDOWN', 'TEXT', true, 10)

--changeset id:insert-project-task-09-option-entry-person-OPEN-result-10 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('OPEN', 'offen', 64)

--changeset id:insert-project-task-09-option-entry-person-CLOSED-result-10 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('CLOSED', 'geschlossen', 64)

--changeset id:insert-project-task-09-option-entry-person-PLANNED-result-10 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 64)

--changeset id:insert-project-task-09-option-entry-person-ASSIGNED-result-10 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ASSIGNED', 'zugewiesen', 64)

--changeset id:insert-project-task-09-option-entry-person-IN_PROGRESS-result-10 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('IN_PROGRESS', 'in Bearbeitung', 64)

--changeset id:insert-project-task-09-option-entry-person-SUBMITTED-result-10 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('SUBMITTED', 'vorgelegt', 64)

--changeset id:insert-project-task-09-option-entry-person-DONE-result-10 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('DONE', 'fertiggestellt', 64)