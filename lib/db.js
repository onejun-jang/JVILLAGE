const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'techave',
  database: 'prac_login',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;




// var mysql = require('mysql2');
// var db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'techave',
//     database: 'prac_login'
// });
// db.connect();

// module.exports = db;

// var mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'techave',
//     database: 'prac_login',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// module.exports = pool.promise();