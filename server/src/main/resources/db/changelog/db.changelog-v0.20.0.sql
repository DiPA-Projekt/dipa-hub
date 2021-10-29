--liquibase formatted sql

-- changeset id:add-column-is-published-master-id-recurring-event-type
ALTER TABLE recurring_event_type
ADD COLUMN published BOOLEAN DEFAULT true,
ADD COLUMN master_recurring_event_type_id BIGINT

-- changeset id:add-foreign-key-recurring-event-type-master-id
ALTER TABLE recurring_event_type
ADD CONSTRAINT "masterRecurringEventTypeFK"
FOREIGN KEY (master_recurring_event_type_id)
REFERENCES recurring_event_type(id) MATCH SIMPLE
  ON UPDATE CASCADE
  ON DELETE CASCADE
