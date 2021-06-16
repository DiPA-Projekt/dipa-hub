--liquibase formatted sql

--changeset id:update-single-appointment-status-planned context:itzbund
UPDATE project_task_form_field
SET value = 'OPEN'
WHERE value = 'PLANNED' AND result_id IN (SELECT id FROM project_task_result WHERE result_type = 'TYPE_SINGLE_APPOINTMENT')

--changeset id:update-single-appointment-status-invited context:itzbund
UPDATE project_task_form_field
SET value = 'OPEN'
WHERE value = 'INVITED' AND result_id IN (SELECT id FROM project_task_result WHERE result_type = 'TYPE_SINGLE_APPOINTMENT')

--changeset id:update-single-appointment-status-done context:itzbund
UPDATE project_task_form_field
SET value = 'CLOSED'
WHERE value = 'DONE' AND result_id IN (SELECT id FROM project_task_result WHERE result_type = 'TYPE_SINGLE_APPOINTMENT')

--changeset id:delete-options-status-single-appointment context:itzbund
DELETE FROM option_entry
WHERE form_field_id IN (SELECT id FROM project_task_form_field WHERE result_id IN (SELECT id FROM project_task_result WHERE result_type = 'TYPE_SINGLE_APPOINTMENT'))

--changeset id:insert-project-task-TYPE_SINGLE_APPOINTMENT-option-entry-person-OPEN-resultcontext:itzbund
INSERT INTO option_entry (key, value, form_field_id)
SELECT 'OPEN', 'offen', id FROM project_task_form_field WHERE result_id IN (SELECT id FROM project_task_result WHERE result_type = 'TYPE_SINGLE_APPOINTMENT')

--changeset id:insert-project-task-TYPE_SINGLE_APPOINTMENT-option-entry-person-CLOSED-resultcontext:itzbund
INSERT INTO option_entry (key, value, form_field_id)
SELECT 'CLOSED', 'geschlossen', id FROM project_task_form_field WHERE result_id IN (SELECT id FROM project_task_result WHERE result_type = 'TYPE_SINGLE_APPOINTMENT')

--changeset id:insert-project-task-05-option-entry-person-OPEN-result-06 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('OPEN', 'offen', 45)

--changeset id:insert-project-task-05-option-entry-person-CLOSED-result-06 context:itzbund
INSERT INTO option_entry (key, value, form_field_id)
VALUES ('CLOSED', 'geschlossen', 45)
