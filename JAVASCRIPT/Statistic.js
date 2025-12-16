document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) window.location.href = 'Login.html';

  try {
    const res = await fetch('http://localhost:3000/statistic', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });

    if (!res.ok) {
      console.error('Failed fetching statistics:', res.status);
      return;
    }

    const stat = await res.json();
    console.log('STAT response:', stat); // debug

    const data = stat.statistics || stat;

    const totalPlay = Number(data.total_play) || 0;
    const remember = Number(data.remember_word ?? data.sum_correct) || 0;
    const missing = Number(data.missing_word ?? data.sum_wrong) || 0;
    const totalWord = Number(data.total_word ?? (remember + missing)) || (remember + missing);
    const avg = Number(data.average_score ?? data.stat_avg) || 0;

    const p_avg = document.getElementById('numaverage-score')

    const setP = (selector, value) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const p = el.querySelector('p');
      const text = (value == null || Number.isNaN(Number(value))) ? 'NA' : String(value);
      if (p) p.innerText = text; else el.innerText = text;

    };

    setP('.numtotal-play', totalPlay);
    setP('.numtotal-word', totalWord);
    setP('.numremember-word', remember);
    setP('.nummissing-word', missing);
    setP('.numaverage-score', avg.toFixed(2));

    p_avg.innerText += '%'

  } catch (err) {
    console.error('Error loading statistic:', err);
  }
});