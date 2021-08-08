--liquibase formatted sql

-- changeset id:rename-table-event-template-to-project-event-template
ALTER TABLE event_template
RENAME TO project_event_template

-- changeset id:rename-table-event-to-project-event
ALTER TABLE event
RENAME TO project_event

-- changeset id:rename-column-event-template-to-project-event-template
ALTER TABLE project_event
RENAME event_template_id TO project_event_template_id