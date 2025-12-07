const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.patch('/', async (req, res) => {
    try {

        const userNo = req.user.user_no
        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ msg: "Missing fields" });
        }

        const [checkPassword] = await db.promise().query('SELECT * FROM USER WHERE user_no = ? AND userpassword = ?',[userNo,oldPassword])

        if(checkPassword.length <= 0) return res.status(400).json({message : 'Password incorrect'})

        await db.promise().query('UPDATE USER SET userpassword = ? WHERE user_no = ?', [newPassword,userNo])

        res.json({ message: 'Password updated successfully' });
        
    }

    catch (err) {
        console.error(err)
        res.status(500).json({message : 'Patch error'})
    }

})

module.exports = router;