const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ยิงข request มาที่ route นี้เพื่อดึงข้อมูลสถิติของผู้ใช้
router.get('/', (req, res) => {
  const userNo = req.user && req.user.user_no;
  if (!userNo) return res.status(400).json({ message: 'User id missing in token' });

  const sql = 'SELECT total_play, sum_correct, sum_wrong, stat_avg FROM STAT WHERE user_no = ? LIMIT 1';
  db.query(sql, [userNo], (err, results) => {
    if (err) {
      console.error('DB error fetching statistics:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!results || results.length === 0) {
      return res.status(200).json({
        total_play: 0,
        total_word: 0,
        remember_word: 0,
        missing_word: 0,
        average_score: 0.0
      });
    }

   
const row = results[0] || {};
const totalPlay = Number(row.total_play) || 0;
const remember = Number(row.sum_correct) || 0;
const missing = Number(row.sum_wrong) || 0;

const totalWord = remember + missing || 0;

const avg = Number(row.stat_avg) || 0.0;

return res.status(200).json({
  total_play: totalPlay,
  total_word: totalWord,
  remember_word: remember,
  missing_word: missing,
  average_score: avg
});
  });
});

module.exports = router;