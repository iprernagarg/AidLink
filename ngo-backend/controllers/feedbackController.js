const pool = require('../config/db');

exports.getFeedback = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.*, c.name as campaign_name 
       FROM feedback f 
       JOIN campaigns c ON f.campaign_id = c.id 
       WHERE c.ngo_id = $1 ORDER BY f.date DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};