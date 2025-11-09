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


app.post('/test-post', (req, res) => {
    const {username, password} = req.body;
    const insUser = 'INSERT INTO USER (username, userpassword) VALUES (?, ?)';
    const insSTAT = 'INSERT INTO STAT (user_no,total_play, sum_correct, sum_wrong, stat_avg) VALUES (?, ?, ?, ?, ?)';
    
    db.query(insUser, [username, password], (err, result) => {
        if(err){
            console.error('Error inserting data:', err);
            res.status(500).json({ message: 'Error inserting data' });
        }
        
        const userId = result.insertId;
        console.log('Inserted user with ID:', userId);
        db.query(insSTAT, [userId, 0, 0, 0, 0.0], (err, result) => {
            if(err){
                console.error('Error inserting data into STAT:', err);
                res.status(500).json({ message: 'Error inserting data into STAT' });
            }

            res.json({ message: 'User and STAT inserted successfully', userId: userId });
        });
        
    });

});



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});