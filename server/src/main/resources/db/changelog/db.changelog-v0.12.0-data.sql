--liquibase formatted sql

--changeset id:update_project_is_permanent-project-task-03 context:itzbund
UPDATE project_task
SET icon = 'groups'
WHERE id = 3

--changeset id:update_project_is_permanent-project-task-04 context:itzbund
UPDATE project_task
SET icon = 'schedule'
WHERE id = 4

--changeset id:update_project_is_permanent-project-task-05 context:itzbund
UPDATE project_task
SET icon = 'edit_calendar'
WHERE id = 5

--changeset id:update_project_is_permanent-project-task-06 context:itzbund
UPDATE project_task
SET icon = 'plagiarism'
WHERE id = 6

--changeset id:update_project_is_permanent-project-task-07 context:itzbund
UPDATE project_task
SET icon = 'shopping_cart'
WHERE id = 7

--changeset id:update_project_is_permanent-project-task-08 context:itzbund
UPDATE project_task
SET icon = 'emoji_events'
WHERE id = 8

--changeset id:update_project_is_permanent-project-task-09 context:itzbund
UPDATE project_task
SET icon = 'attach_money'
WHERE id = 9

--changeset id:update_project_is_permanent-project-task-11 context:itzbund
UPDATE project_task
SET icon = 'grading'
WHERE id = 11

--changeset id:update_project_is_permanent-project-task-12 context:itzbund
UPDATE project_task
SET icon = 'warning'
WHERE id = 12

--changeset id:update_default_role_project_role_itzbund context:itzbund
UPDATE project_role
SET default_role = true
WHERE abbreviation = 'PT' OR abbreviation = 'ET'

--changeset id:update_default_role_project_role_ba context:ba
UPDATE project_role
SET default_role = true
WHERE abbreviation = 'PT'
