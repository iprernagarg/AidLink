// scripts/seed.js
const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function seedDatabase() {
  const client = await pool.connect();
  try {
    console.log('🌱 Starting development seed...');

    const saltRounds = 10;
    const defaultDevPassword = 'DevPass123!';
    const passwordHash = await bcrypt.hash(defaultDevPassword, saltRounds);

    await client.query('BEGIN');

    // 1. Seed NGOs
    console.log('  -> Seeding NGOs...');
    const ngoRes = await client.query(`
      INSERT INTO ngos (
        org_name, contact_name, email, password_hash, darpan_id, 
        verification_status, role, short_name, hq, founded, tagline,
        reg_type, pan, fcra, status_80g, sectors, verification, team, docs
      ) VALUES 
      (
        'Hope Foundation India', 
        'Ananya Sharma', 
        'ngo.hope@example.com', 
        $1, 
        'DL/2020/0123456', 
        'APPROVED', 
        'NGO', 
        'Hope India', 
        'New Delhi', 
        2015, 
        'Empowering vulnerable communities in disaster zones.',
        'Trust', 
        'AAATH1234E', 
        'FCRA-998877', 
        'Active', 
        '["Disaster Relief", "Education", "Healthcare"]'::jsonb,
        '{"status": "APPROVED", "reviewedBy": "Admin System"}'::jsonb,
        '[{"name": "Ananya Sharma", "role": "Director"}, {"name": "Vikram Sen", "role": "Operations"}]'::jsonb,
        '[]'::jsonb
      ),
      (
        'Seva Relief Network', 
        'Rohan Verma', 
        'ngo.pending@example.com', 
        $1, 
        'MH/2022/0654321', 
        'PENDING', 
        'NGO', 
        'Seva Relief', 
        'Mumbai', 
        2021, 
        'Rapid grassroots relief during natural crises.',
        'Society', 
        'AAATS5678F', 
        'Pending', 
        'Applied', 
        '["Emergency Logistics", "Food Security"]'::jsonb,
        '{"status": "PENDING"}'::jsonb,
        '[{"name": "Rohan Verma", "role": "Founder"}]'::jsonb,
        '[]'::jsonb
      )
      ON CONFLICT (email) DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        verification_status = EXCLUDED.verification_status
      RETURNING id, org_name, email;
    `, [passwordHash]);

    const approvedNgoId = ngoRes.rows.find(r => r.email === 'ngo.hope@example.com')?.id || ngoRes.rows[0].id;

    // 2. Seed Supporters
    console.log('  -> Seeding Supporters...');
    const supporterRes = await client.query(`
      INSERT INTO supporters (
        full_name, email, password_hash, aadhaar_id, city, state, help_types, role
      ) VALUES 
      (
        'Rahul Mehta (Test Supporter)', 
        'supporter.rahul@example.com', 
        $1, 
        'TEST-AADHAAR-001', 
        'Chandigarh', 
        'Punjab', 
        ARRAY['volunteering', 'logistics', 'goods'], 
        'SUPPORTER'
      ),
      (
        'Priya Patel (Test Supporter)', 
        'supporter.priya@example.com', 
        $1, 
        'TEST-AADHAAR-002', 
        'Patiala', 
        'Punjab', 
        ARRAY['volunteering'], 
        'SUPPORTER'
      )
      ON CONFLICT (email) DO UPDATE SET 
        password_hash = EXCLUDED.password_hash
      RETURNING id, full_name, email;
    `, [passwordHash]);

    const rahulId = supporterRes.rows.find(r => r.email === 'supporter.rahul@example.com')?.id || supporterRes.rows[0].id;

    // 3. Seed Campaigns
    console.log('  -> Seeding Campaigns...');
    const campaignCheck = await client.query('SELECT id FROM campaigns WHERE ngo_id = $1 LIMIT 1', [approvedNgoId]);
    let campaignId;

    if (campaignCheck.rows.length === 0) {
      const campRes = await client.query(`
        INSERT INTO campaigns (
          ngo_id, name, disaster, region, status, objective, target_households, 
          start_date, health, progress, is_urgent, beneficiaries
        ) VALUES 
        (
          $1, 
          'Assam Flood Emergency Relief & Rehabilitation', 
          'Flood', 
          'Brahmaputra Valley, Assam', 
          'active', 
          'Providing direct emergency food kits, clean water filters, and temporary shelters to 2,500 flood-displaced families.', 
          2500, 
          '2026-08-15', 
          'on_track', 
          65, 
          true, 
          '{"note": "Initial distribution completed across 4 districts", "districts": ["Dhemaji", "Barpeta", "Morigaon"], "genderSplit": {"male": 1200, "other": 50, "female": 1350}, "householdsReached": 1625, "individualsReached": 6500, "vulnerableGroupsCovered": ["Elderly", "Infants"]}'::jsonb
        ),
        (
          $1, 
          'Himalayan Winter Shelter & Warm Clothes Drive', 
          'Extreme Cold Wave', 
          'Chamoli, Uttarakhand', 
          'draft', 
          'Distributing high-grade insulation blankets and warm clothing kits before severe snowfall.', 
          800, 
          '2026-10-01', 
          'not_started', 
          0, 
          false, 
          '{"note": "Procurement phase", "districts": ["Chamoli"], "genderSplit": {"male": 0, "other": 0, "female": 0}, "householdsReached": 0, "individualsReached": 0, "vulnerableGroupsCovered": []}'::jsonb
        )
        RETURNING id, name;
      `, [approvedNgoId]);
      campaignId = campRes.rows[0].id;
    } else {
      campaignId = campaignCheck.rows[0].id;
    }

    // 4. Seed Donations
    console.log('  -> Seeding Donations...');
    await client.query(`
      INSERT INTO donations (campaign_id, ngo_id, donor, amount, purpose, method)
      VALUES 
        ($1, $2, 'Aarav Gupta', 5000.00, 'Emergency Rations', 'UPI'),
        ($1, $2, 'Sneha Roy', 12500.00, 'Medical Supplies', 'Card'),
        ($1, $2, 'Corporate Care CSR', 50000.00, 'Water Purification Units', 'NetBanking')
      ON CONFLICT DO NOTHING;
    `, [campaignId, approvedNgoId]);

    // 5. Seed Expenses & Evidence
    console.log('  -> Seeding Expenses & Evidence...');
    const expRes = await client.query(`
      INSERT INTO expenses (campaign_id, category, vendor, amount, expense_date, note, status, evidence_linked)
      VALUES 
        ($1, 'Food Rations', 'Assam Agro Wholesalers', 45000.00, '2026-08-20', 'Procured 500 bulk emergency grain kits', 'verified', true),
        ($1, 'Logistics', 'Northeast Transport Co.', 12000.00, '2026-08-22', 'Truck freight from Guwahati to Dhemaji', 'verified', false)
      RETURNING id;
    `, [campaignId]);

    if (expRes.rows.length > 0) {
      await client.query(`
        INSERT INTO evidence (campaign_id, title, document_type, file_path, linked_expense_id, uploaded_by, linked_to)
        VALUES 
          ($1, 'Invoice - Grain Supplies', 'Invoice / Receipt', 'uploads/sample_invoice.pdf', $2, 'Hope Operations Team', 'Assam Agro Wholesalers')
        ON CONFLICT DO NOTHING;
      `, [campaignId, expRes.rows[0].id]);
    }

    // 6. Seed Volunteers
    console.log('  -> Seeding Volunteers...');
    await client.query(`
      INSERT INTO volunteers (campaign_id, supporter_id, name, role, skills, hours_logged, status)
      VALUES 
        ($1, $2, 'Rahul Mehta', 'Relief Distribution Lead', '["First Aid", "Supply Chain", "Crowd Control"]'::jsonb, 18, 'approved')
      ON CONFLICT DO NOTHING;
    `, [campaignId, rahulId]);

    // 7. Seed Resources
    console.log('  -> Seeding Resources...');
    await client.query(`
      INSERT INTO resources (campaign_id, name, source, allocated, deployed, unit)
      VALUES 
        ($1, 'Family Ration Kits', 'Central Warehouse', 2000, 1450, 'Kits'),
        ($1, 'Chlorine Water Purification Tablets', 'Red Cross Donation', 10000, 7200, 'Tablets'),
        ($1, 'Tarpaulin Tents', 'State Disaster Authority', 500, 380, 'Units')
      ON CONFLICT DO NOTHING;
    `, [campaignId]);

    // 8. Seed Feedback
    console.log('  -> Seeding Feedback...');
    await client.query(`
      INSERT INTO feedback (campaign_id, name, source, comment, dimensions)
      VALUES 
        ($1, 'Village Council Head, Dhemaji', 'Community Meeting', 'Water filters were deployed within 48 hours of flood peaks. Truly lifesaving.', '{"timeliness": 5, "quality": 5, "transparency": 5}'::jsonb)
      ON CONFLICT DO NOTHING;
    `, [campaignId]);

    // 9. Seed Activities
    console.log('  -> Seeding Activities...');
    await client.query(`
      INSERT INTO activities (campaign_id, title, type, activity_date, location, volunteers_assigned, status, notes)
      VALUES 
        ($1, 'Emergency Medical Screening Camp', 'Medical Support', '2026-09-12', 'Relief Camp 3, Dhemaji', 6, 'scheduled', 'Screening for waterborne diseases.')
      ON CONFLICT DO NOTHING;
    `, [campaignId]);

    // 10. Seed Workshops
    console.log('  -> Seeding Workshops...');
    await client.query(`
      INSERT INTO workshops (ngo_id, title, description, date, time, location, city, target_capacity, registered_count, form_url)
      VALUES 
        ($1, 'Emergency First Aid & CPR Training', 'Hands-on emergency medical response training for citizen volunteers and first responders in disaster-prone regions.', '2026-09-20', '10:00 AM - 2:00 PM', 'Disaster Prep Center, Civil Lines', 'Patiala', 40, 24, null),
        ($1, 'Disaster Preparedness & Evacuation Drills', 'Comprehensive disaster management workshop covering family evacuation plans, emergency kit assembly, and flood survival.', '2026-09-25', '11:00 AM - 3:30 PM', 'Community Hall, Sector 4', 'Patiala', 60, 38, null),
        ($1, 'WASH & Clean Water Sanitation in Crisis', 'Interactive workshop on water purification methods, emergency chlorination, and community hygiene post-disaster.', '2026-10-02', '09:30 AM - 1:00 PM', 'Red Cross Training Ground', 'Patiala', 50, 19, null)
      ON CONFLICT DO NOTHING;
    `, [approvedNgoId]);

    // 11. Seed Audit Logs & Updates
    console.log('  -> Seeding Audit Logs and Updates...');
    await client.query(`
      INSERT INTO audit_logs (campaign_id, actor, action, detail)
      VALUES 
        ($1, 'Ananya Sharma', 'Campaign Created', 'Initial campaign created with target of 2,500 households.'),
        ($1, 'System', 'Phase 1 Distribution Completed', '1,625 ration kits logged as distributed.')
      ON CONFLICT DO NOTHING;
    `, [campaignId]);

    await client.query(`
      INSERT INTO updates (campaign_id, title, body)
      VALUES 
        ($1, 'Phase 1 Distribution Success in Dhemaji', 'Thanks to on-ground volunteers, 1,625 families across 12 villages have received food ration packages and clean water supply.')
      ON CONFLICT DO NOTHING;
    `, [campaignId]);

    await client.query('COMMIT');
    console.log('✅ Development database seeded successfully!');
    console.log('\n--- 🔑 DEVELOPMENT CREDENTIALS ---');
    console.log('Verified NGO:     ngo.hope@example.com       / DevPass123!');
    console.log('Pending NGO:      ngo.pending@example.com    / DevPass123!');
    console.log('Supporter:        supporter.rahul@example.com / DevPass123! (Aadhaar: TEST-AADHAAR-001)');
    console.log('------------------------------------\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed error:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
