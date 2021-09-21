--liquibase formatted sql

--changeset id:insert-project-approach-swe-small-project context:weit
INSERT INTO project_approach (id, name, iterative, operation_type_id)
VALUES (7, 'VMXT ITZBund Kleinprojekte', false, 2)

--changeset id:insert-template-swe-small-project context:weit
INSERT INTO plan_template (id, name) VALUES (15, 'VMXT ITZBund Kleinprojekte Template')

--changeset id:insert-connection-template-swe-small-project context:weit
INSERT INTO project_approach_plan_template_connection (project_approach_id, plan_template_id) VALUES (7, 15)

--changeset id:milestones-template-swe-small-project-Projekteinrichtung context:weit dbms:h2
INSERT INTO milestone_template (name, date_offset, date, plan_template_id)
VALUES ('Projekteinrichtung', 14, Now() + 14, 15)

--changeset id:milestones-template-swe-small-project-Projekteinrichtung context:weit dbms:postgresql
INSERT INTO milestone_template (name, date_offset, date, plan_template_id)
VALUES ('Projekteinrichtung', 14,NOW() + 14 * INTERVAL '1 day', 15)

--changeset id:milestones-template-swe-small-project-Projektabschluss context:weit dbms:h2
INSERT INTO milestone_template (name, date_offset, date, plan_template_id)
VALUES ('Projektabschluss', 180, Now() + 180, 15)

--changeset id:milestones-template-swe-small-project-Projektabschluss context:weit dbms:postgresql
INSERT INTO milestone_template (name, date_offset, date, plan_template_id)
VALUES ('Projektabschluss', 180, NOW() + 180 * INTERVAL '1 day', 15)

--changeset id:insert-project-role-non-agil-template
INSERT INTO project_role_template (id, name)
VALUES (1, 'Project roles non-agile')

--changeset id:insert-project-role-non-agil-sc
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (1, 'Lenkungsausschuss', 'LA', 'READ', 1)

--changeset id:insert-project-role-non-agil-pm
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (2, 'Projektleiter', 'PL', 'WRITE', 1)

--changeset id:insert-project-role-non-agil-team
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (3, 'Projektteam', 'PT', 'WRITE', 1)

--changeset id:insert-project-role-agil-template context:weit
INSERT INTO project_role_template (id, name)
VALUES (2, 'Project roles agile')

--changeset id:insert-project-role-agil-sc context:weit
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (4, 'Lenkungsausschuss', 'LA', 'READ', 2)

--changeset id:insert-project-role-agil-pm context:weit
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (5, 'Projektleiter', 'PL', 'WRITE', 2)

--changeset id:insert-project-role-agil-team context:weit
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (6, 'Entwicklungsteam', 'ET', 'WRITE', 2)

--changeset id:insert-project-role-agil-scrum-master context:weit
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (7, 'Scrum Master', 'SM', 'WRITE', 2)

--changeset id:insert-project-role-agil-po context:weit
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (8, 'Product Owner', 'PO', 'WRITE', 2)

--changeset id:insert-project-role-template-Serveraustausch context:ba
INSERT INTO project_role_template (id, name, project_id)
VALUES (3, 'Project roles Serveraustausch', 1)

--changeset id:reset_id_sequence-project-role-11 author:becker dbms:postgresql
--comment: sequence reset is necessary after manual id inserts.
SELECT setval('project_role_id_seq', (SELECT max(id) FROM project_role));

--changeset id:insert-project-role-Serveraustausch context:ba
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id)
SELECT name, abbreviation, permission, 3 FROM project_role WHERE project_role_template_id = 1

--changeset id:insert-project-role-template-Cisco_Router_Nürnberg context:ba
INSERT INTO project_role_template (id, name, project_id)
VALUES (4, 'Project roles Cisco Router Nürnberg', 2)

--changeset id:insert-project-role-Cisco_Router_Nürnberg context:ba
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id)
SELECT name, abbreviation, permission, 4 FROM project_role WHERE project_role_template_id = 1

--changeset id:insert-project-role-template-Feldberg context:weit
INSERT INTO project_role_template (id, name, project_id)
VALUES (5, 'Project roles Feldberg', 3)

--changeset id:insert-project-role-Feldberg context:weit
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id)
SELECT name, abbreviation, permission, 5 FROM project_role WHERE project_role_template_id = 2

--changeset id:insert-project-role-template-Zugspitze context:weit
INSERT INTO project_role_template (id, name, project_id)
VALUES (6, 'Project roles Zugspitze', 4)

--changeset id:insert-project-role-Zugspitze context:weit
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id)
SELECT name, abbreviation, permission, 6 FROM project_role WHERE project_role_template_id = 1

--changeset id:insert-project-role-template-Bergsteigerausrüstung context:weit
INSERT INTO project_role_template (id, name, project_id)
VALUES (7, 'Project roles Bergsteigerausrüstung', 5)

--changeset id:insert-project-role-Bergsteigerausrüstung context:weit
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id)
SELECT name, abbreviation, permission, 7 FROM project_role WHERE project_role_template_id = 1

--changeset id:insert-project-role-template-Oranienburg context:ba
INSERT INTO project_role_template (id, name, project_id)
VALUES (8, 'Project roles Routeraustasch Oranienburg', 6)

--changeset id:insert-project-role-Oranienburg context:ba
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id)
SELECT name, abbreviation, permission, 8 FROM project_role WHERE project_role_template_id = 1

--changeset id:insert-project-approach-non-agile-project-role-template
UPDATE project_approach
SET project_role_template_id = 1

--changeset id:insert-project-approach-agile-project-role-template context:weit
UPDATE project_approach
SET project_role_template_id = 2
WHERE id = 2

--changeset id:insert-organisation-role-pmo
INSERT INTO organisation_role (id, name, abbreviation, permission)
VALUES (1, 'Project Management Office', 'PMO', 'READ')

--changeset id:insert-organisation-role-SMPL
INSERT INTO organisation_role (id, name, abbreviation, permission)
VALUES (2, 'SMPL', 'SMPL', 'READ')

--changeset id:insert-organisation-role-DSB
INSERT INTO organisation_role (id, name, abbreviation, permission)
VALUES (3, 'DSB', 'DSB', 'READ')

--changeset id:insert-user-Arne
INSERT INTO app_user (id, name, tenant_id, keycloak_id)
VALUES (1, 'Herr Arne', 'weit', '3b5b08d6-bc99-4d84-bb72-d09c42b0aff4')

--changeset id:insert-user-Arne-PMO-connection context:weit
INSERT INTO user_organisation_role_connection (user_id, organisation_role_id)
VALUES (1, 1)

--changeset id:insert-user-Frank
INSERT INTO app_user (id, name, tenant_id, keycloak_id)
VALUES (2, 'Herr Frank', 'ba', '6afc6411-aa12-4d11-969b-81d9a026540f')

--changeset id:insert-user-Frank-PMO-connection context:ba
INSERT INTO user_organisation_role_connection (user_id, organisation_role_id)
VALUES (2, 1)

--changeset id:insert-user-Jana
INSERT INTO app_user (id, name, tenant_id, keycloak_id)
VALUES (3, 'Frau Jana', 'weit', 'f5cde284-a3c2-40b8-9aa6-631fa016e6ba')

--changeset id:insert-user-Jana-PE-Feldberg-connection context:weit
UPDATE project
SET user_id = 3
WHERE id = 3

--changeset id:insert-user-Jana-PE-Bergsteigerausrüstung-connection context:weit
UPDATE project
SET user_id = 3
WHERE id = 5

--changeset id:insert-user-Maria
INSERT INTO app_user (id, name, tenant_id, keycloak_id)
VALUES (4, 'Frau Maria', 'weit', '387add7c-ff8a-4206-a74e-78ccdf54bcad')

--changeset id:insert-user-Maria-PE-Feldberg-LA context:weit
INSERT INTO user_project_role_connection (user_id, project_role_id)
VALUES (4, (SELECT id FROM project_role WHERE project_role_template_id = 5 AND abbreviation = 'LA'))

--changeset id:insert-user-Maria-PE-Zugspitze-PE context:weit
UPDATE project
SET user_id = 4
WHERE id = 4

--changeset id:insert-user-Meyer
INSERT INTO app_user (id, name, tenant_id, keycloak_id)
VALUES (5, 'Herr Meyer', 'weit', 'bad74bcf-50f7-43f3-a81a-236c91b74458')

--changeset id:insert-user-Meyer-PE-Feldberg-PL context:weit
INSERT INTO user_project_role_connection (user_id, project_role_id)
VALUES (5, (SELECT id FROM project_role WHERE project_role_template_id = 5 AND abbreviation = 'PL'))

--changeset id:insert-user-Schulze
INSERT INTO app_user (id, name, tenant_id, keycloak_id)
VALUES (6, 'Herr Schulze', 'weit', 'c95b47da-17ae-4eb2-93b9-d93bfb7a2d9c')

--changeset id:insert-user-Schulze-PE-Bergsteigerausrüstung-PL context:weit
INSERT INTO user_project_role_connection (user_id, project_role_id)
VALUES (6, (SELECT id FROM project_role WHERE project_role_template_id = 7 AND abbreviation = 'PL'))

--changeset id:insert-user-Rolf
INSERT INTO app_user (id, name, tenant_id, keycloak_id)
VALUES (7, 'Herr Rolf', 'ba', '40714f4c-24fc-40c1-bba3-2b58bdfce479')

--changeset id:insert-user-Rolf-Serveraustausch-PE context:ba
UPDATE project
SET user_id = 7
WHERE id = 1

--changeset id:insert-user-Rolf-Cisco-LA context:ba
INSERT INTO user_project_role_connection (user_id, project_role_id)
VALUES (7, (SELECT id FROM project_role WHERE project_role_template_id = 4 AND abbreviation = 'LA'))

--changeset id:insert-user-Rolf-Oranienburg-LA context:ba
UPDATE project
SET user_id = 7
WHERE id = 6

--changeset id:insert-user-Schmidt
INSERT INTO app_user (id, name, tenant_id, keycloak_id)
VALUES (8, 'Herr Schmidt', 'ba', '76430b01-af1b-4243-b71e-1627a2fb7aae')

--changeset id:insert-user-Schmidt-Cisco-PE context:ba
UPDATE project
SET user_id = 8
WHERE id = 2

--changeset id:insert-user-Müller
INSERT INTO app_user (id, name, tenant_id, keycloak_id)
VALUES (9, 'Frau Müller', 'ba', 'e8a4069f-5815-41a3-90a2-48cd6d32cb8d')

--changeset id:insert-user-Müller-Cisco-PL context:ba
INSERT INTO user_project_role_connection (user_id, project_role_id)
VALUES (9, (SELECT id FROM project_role WHERE project_role_template_id = 4 AND abbreviation = 'PL'))

--changeset id:update_project_is_permanent-project_default_false context:weit
UPDATE project_task
SET is_permanent_task = false
WHERE true

--changeset id:update_project_is_permanent-project-task-03 context:weit
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'Besetzungen in iSAR verwalten'
WHERE id = 3

--changeset id:update_project_is_permanent-project-task-04 context:weit
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'Regelmäßige Terminserien verwalten'
WHERE id = 4

--changeset id:update_project_is_permanent-project-task-05 context:weit
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'Termine verwalten'
WHERE id = 5

--changeset id:update_project_is_permanent-project-task-06 context:weit
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'Dokumentationsorte verwalten'
WHERE id = 6

--changeset id:update_project_is_permanent-project-task-07 context:weit
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'ELBE Einkaufswagen verwalten'
WHERE id = 7

--changeset id:update_project_is_permanent-project-task-08 context:weit
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'Monatliche Leistungsnachweise freigeben',
explanation = 'Einrichtung der Verträge und der Externen zu diesen Verträgen und Erstellung der monatlichen Leistungsnachweise im Tool "AeDL"'
WHERE id = 8

--changeset id:update_project_is_permanent-project-task-09 context:weit
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'Trackingtabelle externe Dienstleistung pflegen'
WHERE id = 9

--changeset id:update_project_is_permanent-project-task-11 context:weit
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'Monatlichen Statusbericht erstellen und versenden',
explanation = 'Erstellung des Statusberichtes für den vorangegangenen Berichtsmonat in iSAR und Freigabe dessen durch den Projekteigner bis zum 10. Tag des Kalendermonats',
sort_order = 12
WHERE id = 11

--changeset id:update_project_is_permanent-project-task-12 context:weit
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'Risiken managen',
sort_order = 11
WHERE id = 12

