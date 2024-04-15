const mysql = require('mysql2');
require('dotenv').config();

var mysqlConnection = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    connectionLimit: 10
});

mysqlConnection.getConnection((err, conn) => {
    if(err) console.log(err)
    console.log("Connected successfully")
})

module.exports = mysqlConnection;