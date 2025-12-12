const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', (req, res) => {
  const userNo = req.user && req.user.user_no;
  if (!userNo) return res.status(400).json({ message: 'User id missing' });

  const { rememberVocab, score, missing } = req.body;
  
  if (score === undefined || missing === undefined) {
    return res.status(400).json({ message: 'Missing score or missing count' });
  }
  // insert remembered vocab into COLLECTION
  const insertCollection = (callback) => {
    if (!rememberVocab || rememberVocab.length === 0) {
      return callback(null);
    }

    let completed = 0;
    let errors = [];

    rememberVocab.forEach((vocab) => {
      const vocabNo = vocab.vocab_no;

      const checkSql = 'SELECT * FROM COLLECTION WHERE user_no = ? AND vocab_no = ?';
      db.query(checkSql, [userNo, vocabNo], (err, results) => {
        if (err) {
          errors.push(err);
          completed++;
          if (completed === rememberVocab.length) {
            return callback(errors.length > 0 ? errors[0] : null);
          }
          return;
        }

        if (!results || results.length === 0) {
          const insertSql = 'INSERT INTO COLLECTION (user_no, vocab_no) VALUES (?, ?)';
          db.query(insertSql, [userNo, vocabNo], (err) => {
            if (err) errors.push(err);
            completed++;
            if (completed === rememberVocab.length) {
              callback(errors.length > 0 ? errors[0] : null);
            }
          });
        } else {
          completed++;
          if (completed === rememberVocab.length) {
            callback(null);
          }
        }
      });
    });
  };

  // Step 2: Update STAT 
  const updateStat = (callback) => {
    // fetch STAT
    const fetchSql = 'SELECT sum_correct, sum_wrong FROM STAT WHERE user_no = ?';
    db.query(fetchSql, [userNo], (err, results) => {
      if (err) return callback(err);

      // accumulate scores
      const currentCorrect = (results && results[0]) ? Number(results[0].sum_correct) : 0;
      const currentWrong = (results && results[0]) ? Number(results[0].sum_wrong) : 0;
      
      const newTotalCorrect = currentCorrect + score;
      const newTotalWrong = currentWrong + missing;
      const newTotal = newTotalCorrect + newTotalWrong;
      
      // avg
      const avgScore = newTotal > 0 ? ((newTotalCorrect / newTotal) * 100).toFixed(2) : 0;

      console.log(`DEBUG updateStat - userNo: ${userNo}, currentCorrect: ${currentCorrect}, currentWrong: ${currentWrong}, score: ${score}, missing: ${missing}, newTotalCorrect: ${newTotalCorrect}, newTotalWrong: ${newTotalWrong}, avgScore: ${avgScore}`);

      const sql = `
        UPDATE STAT 
        SET total_play = total_play + 1,
            sum_correct = sum_correct + ?,
            sum_wrong = sum_wrong + ?,
            stat_avg = ?
        WHERE user_no = ?
      `;
      
      db.query(sql, [score, missing, avgScore, userNo], (err, results) => {
        if (err) return callback(err);
        console.log(`DEBUG UPDATE completed - affectedRows: ${results.affectedRows}`);
        callback(null, { totalPlay: results.affectedRows, avg: avgScore });
      });
    });
  };

  insertCollection((err) => {
    if (err) {
      console.error('Error inserting collection:', err);
      return res.status(500).json({ message: 'Error updating collection' });
    }

    updateStat((err, stats) => {
      if (err) {
        console.error('Error updating stat:', err);
        return res.status(500).json({ message: 'Error updating statistics' });
      }

      res.json({ 
        message: 'Result saved successfully',
        stats: stats
      });
    });
  });
});

module.exports = router;