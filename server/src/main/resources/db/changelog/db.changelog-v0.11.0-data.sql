--liquibase formatted sql

--changeset id:update_project_is_permanent-project_default_false context:itzbund
UPDATE project_task
SET is_permanent_task = false
WHERE true

--changeset id:update_project_is_permanent-project-task-03 context:itzbund
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'Besetzungen in iSAR verwalten'
WHERE id = 3

--changeset id:update_project_is_permanent-project-task-04 context:itzbund
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'Regelmäßige Terminserien verwalten'
WHERE id = 4

--changeset id:update_project_is_permanent-project-task-05 context:itzbund
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'Termine verwalten'
WHERE id = 5

--changeset id:update_project_is_permanent-project-task-06 context:itzbund
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'Dokumentationsorte verwalten'
WHERE id = 6

--changeset id:update_project_is_permanent-project-task-07 context:itzbund
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'ELBE Einkaufswagen verwalten'
WHERE id = 7

--changeset id:update_project_is_permanent-project-task-09 context:itzbund
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'Trackingtabelle externe Dienstleistung pflegen'
WHERE id = 9

--changeset id:update_project_is_permanent-project-task-11 context:itzbund
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'Monatlichen Statusbericht erstellen und versenden',
description = 'Erstellung des Statusberichtes für den vorangegangenen Berichtsmonat in iSAR und Freigabe dessen durch den Projekteigner bis zum 10. Tag des Kalendermonats'
WHERE id = 11

--changeset id:update_project_is_permanent-project-task-12 context:itzbund
UPDATE project_task
SET is_permanent_task = true, title_permanent_task = 'Risiken managen'
WHERE id = 12

