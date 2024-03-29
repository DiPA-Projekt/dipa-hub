--liquibase formatted sql

--changeset id:insert-user-kolibri-pmo
INSERT INTO app_user (id, name, tenant_id, keycloak_id)
VALUES (10, 'Kolibri PMO', 'itzbund', '5d06a955-5e30-4f0e-bf85-2eb73ba4a32a')

--changeset id:insert-user-kolibri-team
INSERT INTO app_user (id, name, tenant_id, keycloak_id)
VALUES (11, 'Kolibri Team', 'itzbund', '21ce19b5-cc3b-4990-b94f-c02999a05648')


--changeset id:update-project-task-05-form-entry-participants-result-template-responsible-person-key context:weit
UPDATE project_task_form_field
SET key = 'responsible_person'
WHERE id = 43

--changeset id:update-project-task-05-form-entry-participants-result-all-fields-responsible-person-key context:weit
UPDATE project_task_form_field
SET key = 'responsible_person'
WHERE key = 'responsiblePerson'

--changeset id:update-project-task-form-field-contactPerson context:weit
UPDATE project_task_form_field
SET label = 'Ansprechpartner', hint = null
WHERE key = 'contactPerson'

--changeset id:update-project-task-form-field-colleage context:weit
UPDATE project_task_form_field
SET label = 'Teamkollege', hint = null
WHERE key = 'colleage'

--changeset id:update-project-task-form-field-pt context:weit
UPDATE project_task_form_field
SET label = 'Personentage (PT)', hint = null
WHERE key = 'PT'

--changeset id:update-project-task-form-field-serie context:weit
UPDATE project_task_form_field
SET label = 'Name der Serie', hint = null
WHERE key = 'serie'

--changeset id:update-project-task-form-field-task-01-documentationLink context:weit
UPDATE project_task_form_field
SET label = 'Link zur Angebotsplanungsunterlage', hint = null
WHERE id = 1

--changeset id:update-project-task-form-field-task-03-documentationLink context:weit
UPDATE project_task_form_field
SET label = 'Link zur iSAR', hint = null
WHERE id = 17

--changeset id:update-project-task-form-field-task-07-documentationLink context:weit
UPDATE project_task_form_field
SET label = 'Link zum Bestellungstool', hint = null
WHERE id = 52

--changeset id:update-project-task-form-field-task-08-documentationLink context:weit
UPDATE project_task_form_field
SET label = 'Link zum Abrechnungstool', hint = null
WHERE id = 60

--changeset id:update-project-task-form-field-task-09-documentationLink context:weit
UPDATE project_task_form_field
SET label = 'Link zur Trackingtabelle', hint = null
WHERE id = 66

--changeset id:update-project-task-form-field-task-10-documentationLink context:weit
UPDATE project_task_form_field
SET label = 'Link zum Service Center', hint = null
WHERE id = 72

--changeset id:update-project-task-form-field-task-11-documentationLink context:weit
UPDATE project_task_form_field
SET label = 'Link zum PSB-Tool', hint = null
WHERE id = 78
