const pool = require('./config/db');

async function run() {
  try {
    await pool.query(`
      ALTER TABLE donations ADD COLUMN IF NOT EXISTS ngo_id integer REFERENCES ngos(id) ON DELETE SET NULL;
      ALTER TABLE donations ALTER COLUMN campaign_id DROP NOT NULL;
      UPDATE donations d SET ngo_id = c.ngo_id FROM campaigns c WHERE d.campaign_id = c.id AND d.ngo_id IS NULL;
    `);
    console.log('Migration successful: ngo_id added and backfilled on donations table.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();

