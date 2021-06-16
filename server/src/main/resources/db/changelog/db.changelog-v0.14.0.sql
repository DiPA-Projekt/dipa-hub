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