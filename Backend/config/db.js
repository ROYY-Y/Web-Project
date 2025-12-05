const mysql = require('mysql2');
require('dotenv').config({ path: __dirname +'/../.env' });// Load environment variables from .env file

const db = mysql.createPool({ // mysql connection setup (using environment variables)
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.getConnection((err) => { // Connect to the database
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

module.exports = db;