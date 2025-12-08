const express = require('express')
const db = require('../config/db')
const router = express.Router()

router.delete('/', async (req,res)=>{
    if (!req.user || !req.user.user_no) {
            return res.status(400).json({ message: 'User not found in token' });
        }

    const user_no = req.user.user_no
    const connection = await db.promise().getConnection()
    try{
    
        await connection.beginTransaction()
        
        await connection.query('DELETE FROM COLLECTION WHERE user_no = ?',[user_no])

        await connection.query('DELETE FROM STAT WHERE user_no = ?',[user_no])

        await connection.query('DELETE FROM USER WHERE user_no = ?',[user_no])


        await connection.commit()

        res.status(200).json({ message: 'Delete user successfully' });
    }

    catch(err){
        connection.rollback()
        console.error(err)
        res.status(500).json({message : 'Delete error ' + err})
    }
    finally{
        connection.release()
    }
    
})

module.exports = router;