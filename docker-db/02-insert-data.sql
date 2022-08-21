-- stepsize.repository inserts

INSERT INTO stepsize.repository
(id, name, code_hosting_provider, creation_date)
VALUES(1, 'repository-1', 'github', '2022-08-13 12:14:10');
INSERT INTO stepsize.repository
(id, name, code_hosting_provider, creation_date)
VALUES(2, 'repository-2', 'bitbucket', '2022-08-13 12:15:32');

-- stepsize.pull_request inserts

INSERT INTO stepsize.pull_request
(code_hosting_provider, pull_request_number, repository, title, status, creation_date, last_updated, description)
VALUES('github', 1, 1, 'Add info to README.md', 'merged', '2022-08-15 18:32:55', '2022-08-18 08:39:54', NULL);
INSERT INTO stepsize.pull_request
(code_hosting_provider, pull_request_number, repository, title, status, creation_date, last_updated, description)
VALUES('github', 4, 1, 'Add more info to README.md', 'merged', '2022-08-16 18:32:55', '2022-08-18 11:51:19', NULL);
INSERT INTO stepsize.pull_request
(code_hosting_provider, pull_request_number, repository, title, status, creation_date, last_updated, description)
VALUES('github', 5, 1, '✨ Add new cool feature', 'open', '2022-08-18 08:38:46', NULL, NULL);
INSERT INTO stepsize.pull_request
(code_hosting_provider, pull_request_number, repository, title, status, creation_date, last_updated, description)
VALUES('bitbucket', 1, 2, 'Feature: Improve CO2 emission calculations for Volkswagen Polo', 'merged', '2022-08-17 14:33:14', NULL, NULL);
INSERT INTO stepsize.pull_request
(code_hosting_provider, pull_request_number, repository, title, status, creation_date, last_updated, description)
VALUES('bitbucket', 2, 2, 'Bug: Properly report COVID infection cases', 'merged', '2022-08-17 14:36:38', NULL, NULL);
INSERT INTO stepsize.pull_request
(code_hosting_provider, pull_request_number, repository, title, status, creation_date, last_updated, description)
VALUES('bitbucket', 4, 2, 'Feature: Wire new framework', 'merged', '2022-08-17 15:22:43', '2022-08-20 18:47:48', NULL);
