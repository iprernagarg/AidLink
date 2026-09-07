// scripts/reset.js
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

async function resetDevelopmentDatabase() {
  // Safety Check 1: Environment check
  if (process.env.NODE_ENV === 'production') {
    console.error('🚫 FATAL: Cannot run db:reset in PRODUCTION environment!');
    process.exit(1);
  }

  // Safety Check 2: Connection host/URL safety verification
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbName = process.env.DB_NAME || 'aidlink_db';
  const dbUrl = process.env.DATABASE_URL || '';

  const isLocalHost = dbHost === 'localhost' || dbHost === '127.0.0.1' || dbHost === 'postgres';
  const isProdName = /prod|production/i.test(dbName) || /prod|production/i.test(dbUrl);

  if (isProdName || (!isLocalHost && !process.env.FORCE_DEV_RESET)) {
    console.error(`🚫 SAFETY GUARD: db:reset blocked. Target DB appears non-local (${dbHost}/${dbName}).`);
    console.error('To override for local development, set FORCE_DEV_RESET=true.');
    process.exit(1);
  }

  console.log(`⚠️  RESETTING DATABASE: ${dbName} on ${dbHost}...`);

  const poolConfig = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        database: process.env.DB_NAME || 'aidlink_db',
      };

  const pool = new Pool(poolConfig);
  const client = await pool.connect();

  try {
    console.log('🗑️  Dropping all existing public tables...');
    await client.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);
    console.log('✅ Schema reset clean.');

    // Run Initial Migration
    console.log('🔄 Running initial schema migration...');
    const migrationPath = path.join(__dirname, '..', 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await client.query(sql);

    // Track migration in schema_migrations
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      INSERT INTO schema_migrations (version) VALUES ('001_initial_schema.sql');
    `);
    console.log('✅ Migrations applied successfully.');

    // Run Seed
    console.log('🌱 Seeding development data...');
    const passwordHash = await bcrypt.hash('DevPass123!', 10);

    const ngoRes = await client.query(`
      INSERT INTO ngos (
        org_name, contact_name, email, password_hash, darpan_id, 
        verification_status, role, short_name, hq, founded, tagline,
        reg_type, pan, fcra, status_80g, sectors, verification, team, docs
      ) VALUES 
      (
        'Hope Foundation India', 'Ananya Sharma', 'ngo.hope@example.com', $1, 'DL/2020/0123456', 
        'APPROVED', 'NGO', 'Hope India', 'New Delhi', 2015, 'Empowering vulnerable communities.',
        'Trust', 'AAATH1234E', 'FCRA-998877', 'Active', '["Disaster Relief"]'::jsonb,
        '{"status": "APPROVED"}'::jsonb, '[]'::jsonb, '[]'::jsonb
      ),
      (
        'Seva Relief Network', 'Rohan Verma', 'ngo.pending@example.com', $1, 'MH/2022/0654321', 
        'PENDING', 'NGO', 'Seva Relief', 'Mumbai', 2021, 'Grassroots disaster relief.',
        'Society', 'AAATS5678F', 'Pending', 'Applied', '["Logistics"]'::jsonb,
        '{"status": "PENDING"}'::jsonb, '[]'::jsonb, '[]'::jsonb
      ) RETURNING id, email;
    `, [passwordHash]);

    const approvedNgoId = ngoRes.rows[0].id;

    const supporterRes = await client.query(`
      INSERT INTO supporters (
        full_name, email, password_hash, aadhaar_id, city, state, help_types, role
      ) VALUES 
      (
        'Rahul Mehta (Test Supporter)', 'supporter.rahul@example.com', $1, 'TEST-AADHAAR-001', 
        'Chandigarh', 'Punjab', ARRAY['volunteering', 'goods'], 'SUPPORTER'
      ) RETURNING id;
    `, [passwordHash]);

    const supporterId = supporterRes.rows[0].id;

    const campRes = await client.query(`
      INSERT INTO campaigns (
        ngo_id, name, disaster, region, status, objective, target_households, start_date, health, progress, is_urgent
      ) VALUES 
      (
        $1, 'Assam Flood Emergency Relief & Rehabilitation', 'Flood', 'Assam', 'active', 
        'Emergency ration and shelter kits.', 2500, '2026-08-15', 'on_track', 65, true
      ) RETURNING id;
    `, [approvedNgoId]);

    const campId = campRes.rows[0].id;

    await client.query(`
      INSERT INTO donations (campaign_id, ngo_id, donor, amount, purpose, method)
      VALUES ($1, $2, 'Aarav Gupta', 5000.00, 'Emergency Rations', 'UPI');

      INSERT INTO expenses (campaign_id, category, vendor, amount, expense_date, note, status, evidence_linked)
      VALUES ($1, 'Food Rations', 'Assam Agro Wholesalers', 45000.00, '2026-08-20', '500 bulk grain kits', 'verified', false);

      INSERT INTO volunteers (campaign_id, supporter_id, name, role, skills, hours_logged, status)
      VALUES ($1, $2, 'Rahul Mehta', 'Relief Lead', '["First Aid"]'::jsonb, 18, 'approved');

      INSERT INTO workshops (ngo_id, title, description, date, time, location, city, target_capacity, registered_count)
      VALUES ($2, 'Emergency First Aid & CPR Training', 'Emergency response workshop', '2026-09-20', '10:00 AM - 2:00 PM', 'Civil Lines', 'Patiala', 40, 24);
    `, [campId, approvedNgoId, supporterId]);

    console.log('🎉 Database successfully reset and seeded for development!');
  } catch (err) {
    console.error('❌ Reset failed:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  resetDevelopmentDatabase();
}

module.exports = resetDevelopmentDatabase;
