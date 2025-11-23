const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/../.env' });// Load environment variables from .env file
// GET /login
router.post('/', (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Missing username or password" });
    }


    db.query('SELECT * FROM USER WHERE username = ? AND userpassword = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error during login query:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length <= 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }


        // payload for JWT สำคัญสำหรับการระบุตัวตนของผู้ใช้
        const payload = { user_no : results[0].user_no, username: results[0].username, useremail: results[0].useremail};

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
        
    });

});

module.exports = router;