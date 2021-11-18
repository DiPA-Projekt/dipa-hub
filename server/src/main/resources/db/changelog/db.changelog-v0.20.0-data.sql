--liquibase formatted sql

--changeset id:insert-download_file-Informationssicherheits-Navigator context:weit
INSERT INTO download_file (id, name, description, path)
VALUES (8, 'Informationssicherheits-Navigator', '', 'downloadFiles/Informationssicherheits-Navigator.pdf')

--changeset id:insert-project-approach-ba-procurement context:weit
INSERT INTO project_approach (id, name, iterative, operation_type_id, project_role_template_id)
VALUES (8, 'BA Lifecycle', false, 3, 1)

--changeset id:insert-template-ba-lifecycle context:weit
INSERT INTO plan_template (id, name) VALUES (16, 'BA Lifecycle Template')

--changeset id:insert-connection-template-ba-lifecycle context:weit
INSERT INTO project_approach_plan_template_connection (project_approach_id, plan_template_id) VALUES (8, 16)

--changeset id:milestones-template-ba-lifecycle-Bedarfsanforderung context:weit dbms:postgresql
INSERT INTO milestone_template (name, date_offset, plan_template_id)
VALUES ('Eingang der bearbeitungsreifen Bedarfsanforderung im ZEK', 0, 16)

--changeset id:milestones-template-ba-lifecycle-CF-Vorlage-bei-Einleitung context:weit dbms:postgresql
INSERT INTO milestone_template (name, date_offset, plan_template_id)
VALUES ('CF-Vorlage bei Einleitung', 20, 16)

--changeset id:milestones-template-ba-lifecycle-Rücklauf-der-CF-Vorlage context:weit dbms:postgresql
INSERT INTO milestone_template (name, date_offset, plan_template_id)
VALUES ('Rücklauf der CF-Vorlage', 30, 16)

--changeset id:milestones-template-ba-lifecycle-Finalisierung-der-LB context:weit dbms:postgresql
INSERT INTO milestone_template (name, date_offset, plan_template_id)
VALUES ('Finalisierung der LB', 90, 16)

--changeset id:milestones-template-ba-lifecycle-Finalisierung-des-Vertrags context:weit dbms:postgresql
INSERT INTO milestone_template (name, date_offset, plan_template_id)
VALUES ('Finalisierung des Vertrags', 99, 16)

--changeset id:milestones-template-ba-lifecycle-Fertigstellung-der-Vergabeunterlagen context:weit dbms:postgresql
INSERT INTO milestone_template (name, date_offset, plan_template_id)
VALUES ('Fertigstellung der Vergabeunterlagen durch operativen Einkauf', 99, 16)

--changeset id:milestones-template-ba-lifecycle-Veröffentlichung context:weit dbms:postgresql
INSERT INTO milestone_template (name, date_offset, plan_template_id)
VALUES ('Veröffentlichung', 106, 16)

--changeset id:milestones-template-ba-lifecycle-Frist-für-Bieterfragen context:weit dbms:postgresql
INSERT INTO milestone_template (name, date_offset, plan_template_id)
VALUES ('Frist für Bieterfragen', 126, 16)

--changeset id:milestones-template-ba-lifecycle-Öffnung-der-Angebote context:weit dbms:postgresql
INSERT INTO milestone_template (name, date_offset, plan_template_id)
VALUES ('Öffnung der Angebote', 173, 16)

--changeset id:milestones-template-ba-lifecycle-Absendung-GZR-Anfrage context:weit dbms:postgresql
INSERT INTO milestone_template (name, date_offset, plan_template_id)
VALUES ('Absendung GZR-Anfrage', 307, 16)

--changeset id:milestones-template-ba-lifecycle-Erstellen-des-Entscheidungsvermerks context:weit dbms:postgresql
INSERT INTO milestone_template (name, date_offset, plan_template_id)
VALUES ('Erstellen des Entscheidungsvermerks und der Vergabeverfügung', 314, 16)

--changeset id:milestones-template-ba-lifecycle-Mitteilung-nach-134-GWB context:weit dbms:postgresql
INSERT INTO milestone_template (name, date_offset, plan_template_id)
VALUES ('Mitteilung nach § 134 GWB', 321, 16)

--changeset id:milestones-template-ba-lifecycle-Vertragsbeginn context:weit dbms:postgresql
INSERT INTO milestone_template (name, date_offset, plan_template_id)
VALUES ('Vertragsbeginn', 350, 16)

--changeset id:update-project_approach-remove-ITZBund-from-name context:weit
UPDATE project_approach AS a
SET name=replace(name, 'ITZBund ', '')

--changeset id:update-plan_template-remove-ITZBund-from-name context:weit
UPDATE plan_template AS a
SET name=replace(name, 'ITZBund ', '')

--changeset id:update-project_approach-remove-BA-from-name context:weit
UPDATE project_approach AS a
SET name=replace(name, 'BA Lifecycle', 'Lifecycle')

--changeset id:update-plan_template-remove-BA-from-name context:weit
UPDATE plan_template AS a
SET name=replace(name, 'BA Lifecycle', 'Lifecycle')