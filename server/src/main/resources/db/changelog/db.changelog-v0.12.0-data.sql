--liquibase formatted sql

--changeset id:update_project_is_permanent-project-task-03 context:weit
UPDATE project_task
SET icon = 'groups'
WHERE id = 3

--changeset id:update_project_is_permanent-project-task-04 context:weit
UPDATE project_task
SET icon = 'schedule'
WHERE id = 4

--changeset id:update_project_is_permanent-project-task-05 context:weit
UPDATE project_task
SET icon = 'edit_calendar'
WHERE id = 5

--changeset id:update_project_is_permanent-project-task-06 context:weit
UPDATE project_task
SET icon = 'plagiarism'
WHERE id = 6

--changeset id:update_project_is_permanent-project-task-07 context:weit
UPDATE project_task
SET icon = 'shopping_cart'
WHERE id = 7

--changeset id:update_project_is_permanent-project-task-08 context:weit
UPDATE project_task
SET icon = 'emoji_events'
WHERE id = 8

--changeset id:update_project_is_permanent-project-task-09 context:weit
UPDATE project_task
SET icon = 'attach_money'
WHERE id = 9

--changeset id:update_project_is_permanent-project-task-11 context:weit
UPDATE project_task
SET icon = 'grading'
WHERE id = 11

--changeset id:update_project_is_permanent-project-task-12 context:weit
UPDATE project_task
SET icon = 'warning'
WHERE id = 12

--changeset id:update_default_role_project_role_itzbund context:weit
UPDATE project_role
SET default_role = true
WHERE abbreviation = 'PT' OR abbreviation = 'ET'

--changeset id:update_default_role_project_role_ba context:ba
UPDATE project_role
SET default_role = true
WHERE abbreviation = 'PT'


--changeset id:insert-project-role-non-agil-pe
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id, icon, max_count)
VALUES ('Projekteigner', 'PE', 'WRITE', 1, 'phone', 1)

--changeset id:update_icon_project_role_PT_ET_weit context:weit
UPDATE project_role
SET icon = 'group'
WHERE abbreviation = 'PT' OR abbreviation = 'ET'

--changeset id:update_icon_project_role_PL_itzbund context:weit
UPDATE project_role
SET icon = 'engineering', max_count = 1
WHERE abbreviation = 'PL'

--changeset id:update_icon_project_role_LA_itzbund context:weit
UPDATE project_role
SET icon = 'follow_the_signs'
WHERE abbreviation = 'LA'

--changeset id:update_icon_project_role_PO_itzbund context:weit
UPDATE project_role
SET icon = 'lightbulb', max_count = 1
WHERE abbreviation = 'PO'

--changeset id:update_icon_project_role_SM_itzbund context:weit
UPDATE project_role
SET icon = 'school', max_count = 1
WHERE abbreviation = 'SM'

--changeset id:update_icon_project_role_PT_itzbund context:ba
UPDATE project_role
SET icon = 'group'
WHERE abbreviation = 'PT'


--changeset id:update_icon_project_role_max_count_default_value
UPDATE project_role
SET max_count = -1
WHERE max_count is null


--changeset id:insert-project-role-agil-pe context:weit
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id, icon, max_count)
VALUES ('Projekteigner', 'PE', 'WRITE', 2, 'phone', 1)

--changeset id:insert-project-role-Feldberg-pe context:weit
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id, icon, max_count)
VALUES ('Projekteigner', 'PE', 'WRITE', 5, 'phone', 1)

--changeset id:insert-project-role-Zugspitze-pe context:weit
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id, icon, max_count)
VALUES ('Projekteigner', 'PE', 'WRITE', 6, 'phone', 1)

--changeset id:insert-project-role-Bergsteigerausrüstung-pe context:weit
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id, icon, max_count)
VALUES ('Projekteigner', 'PE', 'WRITE', 7, 'phone', 1)


--changeset id:insert-user-Jana-Feldberg-connection context:weit
INSERT INTO user_project_role_connection (user_id, project_role_id)
VALUES (3, (SELECT id FROM project_role WHERE project_role_template_id = 5 AND abbreviation = 'PE'))

--changeset id:insert-user-Jana-PE-Bergsteigerausrüstung-connection context:weit
INSERT INTO user_project_role_connection (user_id, project_role_id)
VALUES (3, (SELECT id FROM project_role WHERE project_role_template_id = 7 AND abbreviation = 'PE'))

--changeset id:insert-user-Maria-Zugspitze-PE context:weit
INSERT INTO user_project_role_connection (user_id, project_role_id)
VALUES (4, (SELECT id FROM project_role WHERE project_role_template_id = 6 AND abbreviation = 'PE'))

--changeset id:insert-project-role-Serveraustausch-pe context:ba
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id, icon, max_count)
VALUES ('Projekteigner', 'PE', 'WRITE', 3, 'phone', 1)

--changeset id:insert-project-role-Cisco_Router_Nürnberg-pe context:ba
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id, icon, max_count)
VALUES ('Projekteigner', 'PE', 'WRITE', 4, 'phone', 1)

--changeset id:insert-project-role-Oranienburg-pe context:ba
INSERT INTO project_role (name, abbreviation, permission, project_role_template_id, icon, max_count)
VALUES ('Projekteigner', 'PE', 'WRITE', 8, 'phone', 1)

--changeset id:insert-user-Rolf-Serveraustausch-connection context:ba
INSERT INTO user_project_role_connection (user_id, project_role_id)
VALUES (7, (SELECT id FROM project_role WHERE project_role_template_id = 3 AND abbreviation = 'PE'))

--changeset id:insert-user-Schmidt-PE-Cisco_Router_Nürnberg-connection context:ba
INSERT INTO user_project_role_connection (user_id, project_role_id)
VALUES (8, (SELECT id FROM project_role WHERE project_role_template_id = 4 AND abbreviation = 'PE'))

--changeset id:insert-user-Rolf-Oranienburg-PE context:ba
INSERT INTO user_project_role_connection (user_id, project_role_id)
VALUES (7, (SELECT id FROM project_role WHERE project_role_template_id = 8 AND abbreviation = 'PE'))
