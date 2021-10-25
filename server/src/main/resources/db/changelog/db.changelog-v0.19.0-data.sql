--liquibase formatted sql

--changeset id:update-download_file-file-risk-list-rename context:weit
UPDATE download_file
SET name='Risikoliste', path='downloadFiles/risikoliste.xlsx'
WHERE id=5 AND name = 'ITZBund Risikoliste'

--changeset id:delete-download_file-tracking-list-external-dl context:weit
DELETE FROM download_file
WHERE id=6 AND name= 'Trackingtabelle externe Dienstleistung'