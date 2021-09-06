--liquibase formatted sql

-- changeset id:create-table-final-project-task-template
CREATE TABLE final_project_task_template(
   id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
   name VARCHAR(255),
   master BOOLEAN,
   project_id BIGINT,
   CONSTRAINT "PKfinalProjectTaskTemplate" PRIMARY KEY (id),
   CONSTRAINT "FKfinalProjectTaskTemplateProject"
    FOREIGN KEY (project_id)
    REFERENCES project (id)
    ON DELETE CASCADE
)

-- changeset id:create-table-final-project-task
CREATE TABLE final_project_task(
   id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
   title VARCHAR(255),
   icon VARCHAR(255),
   sort_order BIGINT,
   final_project_task_template_id BIGINT NOT NULL,
   project_task_id BIGINT,
   CONSTRAINT "PKfinalProjectTask" PRIMARY KEY (id),
   CONSTRAINT "FKfinalProjectTaskTemplate"
    FOREIGN KEY (final_project_task_template_id)
    REFERENCES final_project_task_template (id)
    ON DELETE CASCADE,
   CONSTRAINT "FKfinalProjectTaskProjectTask"
    FOREIGN KEY (project_task_id)
    REFERENCES project_task (id)
    ON DELETE CASCADE
)
