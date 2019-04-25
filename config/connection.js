var mysql = require('mysql');

var connection;

if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
    connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'project_2_db'
});

};

connection.connect(function(err) {
    if (err) {
        console.error('error connecting' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

console.log(connection.database)
module.exports = connection;