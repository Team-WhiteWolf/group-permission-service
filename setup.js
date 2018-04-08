const mysql = require('mysql2');
var config = {
    host: 'ww-data-host.mysql.database.azure.com',
    user: 'database@ww-data-host',
    password: 'uJHeCu3P!',
    port: 3306,
    ssl: true
};
const conn = new mysql.createConnection(config);

conn.connect(
    function (err) {
        if (err) {
            console.log("!!! Cannot connect !!! Error:");
            throw err;
        }
        else {
            console.log("Connection established.");

            var sql = "DROP DATABASE IF EXISTS groupPermissionDb;";
            conn.query(sql, function (err, results, fields) {
                if (err) {
                    throw err;
                }
            });

            sql = "CREATE Database groupPermissionDb;";
            conn.query(sql, function (err, results, fields) {
                if (err) {
                    throw err;
                }
            });

            sql = "USE groupPermissionDb;";
            conn.query(sql, function (err, results, fields) {
                if (err) {
                    throw err;
                }
            });

            sql = "CREATE TABLE `GroupPermission` (`groupId` varchar(50) NOT NULL,`permissionId` varchar(50) NOT NULL,PRIMARY KEY (`groupId`,`permissionId`));";
            conn.query(sql, function (err, results, fields) {
                if (err) {
                    throw err;
                }
            });


            sql = "CREATE TABLE `UserPermission` (`userId` varchar(50) NOT NULL,`permissionId` varchar(50) NOT NULL,PRIMARY KEY (`userId`,`permissionId`));";
            conn.query(sql, function (err, results, fields) {
                if (err) {
                    throw err;
                }
            });


            sql = "CREATE TABLE `Permission` (`id` varchar(50) NOT NULL,`permission` varchar(50) NOT NULL,PRIMARY KEY (`id`));";
            conn.query(sql, function (err, results, fields) {
                if (err) {
                    throw err;
                }
            });

            sql = "ALTER TABLE `GroupPermission` ADD CONSTRAINT `GroupPermission_fk0` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`);"
            conn.query(sql, function (err, results, fields) {
                if (err) {
                    throw err;
                }
            });

            sql = "ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_fk0` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`);"
            conn.query(sql, function (err, results, fields) {
                if (err) {
                    throw err;
                }
            });
        }

    }
    );

