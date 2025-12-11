const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /play-result
// Purpose: Save play result, insert new vocab to collection, and update statistics
router.post('/', (req, res) => {
  const userNo = req.user && req.user.user_no;
  if (!userNo) return res.status(400).json({ message: 'User id missing' });

  const { rememberVocab, score, missing } = req.body;
  
  if (score === undefined || missing === undefined) {
    return res.status(400).json({ message: 'Missing score or missing count' });
  }

  // Step 1: Insert rememberVocab into COLLECTION (only if not already there)
  const insertCollection = (callback) => {
    if (!rememberVocab || rememberVocab.length === 0) {
      // No new vocab to add
      return callback(null);
    }

    let completed = 0;
    let errors = [];

    rememberVocab.forEach((vocab) => {
      const vocabNo = vocab.vocab_no;
      // Check if already in collection
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

        // If not found, insert
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
          // Already in collection, skip
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
    const totalWord = score + missing;
    const avgScore = totalWord > 0 ? ((score / totalWord) * 100).toFixed(2) : 0;

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
      callback(null, { totalPlay: results.affectedRows, avg: avgScore });
    });
  };

  // Execute steps sequentially
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