--liquibase formatted sql
--changeset id:template_Serveraustausch context:ba
INSERT INTO plan_template (id, name, project_id) VALUES (9, 'Serveraustausch Template', 1)

--changeset id:template_Cisco_Router_Nürnberg context:ba
INSERT INTO plan_template (id, name, project_id) VALUES (10, 'Cisco Router Nürnberg Template', 2)

--changeset id:template_Feldberg context:itzbund
INSERT INTO plan_template (id, name, project_id) VALUES (11, 'Feldberg Template', 3)

--changeset id:template_Zugspitze context:itzbund
INSERT INTO plan_template (id, name, project_id) VALUES (12, 'Zugspitze Template', 4)

--changeset id:template_Bergsteigerausrüstung context:itzbund
INSERT INTO plan_template (id, name, project_id) VALUES (13, 'Bergsteigerausrüstung Template', 5)

--changeset id:template_Oranienburg context:ba
INSERT INTO plan_template (id, name, project_id) VALUES (14, 'Routeraustasch Oranienburg Template', 6)

--changeset id:update_master_milestones context:itzbund
UPDATE milestone_template
SET is_master = true
WHERE plan_template_id = 2

--changeset id:milestones_template_Serveraustausch context:ba
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), 9 FROM milestone_template as m2 WHERE plan_template_id = 1

--changeset id:project_Serveraustausch_start_date_end_date context:ba
UPDATE project
SET start_date = NOW(),
    end_date = (
  SELECT NOW() + MAX(date_offset)
  FROM milestone_template WHERE plan_template_id = 9
)
WHERE ID = 1

--changeset id:milestones_template_Cisco_Router_Nürnberg context:ba
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), 10 FROM milestone_template WHERE plan_template_id = 5

--changeset id:project_Cisco_Router_Nürnberg_start_date_end_date context:ba
UPDATE project
SET start_date = NOW(),
    end_date = (
  SELECT NOW() + MAX(date_offset)
  FROM milestone_template WHERE plan_template_id = 10
)
WHERE ID = 2

--changeset id:milestones_template_Feldberg_master_milestones context:itzbund
INSERT INTO milestone_template (name, date_offset, date, is_master, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), true, 11 FROM milestone_template WHERE plan_template_id = 2

--changeset id:milestones_template_Feldberg context:itzbund
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), 11 FROM milestone_template WHERE plan_template_id = 3

--changeset id:project_Feldberg_start_date_end_date context:itzbund
UPDATE project
SET start_date = NOW(),
    end_date = (
  SELECT NOW() + MAX(date_offset)
  FROM milestone_template WHERE plan_template_id = 11
)
WHERE ID = 3

--changeset id:milestones_template_Agil_SWE_master_milestones context:itzbund
INSERT INTO milestone_template (name, date_offset, date, is_master, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), true, 3 FROM milestone_template WHERE plan_template_id = 2

--changeset id:milestones_template_Zugspitze_master_milestones context:itzbund
INSERT INTO milestone_template (name, date_offset, date, is_master, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), true, 12 FROM milestone_template WHERE plan_template_id = 2

--changeset id:milestones_template_Zugspitze context:itzbund
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), 12 FROM milestone_template WHERE plan_template_id = 4

--changeset id:project_Zugspitzeg_start_date_end_date context:itzbund
UPDATE project
SET start_date = NOW(),
    end_date = (
  SELECT NOW() + MAX(date_offset)
  FROM milestone_template WHERE plan_template_id = 12
)
WHERE ID = 4

--changeset id:milestones_template_inkrementell_SWE_master_milestones context:itzbund
INSERT INTO milestone_template (name, date_offset, date, is_master, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), true, 4 FROM milestone_template WHERE plan_template_id = 2

--changeset id:milestones_template_NonStandard_1_inkrementell_SWE_master_milestones context:itzbund
INSERT INTO milestone_template (name, date_offset, date, is_master, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), true, 7 FROM milestone_template WHERE plan_template_id = 2

--changeset id:milestones_template_NonStandard_2_inkrementell_SWE_master_milestones context:itzbund
INSERT INTO milestone_template (name, date_offset, date, is_master, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), true, 8 FROM milestone_template WHERE plan_template_id = 2

--changeset id:milestones_template_Bergsteigerausrüstung context:itzbund
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), 13 FROM milestone_template WHERE plan_template_id = 5

--changeset id:project_Bergsteigerausrüstung_start_date_end_date context:itzbund
UPDATE project
SET start_date = NOW(),
    end_date = (
  SELECT NOW() + MAX(date_offset)
  FROM milestone_template WHERE plan_template_id = 13
)
WHERE ID = 5

--changeset id:milestones_template_Oranienburg context:ba
INSERT INTO milestone_template (name, date_offset, date, plan_template_id) 
SELECT name, date_offset, date_offset + Now(), 14 FROM milestone_template WHERE plan_template_id = 1

--changeset id:project_Oranienburg_start_date_end_date context:ba
UPDATE project
SET start_date = NOW(),
    end_date = (
  SELECT NOW() + MAX(date_offset)
  FROM milestone_template WHERE plan_template_id = 14
)
WHERE ID = 6

-- changeset id:delete_unused_milestones context:itzbund
DELETE FROM milestone_template WHERE plan_template_id = 2;
