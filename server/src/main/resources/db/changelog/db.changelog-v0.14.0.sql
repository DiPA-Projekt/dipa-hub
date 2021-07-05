--liquibase formatted sql

-- changeset id:update_FKUserIdProjectRoleConnection
ALTER TABLE user_project_role_connection
ADD CONSTRAINT FKUserIdProjectRoleConnection
FOREIGN KEY (user_id)
REFERENCES app_user(id)
ON DELETE CASCADE

-- changeset id:update_FKOrganisationRoleUserIdConnection
ALTER TABLE user_organisation_role_connection
ADD CONSTRAINT FKOrganisationRoleUserIdConnection
FOREIGN KEY (user_id)
REFERENCES app_user(id)
ON DELETE CASCADE

-- changeset id:delete_fkuseridprojectroleconnection
ALTER TABLE user_project_role_connection
DROP CONSTRAINT "fkuseridprojectroleconnection"

-- changeset id:delete_fkorganisationroleuseridconnection
ALTER TABLE user_organisation_role_connection
DROP CONSTRAINT "fkorganisationroleuseridconnection"


-- changeset id:delete_constraint_FKUserIdProjectRoleConnection
ALTER TABLE user_project_role_connection
DROP CONSTRAINT "FKUserIdProjectRoleConnection"

-- changeset id:update_constraint_FKUserIdProjectRoleConnection
ALTER TABLE user_project_role_connection
ADD CONSTRAINT "FKUserIdProjectRoleConnection"
FOREIGN KEY (user_id)
REFERENCES app_user(id)
ON DELETE CASCADE

-- changeset id:delete_constraint_FKOrganisationRoleUserIdConnection
ALTER TABLE user_organisation_role_connection
DROP CONSTRAINT "FKOrganisationRoleUserIdConnection"

-- changeset id:update_constraint_FKOrganisationRoleUserIdConnection
ALTER TABLE user_organisation_role_connection
ADD CONSTRAINT "FKOrganisationRoleUserIdConnection"
FOREIGN KEY (user_id)
REFERENCES app_user(id)
ON DELETE CASCADE

-- changeset id:add_column_archived
ALTER TABLE project
ADD archived boolean DEFAULT false

-- changeset id:delete-constraint-FKprojectIdPlanTemplate
ALTER TABLE plan_template
DROP CONSTRAINT "FKprojectIdPlanTemplate"

-- changeset id:update-constraint-FKprojectIdPlanTemplate
ALTER TABLE plan_template
ADD CONSTRAINT "FKprojectIdPlanTemplate"
FOREIGN KEY (project_id)
REFERENCES project(id)
ON DELETE CASCADE

-- changeset id:delete-constraint-FKprojectTaskTemplateProject
ALTER TABLE project_task_template
DROP CONSTRAINT "FKprojectTaskTemplateProject"

-- changeset id:update-constraint-FKprojectTaskTemplateProject
ALTER TABLE project_task_template
ADD CONSTRAINT "FKprojectTaskTemplateProject"
FOREIGN KEY (project_id)
REFERENCES project(id)
ON DELETE CASCADE

-- changeset id:delete-constraint-FKprojectIdIncrement
ALTER TABLE increment
DROP CONSTRAINT "FKprojectIdIncrement"

-- changeset id:update-constraint-FKprojectIdIncrement
ALTER TABLE increment
ADD CONSTRAINT "FKprojectIdIncrement"
FOREIGN KEY (project_id)
REFERENCES project(id)
ON DELETE CASCADE

-- changeset id:delete-constraint-FKprojectIdProjectRole
ALTER TABLE project_role_template
DROP CONSTRAINT "FKprojectIdProjectRole"

-- changeset id:update-constraint-FKprojectIdProjectRole
ALTER TABLE project_role_template
ADD CONSTRAINT "FKprojectIdProjectRole"
FOREIGN KEY (project_id)
REFERENCES project(id)
ON DELETE CASCADE

-- changeset id:delete-constraint-FKmilestone
ALTER TABLE milestone_template
DROP CONSTRAINT "FKmilestone"

-- changeset id:update-constraint-FKmilestone
ALTER TABLE milestone_template
ADD CONSTRAINT "FKmilestone"
FOREIGN KEY (plan_template_id)
REFERENCES plan_template(id)
ON DELETE CASCADE

-- changeset id:delete-constraint-FKprojectTaskTemplateId
ALTER TABLE project_task
DROP CONSTRAINT "FKprojectTaskTemplateId"

-- changeset id:update-constraint-FKprojectTaskTemplateId
ALTER TABLE project_task
ADD CONSTRAINT "FKprojectTaskTemplateId"
FOREIGN KEY (project_task_template_id)
REFERENCES project_task_template(id)
ON DELETE CASCADE

-- changeset id:delete-constraint-FKProjectTaskProjectTaskFormField
ALTER TABLE project_task_form_field
DROP CONSTRAINT "FKProjectTaskProjectTaskFormField"

-- changeset id:update-constraint-FKProjectTaskProjectTaskFormField
ALTER TABLE project_task_form_field
ADD CONSTRAINT "FKProjectTaskProjectTaskFormField"
FOREIGN KEY (project_task_id)
REFERENCES project_task(id)
ON DELETE CASCADE

-- changeset id:update-constraint-FKProjectTaskResultProjectTask
ALTER TABLE project_task_result
ADD CONSTRAINT "FKProjectTaskResultProjectTask"
FOREIGN KEY (project_task_id)
REFERENCES project_task(id)
ON DELETE CASCADE

-- changeset id:delete-constraint-FKprojectRoleTemplate
ALTER TABLE project_role
DROP CONSTRAINT "FKprojectRoleTemplate"

-- changeset id:update-constraint-FKprojectRoleTemplate
ALTER TABLE project_role
ADD CONSTRAINT "FKprojectRoleTemplate"
FOREIGN KEY (project_role_template_id)
REFERENCES project_role_template(id)
ON DELETE CASCADE

-- changeset id:delete-constraint-FKProjectRoleUserIdConnection
ALTER TABLE user_project_role_connection
DROP CONSTRAINT "FKProjectRoleUserIdConnection"

-- changeset id:update-constraint-FKProjectRoleUserIdConnection
ALTER TABLE user_project_role_connection
ADD CONSTRAINT "FKProjectRoleUserIdConnection"
FOREIGN KEY (project_role_id)
REFERENCES project_role(id)
ON DELETE CASCADE

-- changeset id:delete-constraint-FKResultProjectTaskFormField
ALTER TABLE project_task_form_field
DROP CONSTRAINT "FKResultProjectTaskFormField"

-- changeset id:update-constraint-FKResultProjectTaskFormField
ALTER TABLE project_task_form_field
ADD CONSTRAINT "FKResultProjectTaskFormField"
FOREIGN KEY (result_id)
REFERENCES project_task_result(id)
ON DELETE CASCADE

-- changeset id:delete-constraint-FKOptionEntryProjectTaskFormField
ALTER TABLE option_entry
DROP CONSTRAINT "FKOptionEntryProjectTaskFormField"

-- changeset id:update-constraint-FKOptionEntryProjectTaskFormField
ALTER TABLE option_entry
ADD CONSTRAINT "FKOptionEntryProjectTaskFormField"
FOREIGN KEY (form_field_id)
REFERENCES project_task_form_field(id)
ON DELETE CASCADE
