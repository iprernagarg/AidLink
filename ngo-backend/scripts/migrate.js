// scripts/migrate.js
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('🔄 Checking database connection and migration status...');

    // 1. Ensure migrations tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Query applied migrations
    const appliedRes = await client.query('SELECT version FROM schema_migrations ORDER BY version ASC');
    const appliedVersions = new Set(appliedRes.rows.map(r => r.version));

    // 3. Scan migrations directory
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('No migrations directory found.');
      return;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    let appliedCount = 0;

    for (const file of files) {
      if (!appliedVersions.has(file)) {
        console.log(`⏳ Applying migration: ${file}...`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
          await client.query('COMMIT');
          console.log(`✅ Applied migration: ${file}`);
          appliedCount++;
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(`❌ Migration failed in ${file}:`, err.message);
          throw err;
        }
      } else {
        console.log(`⏩ Migration already applied: ${file}`);
      }
    }

    if (appliedCount === 0) {
      console.log('✨ All migrations are already up to date.');
    } else {
      console.log(`🎉 Successfully applied ${appliedCount} migration(s).`);
    }
  } catch (err) {
    console.error('Fatal migration error:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
