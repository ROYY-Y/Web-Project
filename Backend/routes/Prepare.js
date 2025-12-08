const express = require('express')
const db = require('../config/db.js')
const router = express.Router()

router.get('/', async (req,res)=>{
    const level = req.query.level
    if(!level) return res.status(400).json({ message: 'No level send to server' });

    try{
        const [result] = await db.promise().query('SELECT * FROM VOCABULARY WHERE level = ?', [level])

        res.status(200).json({result})
    }
    catch(err){
        console.error(err)
        res.status(500).json({message : 'Get error'})
    }
})

module.exports = router