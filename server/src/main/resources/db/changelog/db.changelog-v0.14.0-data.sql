--liquibase formatted sql

-- changeset id:delete_user_from_ba context:ba
DELETE FROM app_user WHERE tenant_id = 'itzbund'

-- changeset id:delete_user_from_itzbund context:itzbund
DELETE FROM app_user WHERE tenant_id = 'ba'

--changeset id:update-project-task-form-fields-hint
UPDATE project_task_form_field
SET label = hint, hint = null
WHERE hint is not null