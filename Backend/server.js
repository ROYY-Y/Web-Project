// Set up an Express server with CORS and MySQL connection
const express = require('express');
const app = express();
const cors = require('cors'); // Import CORS middleware
const db = require('./config/db'); // Import the database connection
require('dotenv').config({ path: __dirname + '/.env' });// Load environment variables from .env file 

// routes
const loginRouter = require('./routes/login.js');
const collectionRouter = require('./routes/collection.js');


const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

app.use('/login', loginRouter);
// Finish setting up and connection

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});