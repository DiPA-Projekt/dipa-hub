--liquibase formatted sql

--changeset id:insert-project-question-1-feldberg context:itzbund
INSERT INTO project_property_question (question, description, selected, sort_order, project_id)
VALUES ('Werden externe DL benötigt?',
'Auswirkung auf AeDL und Arbeitsmittel für Externe bestellen', true, 1, 3)

--changeset id:insert-project-question-2-feldberg context:itzbund
INSERT INTO project_property_question (question, description, selected, sort_order, project_id)
VALUES ('Arbeitest du mit weiteren Projektteammitgliedern zusammen?',
'Auswirkung auf Team zusammenstellen und Terminserien', true, 2, 3)
