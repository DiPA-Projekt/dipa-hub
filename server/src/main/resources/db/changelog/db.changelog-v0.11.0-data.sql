--liquibase formatted sql

--changeset id:update-project-task-form-field-contactPerson context:itzbund
UPDATE project_task_form_field
SET label = 'Ansprechpartner', hint = null
WHERE key = 'contactPerson'

--changeset id:update-project-task-form-field-colleage context:itzbund
UPDATE project_task_form_field
SET label = 'Teamkollege', hint = null
WHERE key = 'colleage'

--changeset id:update-project-task-form-field-pt context:itzbund
UPDATE project_task_form_field
SET label = 'Personentage (PT)', hint = null
WHERE key = 'PT'

--changeset id:update-project-task-form-field-serie context:itzbund
UPDATE project_task_form_field
SET label = 'Name der Serie', hint = null
WHERE key = 'serie'

--changeset id:update-project-task-form-field-task-01-documentationLink context:itzbund
UPDATE project_task_form_field
SET label = 'Link zur Angebotsplanungsunterlage', hint = null
WHERE id = 1

--changeset id:update-project-task-form-field-task-03-documentationLink context:itzbund
UPDATE project_task_form_field
SET label = 'Link zur iSAR', hint = null
WHERE id = 17

--changeset id:update-project-task-form-field-task-07-documentationLink context:itzbund
UPDATE project_task_form_field
SET label = 'Link zum Bestellungstool', hint = null
WHERE id = 52

--changeset id:update-project-task-form-field-task-08-documentationLink context:itzbund
UPDATE project_task_form_field
SET label = 'Link zum Abrechnungstool', hint = null
WHERE id = 60

--changeset id:update-project-task-form-field-task-09-documentationLink context:itzbund
UPDATE project_task_form_field
SET label = 'Link zur Trackingtabelle', hint = null
WHERE id = 66

--changeset id:update-project-task-form-field-task-10-documentationLink context:itzbund
UPDATE project_task_form_field
SET label = 'Link zum Service Center', hint = null
WHERE id = 72

--changeset id:update-project-task-form-field-task-11-documentationLink context:itzbund
UPDATE project_task_form_field
SET label = 'Link zum PSB-Tool', hint = null
WHERE id = 78
