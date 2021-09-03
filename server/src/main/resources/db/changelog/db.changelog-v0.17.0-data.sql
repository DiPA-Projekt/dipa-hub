--liquibase formatted sql

-- changeset id:migration-insert-into-final_project_task_template context:itzbund
INSERT INTO final_project_task_template (name, project_id, master)
SELECT CONCAT('Final ', name), project_id, master
FROM public.project_task_template

-- changeset id:migration-final-project-tasks-master context:itzbund
INSERT INTO final_project_task (title, icon, sort_order, final_project_task_template_id, project_task_id)
    select title, icon, 1,
	(SELECT id
    FROM final_project_task_template
    WHERE master = true), project_task_id
    FROM non_permanent_project_task as task
    JOIN non_permanent_project_task_template as template
    ON task.non_permanent_project_task_template_id = template.id
    WHERE title = 'Erledigungsanzeige erstellen und versenden'
    AND master = true

-- changeset id:migration-final-project-tasks context:itzbund
INSERT INTO final_project_task (title, icon, sort_order, final_project_task_template_id, project_task_id)
 select title, icon, 1,
	(SELECT final_template.id
     FROM final_project_task_template as final_template
     JOIN non_permanent_project_task_template as non_permanent_template
     ON final_template.project_id = non_permanent_template.project_id
     WHERE non_permanent_template.id = non_permanent_project_task_template_id
     AND final_template.master = false), project_task_id
    FROM non_permanent_project_task as task
    JOIN non_permanent_project_task_template as template
    ON task.non_permanent_project_task_template_id = template.id
    WHERE master = false AND title = 'Erledigungsanzeige erstellen und versenden'

--changeset id:delete-final-project-task-from-non-permanent-table context:itzbund
DELETE FROM non_permanent_project_task
WHERE title = 'Erledigungsanzeige erstellen und versenden'


