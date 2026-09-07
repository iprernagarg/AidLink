const pool = require('../config/db');

exports.addExpense = async (req, res) => {
  const { campaignId } = req.params;
  const { category, vendor, amount, expense_date, note } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO expenses (campaign_id, category, vendor, amount, expense_date, note) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [campaignId, category, vendor, amount, expense_date, note]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};