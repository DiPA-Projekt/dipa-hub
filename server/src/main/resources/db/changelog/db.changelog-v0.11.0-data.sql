--liquibase formatted sql

--changeset id:insert-project-approach-swe-small-project context:itzbund
INSERT INTO project_approach (id, name, iterative, operation_type_id)
VALUES (7, 'VMXT ITZBund Kleinprojekte', false, 2)

--changeset id:insert-template-swe-small-project context:itzbund
INSERT INTO plan_template (id, name) VALUES (15, 'VMXT ITZBund Kleinprojekte Template')

--changeset id:insert-connection-template-swe-small-project context:itzbund
INSERT INTO project_approach_plan_template_connection (project_approach_id, plan_template_id) VALUES (7, 15)

--changeset id:milestones-template-swe-small-project-Projekteinrichtung context:itzbund
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
VALUES ('Projekteinrichtung', 14, Now() + 14, 15)

--changeset id:milestones-template-swe-small-project-Projektabschluss context:itzbund
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
VALUES ('Projektabschluss', 180, Now() + 14, 15)

--changeset id:insert-project-role-non-agil-template
INSERT INTO project_role_template (id, name)
VALUES (1, 'Project roles non-agile')

--changeset id:insert-project-role-non-agil-sc
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (1, 'Lenkungsausschuss', 'LA', 'read', 1)

--changeset id:insert-project-role-non-agil-pm
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (2, 'Projektleiter', 'PL', 'write', 1)

--changeset id:insert-project-role-non-agil-team
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (3, 'Projektteam', 'PT', 'write', 1)

--changeset id:insert-project-role-agil-template context:itzbund
INSERT INTO project_role_template (id, name)
VALUES (2, 'Project roles agile')

--changeset id:insert-project-role-agil-sc context:itzbund
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (4, 'Lenkungsausschuss', 'LA', 'read', 2)

--changeset id:insert-project-role-agil-pm context:itzbund
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (5, 'Projektleiter', 'PL', 'write', 2)

--changeset id:insert-project-role-agil-team context:itzbund
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (6, 'Entwicklungsteam', 'ET', 'write', 2)

--changeset id:insert-project-role-agil-scrum-master context:itzbund
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (7, 'Scrum Master', 'SM', 'write', 2)

--changeset id:insert-project-role-agil-po context:itzbund
INSERT INTO project_role (id, name, abbreviation, permission, project_role_template_id)
VALUES (8, 'Product Owner', 'PO', 'write', 2)

--changeset id:insert-project-role-template-Serveraustausch context:ba
INSERT INTO project_role_template (id, name, project_id)
VALUES (3, 'Project roles Serveraustausch', 1)

--changeset id:insert-project-role-Serveraustausch context:ba
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id)
SELECT name, abbreviation, permission, 3 FROM project_role WHERE id = 1

--changeset id:insert-project-role-template-Cisco_Router_Nürnberg context:ba
INSERT INTO project_role_template (id, name, project_id)
VALUES (4, 'Project roles Cisco Router Nürnberg', 2)

--changeset id:insert-project-role-Cisco_Router_Nürnberg context:ba
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id)
SELECT name, abbreviation, permission, 4 FROM project_role WHERE id = 1

--changeset id:insert-project-role-template-Feldberg context:itzbund
INSERT INTO project_role_template (id, name, project_id)
VALUES (5, 'Project roles Feldberg', 3)

--changeset id:insert-project-role-Feldberg context:itzbund
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id)
SELECT name, abbreviation, permission, 5 FROM project_role WHERE id = 2

--changeset id:insert-project-role-template-Zugspitze context:itzbund
INSERT INTO project_role_template (id, name, project_id)
VALUES (6, 'Project roles Zugspitze', 4)

--changeset id:insert-project-role-Zugspitze context:itzbund
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id)
SELECT name, abbreviation, permission, 6 FROM project_role WHERE id = 1

--changeset id:insert-project-role-template-Bergsteigerausrüstung context:itzbund
INSERT INTO project_role_template (id, name, project_id)
VALUES (7, 'Project roles Bergsteigerausrüstung', 5)

--changeset id:insert-project-role-Bergsteigerausrüstung context:itzbund
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id)
SELECT name, abbreviation, permission, 7 FROM project_role WHERE id = 1

--changeset id:insert-project-role-template-Oranienburg context:ba
INSERT INTO project_role_template (id, name, project_id)
VALUES (8, 'Project roles Routeraustasch Oranienburg', 6)

--changeset id:insert-project-role-Oranienburg context:ba
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id)
SELECT name, abbreviation, permission, 8 FROM project_role WHERE id = 1

--changeset id:insert-project-approach-non-agile-project-role-template
UPDATE project_approach
SET project_role_template_id = 1

--changeset id:insert-project-approach-agile-project-role-template context:itzbund
UPDATE project_approach
SET project_role_template_id = 2
WHERE id = 2
