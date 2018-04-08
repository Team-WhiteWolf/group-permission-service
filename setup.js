const mysql = require('mysql2');
var config = {
    host: 'icon-db.mysql.database.azure.com',
    user: 'wolf@icon-db',
    password: 'EJ6chESAmK',
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

            var sql = "DROP DATABASE groupPermissionDb;";
            conn.query(sql, function (err, results, fields) {
                if (err) {
                    throw err;
                }
            });

            sql = [
                "CREATE Database groupPermissionDb;",
                "USE groupPermissionDb CREATE TABLE `GroupPermission` (`groupId` varchar(50) NOT NULL,`permissionId` varchar(50) NOT NULL,PRIMARY KEY (`groupId`,`permissionId`));",
                "USE groupPermissionDb CREATE TABLE `UserPermission` (`userId` varchar(50) NOT NULL,`permissionId` varchar(50) NOT NULL,PRIMARY KEY (`userId`,`permissionId`));",
                "USE groupPermissionDb CREATE TABLE `Permission` (`id` varchar(50) NOT NULL,`permission` varchar(50) NOT NULL,PRIMARY KEY (`id`));",
                "ALTER TABLE `GroupPermission` ADD CONSTRAINT `GroupPermission_fk0` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`);",
                "ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_fk0` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`);",
            ];

            for (var i in sql) {
                conn.query(i, function (err, results, fields) {
                    if (err) {
                        throw err;
                    }
                });
            }

        }
    });

