--changeset id:reset_id_sequences-3 author:bock dbms:postgresql
--comment: sequence reset is necessary after manual id inserts.
SELECT setval('plan_template_id_seq', (SELECT max(id) FROM plan_template));
SELECT setval('download_file_id_seq', (SELECT max(id) FROM download_file));
SELECT setval('project_approach_id_seq', (SELECT max(id) FROM project_approach));