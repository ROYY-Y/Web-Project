const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req,res)=>{
    
    try{
        const username = req.user.username
        const userEmail = req.user.useremail

        res.json({username : username, email : userEmail})
    }
    catch(err){
        res.status(500).json({message : 'Error fetching collection data:'})
    }

})

module.exports = router;