--liquibase formatted sql

--changeset id:insert-user-kolibri-pmo
INSERT INTO app_user (id, name, tenant_id, keycloak_id)
VALUES (10, 'Kolibri PMO', 'itzbund', '5d06a955-5e30-4f0e-bf85-2eb73ba4a32a')

--changeset id:insert-user-kolibri-team
INSERT INTO app_user (id, name, tenant_id, keycloak_id)
VALUES (11, 'Kolibri Team', 'itzbund', '21ce19b5-cc3b-4990-b94f-c02999a05648')

--changeset id:update-project-task-05-form-entry-participants-result-template-responsible-person-key context:itzbund
UPDATE project_task_form_field
SET key = 'responsible_person'
WHERE id = 43

--changeset id:update-project-task-05-form-entry-participants-result-all-fields-responsible-person-key context:itzbund
UPDATE project_task_form_field
SET key = 'responsible_person'
WHERE key = 'responsiblePerson'

-- changeset id:delete_user_from_ba context:ba
DELETE FROM app_user WHERE tenant_id = 'itzbund'

-- changeset id:delete_user_from_itzbund context:itzbund
DELETE FROM app_user WHERE tenant_id = 'ba'
