const express = require('express');
const router = express.Router();

// GET /collection
router.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = router;
