const mysql = require('mysql2');
const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
    host: process.env.DBHOST,
    dialect: 'mysql',
    logging: false
});

// var mysqlConnection = mysql.createPool({
//     host: process.env.DBHOST,
//     user: process.env.DBUSER,
//     password: process.env.DBPASSWORD,
//     database: process.env.DBNAME,
//     connectionLimit: 5,
// });

// mysqlConnection.getConnection((err, conn) => {
//     if(err) console.log(err)
//     console.log("Connected successfully")
// })

// module.exports = mysqlConnection;

module.exports = sequelize;