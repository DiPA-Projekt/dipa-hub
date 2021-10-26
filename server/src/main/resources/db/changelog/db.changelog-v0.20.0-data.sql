--liquibase formatted sql

--changeset id:insert-download_file-Informationssicherheits-Navigator context:weit
INSERT INTO download_file (id, name, description, path)
VALUES (8, 'Informationssicherheits-Navigator', '', 'downloadFiles/Informationssicherheits-Navigator.pdf')
