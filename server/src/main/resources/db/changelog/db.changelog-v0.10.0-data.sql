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

--changeset id:delete_project_task_2 context:itzbund
DELETE FROM project_task
WHERE id = 2

--changeset id:delete_project_task_7 context:itzbund
DELETE FROM project_task
WHERE id = 7

--changeset id:insert-project-task-01-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (1, 'documentationLink', 'Link zur Angebotsplanungsunterlage', 'Link zur Angebotsplanungsunterlage', false, 1, 'TEXTBOX', 'URL', true, 1)

--changeset id:insert-contact-person-project-task-01-result-01 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (1, 'TYPE_CONTACT_PERS', 1)

--changeset id:insert-project-task-01-form-entry-subtask-result-01 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (2, 'Auftragsplanung an Projektleitung', 'subtask', 'Name der Unteraufgabe', 'Name der Unteraufgabe', false, 1, 'TEXTBOX', 'TEXT', true, 1)

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
VALUES (7, 'PMO/EAM an Projektleitung', 'subtask', 'Name der Unteraufgabe', 'Name der Unteraufgabe', false, 1, 'TEXTBOX', 'TEXT', true, 2)

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

--changeset id:insert-contact-person-project-task-01-result-03 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (3, 'TYPE_CONTACT_PERS', 1)

--changeset id:insert-project-task-01-form-entry-subtask-result-03 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (12, 'subtask', 'Name der Unteraufgabe', 'Name der Unteraufgabe', false, 1, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-project-task-01-form-entry-contactPerson-result-03 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (13, 'contactPerson', 'Name Ansprechpartner', 'Name Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-project-task-01-form-entry-department-result-03 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (14, 'department', 'Referat', 'Referat', false, 3, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-project-task-01-form-entry-taskArea-result-03 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (15, 'taskArea', 'Aufgabenbereich', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', true, 3)

--changeset id:insert-project-task-01-form-entry-note-result-03 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (16, 'note', 'Notizen', 'Notizen', false, 5, 'TEXTAREA', 'TEXT', true, 3)

--changeset id:insert-project-task-03-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (17, 'https://applpzport.zivit.iv.bfinv.de:52801/irj/portal', 'documentationLink', 'Link zu iSAR', 'Link zu iSAR', false, 1, 'TEXTBOX', 'URL', true, 3)

--changeset id:insert-project-task-03-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (18, 'contactPerson', 'Name Ansprechpartner', 'Name Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 3)

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
VALUES (22, 'contactPerson', 'Name Ansprechpartner', 'Name Ansprechpartner', false, 1, 'TEXTBOX', 'TEXT', true, 4)

--changeset id:insert-project-task-03-form-entry-department-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (23, 'department', 'Referat', 'Referat', false, 2, 'TEXTBOX', 'TEXT', true, 4)

--changeset id:insert-project-task-03-form-entry-taskArea-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (24, 'taskArea', 'Aufgabenbereich', 'Aufgabenbereich', false, 3, 'TEXTBOX', 'TEXT', true, 4)

--changeset id:insert-project-task-03-form-entry-PT-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (25, 'PT', 'PT', 'PT', false, 4, 'TEXTBOX', 'TEXT', true, 4)

--changeset id:insert-project-task-03-form-entry-note-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (26, 'note', 'Notizen', 'Notizen', false, 5, 'TEXTAREA', 'TEXT', true, 4)

--changeset id:insert-project-task-03-form-entry-status-result-04 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (27, 'status', 'Status', 'Status', false, 6, 'DROPDOWN', false, 4)

--changeset id:insert-project-task-03-option-entry-person-planned-result-04 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 27)

--changeset id:insert-project-task-03-option-entry-person-booked-result-04 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('BOOKED', 'besetzt', 27)

--changeset id:insert-contact-person-project-task-04-result-05 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (5, 'TYPE_CONTACT_PERS', 4)

--changeset id:insert-project-task-04-form-entry-contactPerson-result-05 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (28, 'contactPerson', 'Name Ansprechpartner', 'Name Ansprechpartner', false, 1, 'TEXTBOX', 'TEXT', true, 5)

--changeset id:insert-project-task-04-form-entry-department-result-05 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (29, 'department', 'Referat', 'Referat', false, 2, 'TEXTBOX', 'TEXT', true, 5)

--changeset id:insert-project-task-04-form-entry-taskArea-result-05 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (30, 'taskArea', 'Aufgabenbereich', 'Aufgabenbereich', false, 3, 'TEXTBOX', 'TEXT', true, 5)

--changeset id:insert-project-task-04-form-entry-note-result-05 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (31, 'note', 'Notizen', 'Notizen', false, 4, 'TEXTAREA', 'TEXT', true, 5)

--changeset id:insert-project-task-04-form-entry-status-result-05 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (32, 'status', 'Status', 'Status', false, 5, 'DROPDOWN', false, 5)

--changeset id:insert-project-task-04-option-entry-person-OPEN-result-05 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('OPEN', 'offen', 32)

--changeset id:insert-project-task-04-option-entry-person-CONTACTED-result-05 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('CONTACTED', 'angesprochen', 32)

--changeset id:insert-project-task-04-option-entry-person-ANSWER_RECEIVED-result-05 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ANSWER_RECEIVED', 'Antwort erhalten', 32)

--changeset id:insert-project-task-04-option-entry-person-DONE-result-05 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('DONE', 'abgeschlossen', 32)

--changeset id:insert-project-task-05-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (33, 'https://applpzport.zivit.iv.bfinv.de:52801/irj/portal', 'documentationLink', 'Link zu iSAR', 'Link zu iSAR', false, 1, 'TEXTBOX', 'URL', false, 5)

--changeset id:insert-project-task-05-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (34, 'contactPerson', 'Name Ansprechpartner', 'Name Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', false, 5)

--changeset id:insert-project-task-05-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (35, 'department', 'Referat', 'Referat', false, 3, 'TEXTBOX', 'TEXT', false, 5)

--changeset id:insert-project-task-05-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (36, 'taskArea', 'Aufgabenbereich', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', false, 5)

--changeset id:insert-contact-person-project-task-05-result-06 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (6, 'TYPE_APPT_SERIES', 5)

--changeset id:insert-project-task-05-form-entry-serie-jf-result-06 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (37, 'Jour Fixe', 'serie', 'Name der Serie', 'Name der Serie', false, 1, 'TEXTBOX', 'TEXT', true, 6)

--changeset id:insert-project-task-05-form-entry-date-result-06 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (38, 'date', 'Termin', 'Termin', false, 2, 'TEXTBOX', 'TEXT', true, 6)

--changeset id:insert-project-task-05-form-entry-participants-result-06 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (39, 'participants', 'Teilnehmende', 'Teilnehmende', false, 3, 'TEXTAREA', 'TEXT', true, 6)

--changeset id:insert-project-task-05-form-entry-link-result-06 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (40, 'link', 'Einwahllink', 'Einwahllink', false, 4, 'TEXTAREA', 'TEXT', true, 6)

--changeset id:insert-project-task-05-form-entry-note-result-06 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (41, 'note', 'Notizen', 'Notizen', false, 5, 'TEXTAREA', 'TEXT', true, 5)

--changeset id:insert-project-task-05-form-entry-status-result-06 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, show, result_id)
VALUES (42, 'status', 'Status', 'Status', false, 6, 'DROPDOWN', false, 6)

--changeset id:insert-project-task-05-option-entry-person-planned-result-06 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 42)

--changeset id:insert-project-task-05-option-entry-person-booked-result-06 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('BOOKED', 'besetzt', 42)
--
----changeset id:insert-contact-person-project-task-06-result-07 context:itzbund
--INSERT INTO project_task_result (id, result_type, project_task_id)
--VALUES (7, 'TYPE_APPT_SERIES', 6)
--
----changeset id:insert-project-task-06-form-entry-name-link-result-07 context:itzbund
--INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
--VALUES (43, 'name', 'Name', 'Name', false, 1, 'TEXTBOX', 'TEXT', true, 7)
--
----changeset id:insert-project-task-06-form-entry-link-result-07 context:itzbund
--INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
--VALUES (44, 'documentationLink', 'Link', 'Link', false, 2, 'TEXTBOX', 'URL', true, 7)
--
----changeset id:insert-project-task-06-form-entry-participants-result-07 context:itzbund
--INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
--VALUES (45, 'participants', 'Teilnehmende', 'Teilnehmende', false, 3, 'TEXTAREA', 'TEXT', true, 7)
--
----changeset id:insert-project-task-06-form-entry-note-result-07 context:itzbund
--INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
--VALUES (46, 'note', 'Notizen', 'Notizen', false, 4, 'TEXTAREA', 'TEXT', true, 7)
--

--changeset id:insert-contact-person-project-task-06-result-07 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (7, 'TYPE_APPT_SERIES', 6)

--changeset id:insert-project-task-06-form-entry-name-link-result-07 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (43, 'eAkte', 'name', 'Name', 'Name', false, 1, 'TEXTBOX', 'TEXT', true, 7)

--changeset id:insert-project-task-06-form-entry-link-result-07 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (44, 'documentationLink', 'Link', 'Link', false, 2, 'TEXTBOX', 'URL', true, 7)

--changeset id:insert-project-task-06-form-entry-participants-result-07 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (45, 'participants', 'Teilnehmende', 'Teilnehmende', false, 3, 'TEXTAREA', 'TEXT', true, 7)

--changeset id:insert-project-task-06-form-entry-note-result-07 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (46, 'note', 'Notizen', 'Notizen', false, 4, 'TEXTAREA', 'TEXT', true, 7)

--changeset id:insert-contact-person-project-task-06-result-08 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (8, 'TYPE_APPT_SERIES', 6)

--changeset id:insert-project-task-06-form-entry-name-link-result-08 context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (47, 'SharePoint', 'name', 'Name', 'Name', false, 1, 'TEXTBOX', 'TEXT', true, 8)

--changeset id:insert-project-task-06-form-entry-link-result-08 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (48, 'documentationLink', 'Link', 'Link', false, 2, 'TEXTBOX', 'URL', true, 8)

--changeset id:insert-project-task-06-form-entry-participants-result-08 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (49, 'participants', 'Teilnehmende', 'Teilnehmende', false, 3, 'TEXTAREA', 'TEXT', true, 8)

--changeset id:insert-project-task-06-form-entry-note-result-08 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (50, 'note', 'Notizen', 'Notizen', false, 4, 'TEXTAREA', 'TEXT', true, 8)

--changeset id:insert-project-task-08-form-entry-documentationLink context:itzbund
INSERT INTO project_task_form_field (id, value, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (51, 'https://applnosrmp.zivit.iv.bfinv.de:8001/SAP/BC/NWBC/SRM', 'documentationLink', 'Link zum Bestellungstool', 'Link zum Bestellungstool', false, 1, 'TEXTBOX', 'URL', true, 8)

--changeset id:insert-project-task-08-form-entry-contactPerson context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (52, 'contactPerson', 'Name Ansprechpartner', 'Name Ansprechpartner', false, 2, 'TEXTBOX', 'TEXT', true, 8)

--changeset id:insert-project-task-08-form-entry-department context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (53, 'department', 'Referat', 'Referat', false, 3, 'TEXTBOX', 'TEXT', true, 8)

--changeset id:insert-project-task-08-form-entry-taskArea context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, project_task_id)
VALUES (54, 'taskArea', 'Aufgabenbereich', 'Aufgabenbereich', false, 4, 'TEXTBOX', 'TEXT', true, 8)

--changeset id:insert-contact-person-project-task-08-result-09 context:itzbund
INSERT INTO project_task_result (id, result_type, project_task_id)
VALUES (9, 'TYPE_APPT_SERIES', 8)

--changeset id:insert-project-task-08-form-entry-shopping_cart_number-result-09 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (55, 'shopping_cart_number', 'EKW - Nummer', 'EKW - Nummer', false, 1, 'TEXTBOX', 'TEXT', true, 9)

--changeset id:insert-project-task-08-form-entry-shopping_cart_content-result-09 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (56, 'shopping_cart_content', 'EKW - Inhalt', 'EKW - Inhalt', false, 2, 'TEXTBOX', 'URL', true, 9)

--changeset id:insert-project-task-08-form-entry-note-result-09 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (57, 'note', 'Notizen', 'Notizen', false, 3, 'TEXTAREA', 'TEXT', true, 9)

--changeset id:insert-project-task-08-form-entry-status-result-09 context:itzbund
INSERT INTO project_task_form_field (id, key, label, placeholder, required, sort_order, CONTROL_TYPE, type, show, result_id)
VALUES (58, 'status', 'Status', 'Status', false, 4, 'DROPDOWN', 'TEXT', true, 9)

--changeset id:insert-project-task-08-option-entry-person-planned-result-09 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('PLANNED', 'geplant', 58)

--changeset id:insert-project-task-08-option-entry-person-ORDERED-result-09 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('ORDERED', 'bestellt', 58)

--changeset id:insert-project-task-08-option-entry-person-APPROVED-result-09 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('APPROVED', 'genehmigt', 58)

--changeset id:insert-project-task-08-option-entry-person-DELIVERED-result-09 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('DELIVERED', 'geliefert', 58)
