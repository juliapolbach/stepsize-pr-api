-- stepsize.repository inserts

INSERT INTO stepsize.repository
(id, name, code_hosting_provider, creation_date)
VALUES(1, 'repository-1', 'github', '2022-08-13 12:14:10');
INSERT INTO stepsize.repository
(id, name, code_hosting_provider, creation_date)
VALUES(2, 'repository-2', 'bitbucket', '2022-08-13 12:15:32');

-- stepsize.pull_request inserts

INSERT INTO stepsize.pull_request
(code_hosting_provider, pull_request_number, repository, title, status, creation_date, last_updated)
VALUES('bitbucket', 1, 2, 'Fix: Add some config files', 'open', '2022-08-17 14:33:14', '2022-08-17 18:30:22');
INSERT INTO stepsize.pull_request
(code_hosting_provider, pull_request_number, repository, title, status, creation_date, last_updated)
VALUES('bitbucket', 2, 2, 'Feature: Create new track endpoint', 'merged', '2022-08-17 14:36:38', NULL);
