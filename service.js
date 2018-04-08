//import uuid
const uuidv4 = require('uuid/v4');

//Azure Bus
var azure = require('azure');
var path = 'Endpoint=sb://servicequeues.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=AUNiefT6dHz3ivqbYvpteI+LlwvOWE2M0OleRycSXzs=';
var serviceBusService = azure.createServiceBusService(path);

//MySQL stuff
const mysql = require('mysql2');
var config =
    {
        host: 'icon-db.mysql.database.azure.com',
        user: 'wolf@icon-db',
        password: 'EJ6chESAmK',
        port: 3306,
        database: 'groupPermissionDb',
        ssl: true
    };
const conn = new mysql.createConnection(config);
const queureName = "permission"


serviceBusService.receiveQueueMessage((queureName + '-recieve'), function (error, receivedMessage) {
    if (!error) {
        // Message received and deleted
        switch (receivedMessage.type) {
            case "Add_User_Permission":
                addUserPermission(receivedMessage.payload.userId, receivedMessage.payload.permissionId);
                break;
            case "Get_User_Permissions":
                getUserPermissions(receivedMessage.payload.userId);
                break;
            case "Remove_User_Permission":
                removeUserPermission(receivedMessage.payload.userId, receivedMessage.payload.permissionId);
                break;
            case "Add_Group_Permission":
                addGroupPermission(receivedMessage.payload.groupId, receivedMessage.payload.permissionId);
                break;
            case "Get_Group_Permissions":
                getGroupPermissions(receivedMessage.payload.groupId);
                break;
            case "Remove_Group_Permission":
                removeGroupPermission(receivedMessage.payload.groupId, receivedMessage.payload.permissionId)
                break;
            case "Add_Permission":
                addPermission(receivedMessage.payload.permissionText);
                break;
        }
    }
});

//adds a permission to an user
function addUserPermission(userId, permissionId) {
    var sql = "INSERT INTO UserPermission (userId, permissionId) VALUES (?, ?);";
    var values = [userId, permissionId];

    conn.query(sql, values, function (err, results, fields) {
        if (err) throw err;
    });
}
//returns all the permissions of an user
function getUserPermissions(userId) {
    var sql = "SELECT p.permission FROM UserPermission u INNER JOIN Permission p ON u.permissionId == p.permissionId WHERE userId == " + userId;

    conn.query(sql, function (err, results, fields) {
        if (err) {
            throw err;
        } else {
            send(result);
        }
    });
}
//removes a permission from a user
function removeUserPermission(userId, permissionId) {
    var sql = "DELETE FROM UserPermission WHERE userId == " + userId + " AND permissionId == " + permissionId;

    conn.query(sql, function (err, results, fields) {
        if (err) throw err;
    });
}

//adds a permission to a group
function addGroupPermission(groupId, permissionId) {
    var sql = "INSERT INTO GroupPermission (groupId, permissionId) VALUES (?, ?);";
    var values = [groupId, permissionId];

    conn.query(sql, values, function (err, results, fields) {
        if (err) throw err;
    });
}
//returns all the permissions of a group
function getGroupPermissions(groupId) {
    var sql = "SELECT p.permission FROM GroupPermission u INNER JOIN Permission p ON u.permissionId == p.permissionId WHERE userId == " + groupId;

    conn.query(sql, function (err, results, fields) {
        if (err) {
            throw err;
        } else {
            send(result);
        }
    });
}
//removes a permission from a group
function removeGroupPermission(groupId) {
    var sql = "DELETE FROM GroupPermission WHERE groupId == " + groupId + " AND permissionId == " + permissionId;

    conn.query(sql, function (err, results, fields) {
        if (err) throw err;
    });
}

//adds a permission
function addPermission(permissionText) {
    var sql = "INSERT INTO Permission (id, permission) VALUES (?, ?);";
    var values = [uuidv4, permissionText];
    
    conn.query(sql, values, function (err, results, fields) {
        if (err) throw err;
    });
}

//send message
function send(message) {
    serviceBusService.sendQueueMessage((queureName + '-send'), message, function (error) {
    });
}

//loop (request new messages)
function requestMessage() {
    asbService.receiveQueueMessage((queureName + '-recieve'), handleMessage);
}

function handleMessage(error, receivedMessage) {
    if (error) {
        requestMessage();
        return;
    }

    processMessage(receivedMessage);
    requestMessage();
}

function processMessage(message) {
    console.log(message);
}