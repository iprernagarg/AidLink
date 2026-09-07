const pool = require('../config/db');

// 1. Create a new Workshop (NGO Only)
exports.createWorkshop = async (req, res) => {
  try {
    const ngoId = req.user.id;
    const {
      title,
      description,
      date,
      time,
      location,
      city,
      target_capacity,
      form_url
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Workshop title is required.' });
    }

    const result = await pool.query(
      `INSERT INTO workshops (ngo_id, title, description, date, time, location, city, target_capacity, form_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        ngoId,
        title,
        description || '',
        date || '',
        time || '',
        location || '',
        city || '',
        parseInt(target_capacity, 10) || 50,
        form_url || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating workshop:', err);
    res.status(500).json({ error: 'Failed to create workshop.' });
  }
};

// 2. Get All Active Workshops (Public / Supporter)
exports.getAllWorkshops = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        w.id,
        w.ngo_id,
        w.title,
        w.description,
        w.date,
        w.time,
        w.location,
        w.city,
        w.target_capacity,
        w.registered_count,
        w.form_url,
        w.created_at,
        n.org_name,
        n.short_name AS ngo_short_name,
        n.hq AS ngo_city
      FROM workshops w
      LEFT JOIN ngos n ON w.ngo_id = n.id
      ORDER BY w.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching workshops:', err);
    res.status(500).json({ error: 'Failed to fetch workshops.' });
  }
};

// 3. Get Logged-in NGO's Workshops
exports.getMyWorkshops = async (req, res) => {
  try {
    const ngoId = req.user.id;
    const result = await pool.query(
      `SELECT * FROM workshops WHERE ngo_id = $1 ORDER BY created_at DESC`,
      [ngoId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching my workshops:', err);
    res.status(500).json({ error: 'Failed to fetch your workshops.' });
  }
};
