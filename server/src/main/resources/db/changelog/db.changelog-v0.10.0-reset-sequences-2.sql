--changeset id:reset_id_sequences-2 author:becker dbms:postgresql
--comment: sequence reset is necessary after manual id inserts.
SELECT setval('milestone_template_id_seq', (SELECT max(id) FROM milestone_template));
SELECT setval('plan_template_id_seq', (SELECT max(id) FROM plan_template));
SELECT setval('task_template_id_seq', (SELECT max(id) FROM task_template));
SELECT setval('project_approach_id_seq', (SELECT max(id) FROM project_approach));
SELECT setval('download_file_id_seq', (SELECT max(id) FROM download_file));
SELECT setval('project_flow_step_id_seq', (SELECT max(id) FROM project_flow_step));
SELECT setval('external_link_id_seq', (SELECT max(id) FROM external_link));
SELECT setval('project_flow_step_action_id_seq', (SELECT max(id) FROM project_flow_step_action));
SELECT setval('project_flow_step_action_link_id_seq', (SELECT max(id) FROM project_flow_step_action_link));
SELECT setval('project_approach_plan_template_connection_id_seq', (SELECT max(id) FROM project_approach_plan_template_connection));
SELECT setval('operation_type_plan_template_connection_id_seq', (SELECT max(id) FROM operation_type_plan_template_connection));
SELECT setval('project_task_template_id_seq', (SELECT max(id) FROM project_task_template));
SELECT setval('project_task_id_seq', (SELECT max(id) FROM project_task));
SELECT setval('user_group_id_seq', (SELECT max(id) FROM user_group));
SELECT setval('project_task_result_id_seq', (SELECT max(id) FROM project_task_result));
SELECT setval('option_entry_id_seq', (SELECT max(id) FROM option_entry));
SELECT setval('project_task_form_field_id_seq', (SELECT max(id) FROM project_task_form_field));
SELECT setval('project_id_seq', (SELECT max(id) FROM project));
SELECT setval('increment_id_seq', (SELECT max(id) FROM increment));
SELECT setval('project_type_id_seq', (SELECT max(id) FROM operation_type));