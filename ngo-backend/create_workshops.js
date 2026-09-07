const pool = require('./config/db');

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workshops (
        id SERIAL PRIMARY KEY,
        ngo_id INTEGER REFERENCES ngos(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date VARCHAR(100),
        time VARCHAR(100),
        location VARCHAR(255),
        city VARCHAR(100),
        target_capacity INTEGER DEFAULT 50,
        registered_count INTEGER DEFAULT 0,
        form_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Workshops table created successfully.');

    const check = await pool.query('SELECT count(*) FROM workshops');
    if (parseInt(check.rows[0].count, 10) === 0) {
      const ngoRes = await pool.query('SELECT id FROM ngos LIMIT 1');
      const ngoId = ngoRes.rows[0] ? ngoRes.rows[0].id : null;
      
      await pool.query(`
        INSERT INTO workshops (ngo_id, title, description, date, time, location, city, target_capacity, registered_count, form_url)
        VALUES 
        ($1, 'Emergency First Aid & CPR Training', 'Hands-on emergency medical response training for citizen volunteers and first responders in disaster-prone regions.', '2026-09-20', '10:00 AM - 2:00 PM', 'Disaster Prep Center, Civil Lines', 'Patiala', 40, 24, null),
        ($1, 'Disaster Preparedness & Evacuation Drills', 'Comprehensive disaster management workshop covering family evacuation plans, emergency kit assembly, and flood survival.', '2026-09-25', '11:00 AM - 3:30 PM', 'Community Hall, Sector 4', 'Patiala', 60, 38, null),
        ($1, 'WASH & Clean Water Sanitation in Crisis', 'Interactive workshop on water purification methods, emergency chlorination, and community hygiene post-disaster.', '2026-10-02', '09:30 AM - 1:00 PM', 'Red Cross Training Ground', 'Patiala', 50, 19, null)
      `, [ngoId]);
      console.log('Seeded 3 live workshops.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

migrate();
