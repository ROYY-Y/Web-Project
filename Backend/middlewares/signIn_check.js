const db = require('../config/db');
function userValid(req, res, next){
    const username = req.body.username
    db.query('SELECT * FROM USER WHERE username = ?', [username], (err,result) =>{
        if(err){
            return res.status(500).json({ message: 'Internal server error' });
        }
        
        if(result.length >= 1) return res.status(401).json({message : 'Username already exists'})
        else next()
    })
}

module.exports = userValid;