--liquibase formatted sql

--changeset id:insert-project-approach-swe-small-project context:itzbund
INSERT INTO project_approach (id, name, iterative, operation_type_id)
VALUES (7, 'VMXT ITZBund Kleinprojekte', false, 2)

--changeset id:insert-template-swe-small-project context:itzbund
INSERT INTO plan_template (id, name) VALUES (15, 'VMXT ITZBund Kleinprojekte Template')

--changeset id:insert-connection-template-swe-small-project context:itzbund
INSERT INTO project_approach_plan_template_connection (project_approach_id, plan_template_id) VALUES (7, 15)

--changeset id:milestones-template-swe-small-project-Projekteinrichtung context:itzbund
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
VALUES ('Projekteinrichtung', 14, Now() + 14, 15)

--changeset id:milestones-template-swe-small-project-Projektabschluss context:itzbund
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
VALUES ('Projektabschluss', 180, Now() + 14, 15)
