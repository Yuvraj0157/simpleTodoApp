const mysql = require('mysql2');
require('dotenv').config();

var mysqlConnection = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    multipleStatements : true
});
module.exports = mysqlConnection;