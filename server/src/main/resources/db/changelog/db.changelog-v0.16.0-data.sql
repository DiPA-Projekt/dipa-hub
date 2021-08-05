--liquibase formatted sql

--changeset id:insert-recurring-type-tracking-table-template context:itzbund
INSERT INTO public.recurring_event_type(mandatory, master, title, description, project_property_question_id)
SELECT false, true, 'Trackingtabelle externe Dienstleistung pflegen', 'Trackingtabelle externe Dienstleistung pflegen', q.id
FROM public.project_property_question q JOIN public.project_property_question_template t
ON project_property_question_template_id = t.id
WHERE t.master = true AND q.sort_order = 1

--changeset id:insert-recurring-type-tracking-table-template context:ba
INSERT INTO public.recurring_event_type(mandatory, master, title, description)
VALUES (false, true, 'Trackingtabelle externe Dienstleistung pflegen', 'Trackingtabelle externe Dienstleistung pflegen')

--changeset id:insert-recurring-type-risk-template
INSERT INTO public.recurring_event_type(mandatory, master, title, description)
VALUES (false, true, 'Risiken managen', 'Risiken managen')

--changeset id:insert-recurring-type-performance-record-release-template context:itzbund
INSERT INTO public.recurring_event_type(mandatory, master, title, description, project_property_question_id)
SELECT true, true, 'Monatliche Leistungsnachweise freigeben', 'Monatliche Leistungsnachweise freigeben', q.id
FROM public.project_property_question q JOIN public.project_property_question_template t
ON project_property_question_template_id = t.id
WHERE t.master = true AND q.sort_order = 1

--changeset id:insert-recurring-type-performance-record-release-template context:ba
INSERT INTO public.recurring_event_type(mandatory, master, title, description)
VALUES (true, true, 'Monatliche Leistungsnachweise freigeben', 'Monatliche Leistungsnachweise freigeben')

--changeset id:insert-recurring-type-performance-record-send-template
INSERT INTO public.recurring_event_type(mandatory, master, title, description)
VALUES (true, true, 'Monatlichen Statusbericht erstellen und versenden', 'Monatlichen Statusbericht erstellen und versenden')

--changeset id:migration-recurring-type-project-no-property-question context:ba
INSERT INTO public.recurring_event_type(title, description, mandatory, project_id, master)
SELECT recurring_event_type.title, recurring_event_type.description, mandatory, project.id, false
FROM recurring_event_type, project

--changeset id:migration-recurring-type-project-no-property-question context:itzbund
INSERT INTO public.recurring_event_type(title, description, mandatory, project_id, master)
SELECT recurring_event_type.title, recurring_event_type.description, mandatory, project.id, false
FROM recurring_event_type, project
WHERE recurring_event_type.project_property_question_id IS NULL

--changeset id:migration-recurring-type-project-with-property-question context:itzbund
INSERT INTO public.recurring_event_type(title, description, mandatory, project_id, master, project_property_question_id)
SELECT recurring_event_type.title, recurring_event_type.description, mandatory, p.id, false, q.id
FROM recurring_event_type, project p JOIN project_property_question_template t ON project_id = p.id
JOIN project_property_question q ON t.id = q.project_property_question_template_id
WHERE recurring_event_type.project_property_question_id IS NOT NULL AND q.sort_order = 1

--changeset id:insert-recurring-pattern-recurring-type
INSERT INTO public.recurring_event_pattern(recurring_event_type_id, title, rule_pattern, start_date, end_date, start_time, duration)
SELECT t.id, CONCAT('Recurring Pattern ', title), 'FREQ=MONTHLY;BYMONTHDAY=10;INTERVAL=1', DATE(p.start_date), DATE(p.end_date), '08:00:00', null
FROM recurring_event_type t JOIN project p ON t.project_id = p.id

--changeset id:insert-recurring-pattern-recurring-type-master
INSERT INTO public.recurring_event_pattern(recurring_event_type_id, title, rule_pattern, start_date, end_date, start_time, duration)
SELECT t.id, CONCAT('Recurring Pattern ', title), 'FREQ=MONTHLY;BYMONTHDAY=10;INTERVAL=1',  null, null, '08:00:00', null
FROM recurring_event_type t
WHERE t.master = true

--changeset id:fix-documentationLink-label-null context:itzbund
UPDATE public.project_task_form_field
SET label = 'Link'
WHERE key = 'documentationLink' and label = ''

--changeset id:delete-form-field-termin-project-task-appt-series context:itzbund
DELETE FROM project_task_form_field
WHERE label = 'Termin'

--changeset id:insert-form-field-rule-pattern-project-task-appt-series context:itzbund
INSERT INTO project_task_form_field (value, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
SELECT 'FREQ=MONTHLY;BYMONTHDAY=10;INTERVAL=1', 'rule', 'Termin', true, 2, 'TEXTBOX', 'TEXT', true, id
FROM project_task_result
WHERE result_type = 'TYPE_APPT_SERIES'

--changeset id:insert-form-field-start-date-project-task-appt-series context:itzbund
INSERT INTO project_task_form_field (value, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
SELECT '', 'startDate', 'Start', true, 3, 'TEXTBOX', 'DATE', true, id
FROM project_task_result
WHERE result_type = 'TYPE_APPT_SERIES'

--changeset id:insert-form-field-end-date-project-task-appt-series context:itzbund
INSERT INTO project_task_form_field (value, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
SELECT '', 'endDate', 'Ende', true, 4, 'TEXTBOX', 'DATE', true, id
FROM project_task_result
WHERE result_type = 'TYPE_APPT_SERIES'

--changeset id:insert-form-field-start-time-project-task-appt-series context:itzbund
INSERT INTO project_task_form_field (value, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
SELECT '', 'startTime', 'Uhrzeit', true, 5, 'TEXTBOX', 'TIME', true, id
FROM project_task_result
WHERE result_type = 'TYPE_APPT_SERIES'

--changeset id:insert-form-field-duration-project-task-appt-series context:itzbund
INSERT INTO project_task_form_field (value, key, label, required, sort_order, CONTROL_TYPE, type, show, result_id)
SELECT '', 'duration', 'Dauer', true, 6, 'TEXTBOX', 'NUMBER', true, id
FROM project_task_result
WHERE result_type = 'TYPE_APPT_SERIES'

--changeset id:update-form-field-serie-title-required context:itzbund
UPDATE public.project_task_form_field
SET required = true
WHERE id in
(SELECT f.id
FROM project_task_result r
JOIN project_task_form_field f
on r.id = f.result_id
WHERE result_type = 'TYPE_APPT_SERIES'
AND key = 'serie')

--changeset id:update-form-field-participants-sort-order context:itzbund
UPDATE public.project_task_form_field
SET sort_order = 7
WHERE id in
(SELECT f.id
FROM project_task_result r
JOIN project_task_form_field f
on r.id = f.result_id
WHERE result_type = 'TYPE_APPT_SERIES'
AND key = 'participants')

--changeset id:update-form-field-link-sort-order context:itzbund
UPDATE public.project_task_form_field
SET sort_order = 8
WHERE id in
(SELECT f.id
FROM project_task_result r
JOIN project_task_form_field f
on r.id = f.result_id
WHERE result_type = 'TYPE_APPT_SERIES'
AND key = 'link')

--changeset id:update-form-field-note-sort-order context:itzbund
UPDATE public.project_task_form_field
SET sort_order = 9
WHERE id in
(SELECT f.id
FROM project_task_result r
JOIN project_task_form_field f
on r.id = f.result_id
WHERE result_type = 'TYPE_APPT_SERIES'
AND key = 'note')

--changeset id:update-form-field-status-sort-order context:itzbund
UPDATE public.project_task_form_field
SET sort_order = 10
WHERE id in
(SELECT f.id
FROM project_task_result r
JOIN project_task_form_field f
on r.id = f.result_id
WHERE result_type = 'TYPE_APPT_SERIES'
AND key = 'status')