const mysql = require('mysql2');
const dbConfig = require('../config/db.config.js');

// Create the connection for the mySQL database based on the config file.
const db = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
});

// Connect to the mySQL database.
db.connect(function (err) {
  if (err) {
    console.error('MySQL connection error:', err);
    throw err;
  }
  console.log('MySQL Connected!');
});

module.exports = db;
