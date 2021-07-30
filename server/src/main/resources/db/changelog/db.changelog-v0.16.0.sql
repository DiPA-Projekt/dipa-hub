--liquibase formatted sql

-- changeset id:create-table-recurring-type
CREATE TABLE IF NOT EXISTS public.recurring_event_type
(
    id BIGINT NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    title VARCHAR(255),
    description VARCHAR(255),
    mandatory BOOLEAN,
    project_id BIGINT,
    project_property_question_id BIGINT,
    master BOOLEAN,
    CONSTRAINT recurring_event_type_pkey PRIMARY KEY (id),
    CONSTRAINT "recurringTypeProjectFK" FOREIGN KEY (project_id)
        REFERENCES public.project (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "recurringTypeProjectPropertyQuestionFK" FOREIGN KEY (project_property_question_id)
            REFERENCES public.project_property_question (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
)

-- changeset id:create-table-recurring-pattern-template
CREATE TABLE IF NOT EXISTS public.recurring_event_pattern
(
    id BIGINT NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    title VARCHAR(255),
    rule_pattern VARCHAR(255),
    start_date DATE,
    end_date DATE,
    time TIME,
    duration INTEGER,
    recurring_event_type_id BIGINT,
    result_id BIGINT,
    CONSTRAINT recurring_event_pattern_pkey PRIMARY KEY (id),
    CONSTRAINT "recurringPatternProjectTaskResultFK" FOREIGN KEY (result_id)
        REFERENCES public.project_task_result (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "recurringPatternRecurringTypeFK" FOREIGN KEY (recurring_event_type_id)
        REFERENCES public.recurring_event_type (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

-- changeset id:create-table-event
CREATE TABLE IF NOT EXISTS public.event
(
    id BIGINT NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    title VARCHAR(255),
    event_type VARCHAR(255),
    date_time TIMESTAMP,
    duration INTEGER,
    status VARCHAR(255),
    project_id BIGINT,
    recurring_event_type_id BIGINT,
    result_id BIGINT,
    CONSTRAINT event_pkey PRIMARY KEY (id),
    CONSTRAINT "eventProjectFK" FOREIGN KEY (project_id)
        REFERENCES public.project (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "eventProjectTaskResultFK" FOREIGN KEY (result_id)
        REFERENCES public.project_task_result (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "eventRecurringTypeFK" FOREIGN KEY (recurring_event_type_id)
        REFERENCES public.recurring_event_type (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)