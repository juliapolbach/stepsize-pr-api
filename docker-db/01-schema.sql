-- stepsize.repository definition

CREATE TABLE `repository` (
                            `id` int(11) NOT NULL AUTO_INCREMENT,
                            `name` varchar(250) NOT NULL,
                            `code_hosting_provider` enum('github','bitbucket') NOT NULL,
                            `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- stepsize.pull_request definition

CREATE TABLE stepsize.pull_request (
                                     code_hosting_provider ENUM('github','bitbucket') NOT NULL,
                                     pull_request_number INT NOT NULL,
                                     repository int(11) NOT NULL,
                                     title varchar(250) NOT NULL,
                                     status ENUM('open','closed','merged') NOT NULL,
                                     creation_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                     last_updated datetime DEFAULT CURRENT_TIMESTAMP,
                                     description varchar(250) DEFAULT NULL,
                                     CONSTRAINT `FK_D79005394F143414` FOREIGN KEY (`repository`) REFERENCES `repository` (id),
                                     PRIMARY KEY (`code_hosting_provider`,`pull_request_number`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
