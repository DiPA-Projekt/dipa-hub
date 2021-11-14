--liquibase formatted sql

--changeset id:plan_template-drop-uc_plan_templatename_col
ALTER TABLE plan_template DROP CONSTRAINT uc_plan_templatename_col