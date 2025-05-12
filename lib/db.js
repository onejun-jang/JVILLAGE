var mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'techave',
    database: 'prac_login'
});
db.connect();

module.exports = db;