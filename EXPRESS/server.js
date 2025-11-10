// Set up an Express server with CORS and MySQL connection
const express = require('express');
const app = express();
const cors = require('cors'); // Import CORS middleware
const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables from .env file 

const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies


const db = mysql.createConnection({ // mysql connection setup (using environment variables)
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => { // Connect to the database
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Finish setting up and connection





app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});