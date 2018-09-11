CREATE TABLE IF NOT EXISTS `be_user` (
  `id`        INT(11) AUTO_INCREMENT NOT NULL,
  `name`      VARCHAR(255) NOT NULL,
  `password`  VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,

  PRIMARY KEY ( `id` )
)Engine=InnoDB DEFAULT CHARSET=utf8;
