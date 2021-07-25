PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `proctypes` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `descr` VARCHAR(255) NOT NULL, `code` VARCHAR(255) NOT NULL, `requireSurgReport` TINYINT(1) NOT NULL DEFAULT 0, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
INSERT INTO proctypes VALUES(1,'proc1','1234',0,'2021-07-24 22:04:13.764 +00:00','2021-07-24 22:04:13.764 +00:00');
INSERT INTO proctypes VALUES(2,'proc2','2345',1,'2021-07-24 22:04:30.373 +00:00','2021-07-24 22:04:30.373 +00:00');
INSERT INTO proctypes VALUES(3,'proc3','3456',1,'2021-07-24 22:04:42.071 +00:00','2021-07-24 22:04:42.071 +00:00');
INSERT INTO proctypes VALUES(4,'proc4','4567',0,'2021-07-24 22:04:54.023 +00:00','2021-07-24 22:04:54.023 +00:00');
COMMIT;
