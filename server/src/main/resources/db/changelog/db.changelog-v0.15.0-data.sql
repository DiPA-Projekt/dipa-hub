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


-- changeset id:update-column-task-number-project-task context:itzbund
UPDATE project_task
SET task_number = sort_order
WHERE project_task_template_id = 1

-- changeset id:migration-column-task-number-project-task context:itzbund
UPDATE project_task as task1
SET task_number = task2.task_number
FROM (SELECT *
	  FROM project_task
	  WHERE project_task_template_id = 1) as task2
WHERE task1.title = task2.title

-- changeset id:migration-column-title-project-task context:itzbund
UPDATE project_task
SET title_permanent_task =
CASE WHEN task_number = 13 THEN 'Eskalationen durchführen'
    WHEN task_number = 14 THEN 'Auftragsänderung (Change Request) erstellen'
    ELSE title_permanent_task
END

-- changeset id:migration-column-explanation-project-task context:itzbund
UPDATE project_task
SET explanation =
CASE WHEN task_number = 13 THEN 'Nicht selbst lösbare Probleme werden mit dem Projekteigner oder höheren Instanzen geklärt'
    WHEN task_number = 14 THEN 'Änderungen an den Ressourcen, der Laufzeit oder dem Budget'
    ELSE explanation
END

-- changeset id:migration-insert-into-permanent_project_task_template context:itzbund
INSERT INTO permanent_project_task_template (name, project_id, master)
SELECT CONCAT('Permanent ', name), project_id, master
FROM public.project_task_template

-- changeset id:migration-insert-into-non-permanent_project_task_template context:itzbund
INSERT INTO non_permanent_project_task_template (name, project_id, master)
SELECT CONCAT('Non Permanent ', name), project_id, master
FROM public.project_task_template

-- changeset id:migration-permanent-project-task-master context:itzbund
INSERT INTO permanent_project_task (title, icon, sort_order, is_additional_task, permanent_project_task_template_id, project_task_id)
    select title_permanent_task, icon, sort_order,
    CASE WHEN task_number = 13 OR task_number= 14 then true else false end,
	(SELECT id
    FROM permanent_project_task_template
    WHERE master = true),project_task.id
    FROM project_task as project_task
	JOIN project_task_template as task_template
	ON project_task.project_task_template_id = task_template.id
    WHERE task_template.project_id IS null AND (is_permanent_task = true OR task_number= 13 OR task_number= 14)
	ORDER BY project_task_template_id

-- changeset id:migration-permanent-project-task context:itzbund
INSERT INTO permanent_project_task (title, icon, sort_order, is_additional_task, permanent_project_task_template_id, project_task_id)
    select title_permanent_task, icon, sort_order,
    CASE WHEN task_number = 13 OR task_number= 14 then true else false end,
	(SELECT permanent_task_template.id
	FROM project_task_template as task_template
	JOIN permanent_project_task_template as permanent_task_template
	 ON task_template.project_id = permanent_task_template.project_id
	WHERE project_task.project_task_template_id = task_template.id), project_task.id
    FROM project_task as project_task
	JOIN project_task_template as task_template
	ON project_task.project_task_template_id = task_template.id
    WHERE task_template.project_id IS NOT null AND (is_permanent_task = true OR task_number= 13 OR task_number= 14)
	ORDER BY project_task_template_id

-- changeset id:migration-permanent-project-task-set-new-sort-order context:itzbund
UPDATE permanent_project_task
SET sort_order = CASE
				WHEN sort_order = 3 THEN 1
				WHEN sort_order = 4 THEN 2
				WHEN sort_order = 5 THEN 3
				WHEN sort_order = 6 THEN 4
				WHEN sort_order = 7 THEN 5
				WHEN sort_order = 8 THEN 6
				WHEN sort_order = 9 THEN 7
				WHEN sort_order = 11 THEN 8
				WHEN sort_order = 12 THEN 9
				ELSE -1 END

-- changeset id:migration-non-permanent-project-task-master context:itzbund
INSERT INTO non_permanent_project_task (title, sort_order, non_permanent_project_task_template_id, project_task_id)
    select title, sort_order,
	(SELECT id
    FROM non_permanent_project_task_template
    WHERE master = true), project_task.id
    FROM project_task as project_task
	JOIN non_permanent_project_task_template as task_template
	ON project_task.project_task_template_id = task_template.id
    WHERE task_template.project_id IS null AND task_number != 13 AND task_number != 14
	ORDER BY project_task_template_id

-- changeset id:migration-non-permanent-project-task context:itzbund
INSERT INTO non_permanent_project_task (title, sort_order, non_permanent_project_task_template_id, project_task_id)
    select title, sort_order,
	(SELECT non_permanent_task_template.id
	FROM project_task_template as task_template
	JOIN non_permanent_project_task_template as non_permanent_task_template
	 ON task_template.project_id = non_permanent_task_template.project_id
	WHERE project_task.project_task_template_id = task_template.id), project_task.id
    FROM project_task as project_task
	JOIN project_task_template as task_template
	ON project_task.project_task_template_id = task_template.id
    WHERE task_template.project_id IS NOT null AND task_number != 13 AND task_number != 14
	ORDER BY project_task_template_id

-- changeset id:migration-non-permanent-project-task-set-new-sort-order context:itzbund
UPDATE non_permanent_project_task
SET sort_order = CASE
				WHEN sort_order = 15 THEN 13
				ELSE sort_order END

-- changeset id:delete-columns-project-task
ALTER TABLE project_task
DROP COLUMN IF EXISTS title,
DROP COLUMN IF EXISTS is_permanent_task,
DROP COLUMN IF EXISTS title_permanent_task,
DROP COLUMN IF EXISTS icon
