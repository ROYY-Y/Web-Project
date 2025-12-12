// อ่านข้อมูล JWT จาก token
function parseJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (payload.length % 4) payload += '=';
    const decoded = atob(payload);
    const json = decodeURIComponent(decoded.split('').map(c => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(json);
  } catch (e) {
    console.warn('parseJwt failed', e);
    return null;
  }
}
// เมื่อเปิดหน้า Result ดึงข้อมูลจาก localStorage
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const rememberVocabStr = localStorage.getItem('rememberVocab');
  const scoreStr = localStorage.getItem('score');
  const missingStr = localStorage.getItem('missing');

  if (!token) {
    console.warn('No token found — redirecting to login');
    window.location.href = 'Login.html';
    return;
  }

  const tokenPayload = parseJwt(token);
  if (!tokenPayload) {
    console.warn('Invalid token — redirecting to login');
    window.location.href = 'Login.html';
    return;
  }

  // แปลงข้อมูลที่ดึงมา
  let rememberVocab = [];
  let score = 0;
  let missing = 0;

  if (rememberVocabStr) {
    try {
      rememberVocab = JSON.parse(rememberVocabStr);
    } catch (e) {
      console.warn('Failed to parse rememberVocab', e);
    }
  }

  score = parseInt(scoreStr) || 0;
  missing = parseInt(missingStr) || 0;

  const totalWord = score + missing;
  const accuracy = totalWord > 0 ? ((score / totalWord) * 100).toFixed(2) : 0;

  // แสดงผลลัพธ์
  displayResult({
    total_word: totalWord,
    remember_word: score,
    missing_word: missing,
    accuracy: accuracy,
    level: localStorage.getItem('level') || 'N/A'
  });

  // บันทึกผลลัพธ์ไปยังฐานข้อมูล
  saveResultToDb(token, tokenPayload.user_no, rememberVocab, score, missing);

  // เมื่อกดปุ่ม Home ให้ล้างข้อมูล rocalStorage 
  const homeBtn = document.getElementById('Homesave');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      localStorage.removeItem('rememberVocab');
      localStorage.removeItem('score');
      localStorage.removeItem('missing');
      localStorage.removeItem('vocab');
      localStorage.removeItem('level');
      console.log('Cleared play data, token retained');
      window.location.href = 'Home.html';
    });
  }
});

function displayResult(playData) {
  const setElement = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.innerText = value == null ? 'NA' : value;
  };

  setElement('.numtotal-word', playData.total_word);
  setElement('.numremember-word', playData.remember_word);
  setElement('.nummissing-word', playData.missing_word);
  setElement('.numaccuracy', playData.accuracy + '%');
  setElement('.N-Level', playData.level);

  // Display stars based on score
  displayStars(playData.remember_word);

  console.log('Result displayed:', playData);
}

function displayStars(score) {
  const star1 = document.querySelector('.Star-1');
  const star2 = document.querySelector('.Star-2');
  const star3 = document.querySelector('.Star-3');

  // Reset all stars
  if (star1) star1.classList.remove('gold');
  if (star2) star2.classList.remove('gold');
  if (star3) star3.classList.remove('gold');

  if (score >= 10) {
    if (star1) star1.classList.add('gold');
    if (star2) star2.classList.add('gold');
    if (star3) star3.classList.add('gold');
  } else if (score >= 7) {
    if (star1) star1.classList.add('gold');
    if (star2) star2.classList.add('gold');
  } else if (score > 3) {
    if (star1) star1.classList.add('gold');
  }
  console.log(`Stars display: ${score} correct answers`);
}

async function saveResultToDb(token, userNo, rememberVocab, score, missing) {
  try {
    const res = await fetch('http://localhost:3000/play-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        rememberVocab: rememberVocab,
        score: score,
        missing: missing
      })
    });

    if (!res.ok) {
      console.error('Failed saving result to DB:', res.status, await res.text());
      return;
    }

    const result = await res.json();
    console.log('Result saved to DB:', result);
  } catch (err) {
    console.error('Error saving result to DB:', err);
  }
}