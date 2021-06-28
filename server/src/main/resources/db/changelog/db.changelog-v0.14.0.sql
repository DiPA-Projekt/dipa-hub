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