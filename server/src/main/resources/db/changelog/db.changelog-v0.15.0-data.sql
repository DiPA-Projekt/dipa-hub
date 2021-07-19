--liquibase formatted sql

-- changeset id:migration-insert-into-project-question-template context:itzbund
INSERT INTO project_property_question_template (name, project_id, master)
SELECT CONCAT('Property Question ', name), project_id, master
FROM project_task_template

--changeset id:insert-project-question-1 context:itzbund
INSERT INTO project_property_question (question, description, selected, sort_order, project_property_question_template_id)
SELECT 'Werden externe DL benötigt?','Auswirkung auf AeDL und Arbeitsmittel für Externe bestellen', true, 1, id
FROM project_property_question_template

--changeset id:insert-project-question-2 context:itzbund
INSERT INTO project_property_question (question, description, selected, sort_order, project_property_question_template_id)
SELECT 'Arbeitest du mit weiteren Projektteammitgliedern zusammen?','Auswirkung auf Team zusammenstellen und Terminserien', true, 2, id
FROM project_property_question_template

--changeset id:migration-project-task-project-property-question-1-connection-master context:itzbund
UPDATE project_task
SET project_property_question_id =
CASE WHEN sort_order = 8 OR sort_order = 9 OR sort_order = 10 THEN
(SELECT property.id
FROM project_property_question as property JOIN project_property_question_template as property_template
ON property.project_property_question_template_id = property_template.id
JOIN project_task_template as task_template ON property_template.master = task_template.master
WHERE project_task.project_task_template_id = task_template.id AND property.sort_order = 1 AND task_template.master = true)
ELSE project_property_question_id
END

--changeset id:migration-project-task-project-property-question-1-connection context:itzbund
UPDATE project_task
SET project_property_question_id =
CASE WHEN (sort_order = 8 OR sort_order = 9 OR sort_order = 10) AND project_property_question_id IS null THEN
(SELECT property.id
FROM project_property_question as property JOIN project_property_question_template as property_template
ON property.project_property_question_template_id = property_template.id
JOIN project_task_template as task_template ON property_template.project_id = task_template.project_id
WHERE project_task.project_task_template_id = task_template.id AND property.sort_order = 1)
ELSE project_property_question_id
END

--changeset id:migration-project-task-project-property-question-2-connection-master context:itzbund
UPDATE project_task
SET project_property_question_id =
CASE WHEN sort_order = 3 OR sort_order = 4 THEN
(SELECT property.id
FROM project_property_question as property JOIN project_property_question_template as property_template
ON property.project_property_question_template_id = property_template.id
JOIN project_task_template as task_template ON property_template.master = task_template.master
WHERE project_task.project_task_template_id = task_template.id AND property.sort_order = 2 AND task_template.master = true)
ELSE project_property_question_id
END

--changeset id:migration-project-task-project-property-question-2-connection context:itzbund
UPDATE project_task
SET project_property_question_id =
CASE WHEN (sort_order = 3 OR sort_order = 4) AND project_property_question_id IS null THEN
(SELECT property.id
FROM project_property_question as property JOIN project_property_question_template as property_template
ON property.project_property_question_template_id = property_template.id
JOIN project_task_template as task_template ON property_template.project_id = task_template.project_id
WHERE project_task.project_task_template_id = task_template.id AND property.sort_order = 2)
ELSE project_property_question_id
END

