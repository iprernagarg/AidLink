const pool = require('./config/db');
pool.query("INSERT INTO activities (campaign_id, title, type, location, date, volunteers_assigned, status) VALUES (1, 'Test', 'Distribution', 'Here', '2026-09-01', 0, 'scheduled') RETURNING *")
  .then(res => { console.log(res.rows); process.exit(0); })
  .catch(err => { console.error(err); process.exit(1); });
