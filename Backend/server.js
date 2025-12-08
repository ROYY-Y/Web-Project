// Set up an Express server with CORS and MySQL connection
const express = require('express');
const app = express();
const cors = require('cors'); // Import CORS middleware
const db = require('./config/db'); // Import the database connection
require('dotenv').config({ path: __dirname + '/.env' });// Load environment variables from .env file 

// routes
const loginRouter = require('./routes/login.js');
const collectionRouter = require('./routes/collection.js');
const signInRouter = require('./routes/signIn.js')

const profileRouter = require('./routes/profile.js')
const changePasswordRouter = require('./routes/changePassword.js')

const statisticRouter = require('./routes/Statistic.js');

const deleteUserRouter = require('./routes/deleteUser.js');

//middle wares
const autherMdw = require('./middlewares/authorization.js');
const signCheck = require('./middlewares/signIn_check.js');


const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

app.use('/login', loginRouter); // login

app.use('/collection', autherMdw, collectionRouter); // collection

app.use('/signIn', signCheck,signInRouter); // SignIn


app.use('/profile', autherMdw, profileRouter)

app.use('/profile/changePassword', autherMdw, changePasswordRouter)

app.use('/statistic', autherMdw, statisticRouter); // statistic

app.use('/deleteUser', autherMdw, deleteUserRouter);

// Finish setting up and connection

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});