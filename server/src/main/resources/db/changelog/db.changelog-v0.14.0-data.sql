--liquibase formatted sql

--changeset id:update-single-appointment-status-planned context:weit
UPDATE project_task_form_field
SET value = 'OPEN'
WHERE value = 'PLANNED' AND result_id IN (SELECT id FROM project_task_result WHERE result_type = 'TYPE_SINGLE_APPOINTMENT')

--changeset id:update-single-appointment-status-invited context:weit
UPDATE project_task_form_field
SET value = 'OPEN'
WHERE value = 'INVITED' AND result_id IN (SELECT id FROM project_task_result WHERE result_type = 'TYPE_SINGLE_APPOINTMENT')

--changeset id:update-single-appointment-status-done context:weit
UPDATE project_task_form_field
SET value = 'CLOSED'
WHERE value = 'DONE' AND result_id IN (SELECT id FROM project_task_result WHERE result_type = 'TYPE_SINGLE_APPOINTMENT')

--changeset id:delete-options-status-single-appointment context:weit
DELETE FROM option_entry
WHERE form_field_id IN (SELECT id FROM project_task_form_field WHERE key = 'status' AND result_id IN (SELECT id FROM project_task_result WHERE result_type = 'TYPE_SINGLE_APPOINTMENT'))

--changeset id:insert-project-task-TYPE_SINGLE_APPOINTMENT-option-entry-person-OPEN-result context:weit
INSERT INTO option_entry (key, value, form_field_id)
SELECT 'OPEN', 'offen', id FROM project_task_form_field WHERE key = 'status' AND result_id IN (SELECT id FROM project_task_result WHERE result_type = 'TYPE_SINGLE_APPOINTMENT')

--changeset id:insert-project-task-TYPE_SINGLE_APPOINTMENT-option-entry-person-CLOSED-result context:weit
INSERT INTO option_entry (key, value, form_field_id)
SELECT 'CLOSED', 'geschlossen', id FROM project_task_form_field WHERE key = 'status' AND result_id IN (SELECT id FROM project_task_result WHERE result_type = 'TYPE_SINGLE_APPOINTMENT')

-- changeset id:delete_user_from_ba context:ba
DELETE FROM app_user WHERE tenant_id = 'itzbund'

-- changeset id:delete_user_from_itzbund context:weit
DELETE FROM app_user WHERE tenant_id = 'ba'

--changeset id:update-project-task-form-fields-hint
UPDATE project_task_form_field
SET label = hint, hint = null
WHERE hint is not null
