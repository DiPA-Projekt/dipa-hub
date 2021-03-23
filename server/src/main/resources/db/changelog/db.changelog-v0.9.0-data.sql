--liquibase formatted sql
--changeset id:template_Serveraustausch
INSERT INTO plan_template (id, name, project_id) VALUES (9, 'Serveraustausch Template', 1)

--changeset id:template_Cisco_Router_Nürnberg
INSERT INTO plan_template (id, name, project_id) VALUES (10, 'Cisco Router Nürnberg Template', 2)

--changeset id:template_Feldberg
INSERT INTO plan_template (id, name, project_id) VALUES (11, 'Feldberg Template', 3)

--changeset author:template_Zugspitze
INSERT INTO plan_template (id, name, project_id) VALUES (12, 'Zugspitze Template', 4)

--changeset author:template_Bergsteigerausrüstung
INSERT INTO plan_template (id, name, project_id) VALUES (13, 'Bergsteigerausrüstung Template', 5)

--changeset id:template_Oranienburg
INSERT INTO plan_template (id, name, project_id) VALUES (14, 'Routeraustasch Oranienburg Template', 6)

--changeset author:milestones_template_Serveraustausch
INSERT INTO milestone_template (name, date_offset, plan_template_id) 
SELECT name, date_offset, 9 FROM milestone_template WHERE plan_template_id = 1

-- --changeset author:project_Serveraustausch_start_end_date
-- UPDATE project
-- SET (start, end) = (
--   SELECT MIN(date_offset), MAX(date_offset)
--   FROM milestone_template WHERE plan_template_id = 9
-- )
-- WHERE ID = 1

--changeset author:milestones_template_Cisco_Router_Nürnberg
INSERT INTO milestone_template (name, date_offset, plan_template_id) 
SELECT name, date_offset, 10 FROM milestone_template WHERE plan_template_id = 5

--changeset author:milestones_template_Feldberg
INSERT INTO milestone_template (name, date_offset, plan_template_id) 
SELECT name, date_offset, 11 FROM milestone_template WHERE plan_template_id = 3

--changeset author:milestones_template_Zugspitze
INSERT INTO milestone_template (name, date_offset, plan_template_id) 
SELECT name, date_offset, 12 FROM milestone_template WHERE plan_template_id = 4

--changeset author:milestones_template_Bergsteigerausrüstung
INSERT INTO milestone_template (name, date_offset, plan_template_id) 
SELECT name, date_offset, 13 FROM milestone_template WHERE plan_template_id = 5

--changeset author:milestones_template_Oranienburg
INSERT INTO milestone_template (name, date_offset, plan_template_id) 
SELECT name, date_offset, 14 FROM milestone_template WHERE plan_template_id = 1