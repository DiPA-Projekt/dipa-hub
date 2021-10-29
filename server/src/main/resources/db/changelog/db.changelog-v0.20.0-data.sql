--liquibase formatted sql

--changeset id:insert-download_file-Informationssicherheits-Navigator context:weit
INSERT INTO download_file (id, name, description, path)
VALUES (8, 'Informationssicherheits-Navigator', '', 'downloadFiles/Informationssicherheits-Navigator.pdf')

--changeset id:update-recurring_event_type-master_recurring_event_type_id context:weit
UPDATE recurring_event_type AS a
SET master_recurring_event_type_id=(
    SELECT id FROM recurring_event_type AS b
    WHERE a.title=b.title AND b.master=true
)
WHERE a.master=false
