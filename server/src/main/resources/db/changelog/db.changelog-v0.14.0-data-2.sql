--liquibase formatted sql

-- changeset id:add-column-sort-order-project-task-result
ALTER TABLE project_task_result
ADD COLUMN sort_order BIGINT
DEFAULT 1

-- changeset id:update-column-sort-order-project-task-result-2 context:itzbund
UPDATE project_task_result
SET sort_order = 2
WHERE id = 2

-- changeset id:update-column-sort-order-project-task-result-6 context:itzbund
UPDATE project_task_result
SET sort_order = 2
WHERE id = 8

-- changeset id:create-function context:itzbund
CREATE OR REPLACE FUNCTION createProjectTask(projectName varchar, projectId integer)
RETURNS void AS '
declare
    task_record record;
	form_field_record record;
	option_entry_record record;
	result_record record;
	form_field_record_2 record;
	option_entry_record_2 record;

	new_project_task_id NUMERIC;
	new_project_task_template_id NUMERIC;
	new_project_task_form_field_id NUMERIC;
	new_project_task_result_id NUMERIC;
	new_project_task_form_field_2_id NUMERIC;
BEGIN
    IF (EXISTS (SELECT 1
                       FROM project
                       WHERE (project_size = ''SMALL'' OR project_size = ''MEDIUM'')
                       AND project.id = projectId)
    AND (SELECT count(*)
                     FROM project_task_template as temp JOIN project as project
                     ON temp.project_id = project.id
                     WHERE project.id = projectId) = 0)
    THEN
        INSERT INTO project_task_template (name, project_id, master)
        VALUES (projectName, projectId, false)
        RETURNING id INTO new_project_task_template_id;
        FOR task_record IN (SELECT task.id, title, optional, explanation, contact_person, documentation_link, project_task_template_id, completed, sort_order,
            is_permanent_task, title_permanent_task, icon
            FROM project_task as task JOIN project_task_template as temp
            ON task.project_task_template_id = temp.id
            WHERE temp.master = true)
        LOOP
            INSERT INTO project_task (title, optional, explanation, contact_person, documentation_link, project_task_template_id, completed, sort_order,
            is_permanent_task, title_permanent_task, icon)
            VALUES (task_record.title, task_record.optional, task_record.explanation, task_record.contact_person,task_record.documentation_link,
                    new_project_task_template_id, task_record.completed, task_record.sort_order,
            task_record.is_permanent_task, task_record.title_permanent_task, task_record.icon)
            RETURNING id INTO new_project_task_id;

            FOR form_field_record IN (SELECT form.id, form.value, form.key, form.label, form.hint, form.required, form.sort_order, form.control_type, form.type, form.show,
                                            form.project_task_id
                                           FROM project_task as task JOIN project_task_form_field as form
                                           ON form.project_task_id = task.id
                                           WHERE task.id = task_record.id)
            LOOP
                INSERT INTO project_task_form_field(value, key, label, hint, required, sort_order, control_type, type, show, project_task_id)
                VALUES (form_field_record.value, form_field_record.key, form_field_record.label, form_field_record.hint, form_field_record.required, form_field_record.sort_order,
                        form_field_record.control_type, form_field_record.type, form_field_record.show, new_project_task_id)
                RETURNING id INTO new_project_task_form_field_id;
            FOR option_entry_record IN (SELECT op.id, op.key, op.value, op.form_field_id
                                        FROM option_entry as op JOIN project_task_form_field as form
                                        ON op.form_field_id = form.id
                                        WHERE form.id = form_field_record.id)
                LOOP
                INSERT INTO option_entry(key, value, form_field_id)
                VALUES (option_entry_record.key, option_entry_record.value, new_project_task_form_field_id);
                END LOOP;
            END LOOP;
            FOR result_record IN (SELECT result.id, result_type, project_task_id, result.sort_order
                                  FROM project_task as task JOIN project_task_result as result
                    ON result.project_task_id = task.id
                   WHERE task.id = task_record.id)
            LOOP
            INSERT INTO project_task_result(result_type, project_task_id, sort_order)
            VALUES (result_record.result_type, new_project_task_id, result_record.sort_order)
            RETURNING id INTO new_project_task_result_id;
                FOR form_field_record_2 IN (SELECT form.id, form.value, form.key, form.label, form.hint, form.required, form.sort_order, form.control_type, form.type, form.show,
                                            form.result_id
                                           FROM project_task_result as result JOIN project_task_form_field as form
                                           ON form.result_id = result.id
                       WHERE result.id = result_record.id)
                LOOP
                INSERT INTO project_task_form_field(value, key, label, hint, required, sort_order, control_type, type, show, result_id)
                VALUES (form_field_record_2.value, form_field_record_2.key, form_field_record_2.label, form_field_record_2.hint, form_field_record_2.required, form_field_record_2.sort_order,
                        form_field_record_2.control_type, form_field_record_2.type, form_field_record_2.show, new_project_task_result_id)
                RETURNING id INTO new_project_task_form_field_2_id;
                FOR option_entry_record_2 IN (SELECT op.id, op.key, op.value, op.form_field_id
                                        FROM option_entry as op JOIN project_task_form_field as form
                                        ON op.form_field_id = form.id
                                        WHERE form.id = form_field_record_2.id)
                LOOP
                INSERT INTO option_entry(key, value, form_field_id)
                VALUES (option_entry_record_2.key, option_entry_record_2.value, new_project_task_form_field_2_id);
                END LOOP;
                END LOOP;
            END LOOP;
        END LOOP;
    END IF;
END;
' LANGUAGE plpgsql;

-- changeset id:execute-function-feldberg context:itzbund
SELECT createProjectTask('Projekt Aufgaben Vorlage Feldberg'::varchar, 3)

-- changeset id:execute-function-zugspitze context:itzbund
SELECT createProjectTask('Projekt Aufgaben Vorlage Zugspitze'::varchar, 4)

-- changeset id:execute-function-Bergsteigerausrüstung context:itzbund
SELECT createProjectTask('Projekt Aufgaben Vorlage Bergsteigerausrüstung'::varchar, 5)
