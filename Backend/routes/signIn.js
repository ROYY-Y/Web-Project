const express = require('express');
const router = express.Router();
const db = require('../config/db');
require('dotenv').config({ path: __dirname + '/../.env' });// Load environment variables from .env file

router.post('/', async (req,res)=>{
    const {email,username,userpass} = req.body

    const connection = await db.promise().getConnection()

    try{
        await connection.beginTransaction()

        const [insertRes] = await connection.query('INSERT INTO USER(username,userpassword,useremail) VALUES (?,?,?)',
             [username,userpass,email] )

        await connection.query('INSERT INTO STAT VALUES (?,0,0,0,0)',
             [insertRes.insertId])
        
        await connection.commit()

        res.json({message : 'Insert Complete'})

    }
    catch(err){
        await connection.rollback()   
        res.status(500).json({message : 'Failed to insert data in DB'})
    }
    finally{
        connection.release()
    }
})

module.exports = router