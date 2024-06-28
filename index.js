const express = require('express');
const app = express();
const port = 8088;
const mysql = require('mysql');

// Create the connection for the mySQL database.
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'election_results',
});

// Connect to the mySQL database.
db.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
});

// Listen to the specified port.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
