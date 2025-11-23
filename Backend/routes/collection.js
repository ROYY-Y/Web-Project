const express = require('express');
const router = express.Router();
const db = require('../config/db');
// GET /collection
router.get('/', async (req, res) => {
    try{
        const [vocab] = await db.promise().query('SELECT * FROM VOCABULARY');
        const [collection] = await db.promise().query('SELECT * FROM COLLECTION WHERE user_no = ?', [req.user.user_no]);

        res.json({vocab: vocab, collection: collection});
        
    } catch (err){
        console.error('Error fetching collection data:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
