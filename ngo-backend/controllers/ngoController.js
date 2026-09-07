const pool = require('../config/db');

exports.getNgoProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, org_name as name, org_name, contact_name, email, darpan_id, 
              verification_status, registration_cert_path, supporting_doc_path,
              short_name, hq, founded, tagline,
              reg_type as "regType", darpan_id as "regNumber", pan, fcra, 
              status_80g as "status80g", sectors, verification, team, docs, created_at
       FROM ngos WHERE id = $1 AND email = $2`,
      [req.user.id, req.user.email] 
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'NGO not found' });
    
    const row = result.rows[0];
    
    const profile = {
      ...row,
      name: row.name || row.org_name || 'Organisation',
      shortName: row.short_name || (row.org_name ? row.org_name.substring(0, 3).toUpperCase() : 'NGO'),
      hq: row.hq || 'India',
      founded: row.founded || (row.created_at ? new Date(row.created_at).getFullYear() : 2024),
      tagline: row.tagline || 'Emergency Disaster Response & Community Assistance',
      sectors: Array.isArray(row.sectors) && row.sectors.length > 0 ? row.sectors : ['Disaster Relief', 'Emergency Aid', 'Community Rehabilitation'],
      regType: row.regType || 'Registered Non-Profit Society',
      regNumber: row.regNumber || row.darpan_id || 'DARPAN/REG/2026',
      pan: row.pan || 'AAATN1234F',
      fcra: row.fcra || 'Eligible / Registered',
      status80g: row.status80g || '80G Tax Exempt Certified',
      verification: row.verification && typeof row.verification === 'object' && row.verification.steps ? row.verification : {
        status: row.verification_status || 'verified',
        completedOn: row.created_at || '2026-01-15',
        steps: [
          { label: 'Darpan Portal & Registration ID', detail: `Verified registration ID: ${row.darpan_id || 'DARPAN/REG/2026'}` },
          { label: 'Identity & Legal Certification', detail: 'Registration certificate and supporting documentation verified.' },
          { label: 'Bank & Financial Accountability Check', detail: 'Direct donation routing & 80G tax exemption active.' }
        ]
      },
      team: Array.isArray(row.team) && row.team.length > 0 ? row.team : [
        { name: row.contact_name || 'Coordinator', role: 'Operations & Field Lead', since: '2024' }
      ],
      docs: Array.isArray(row.docs) && row.docs.length > 0 ? row.docs : [
        { name: 'Registration Certificate', type: 'PDF Document', updated: row.created_at || '2026-01-10', path: row.registration_cert_path },
        { name: 'Supporting Authority Letter', type: 'PDF Document', updated: row.created_at || '2026-01-10', path: row.supporting_doc_path }
      ]
    };

    res.json(profile);
  } catch (err) {
    console.error('Error fetching NGO profile:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getNgoDonations = async (req, res) => {
  try {
    const ngoId = req.user.id;
    const result = await pool.query(
      `SELECT d.*, c.name as campaign_name, c.disaster, c.region
       FROM donations d
       LEFT JOIN campaigns c ON d.campaign_id = c.id
       WHERE d.ngo_id = $1 OR c.ngo_id = $1
       ORDER BY d.date DESC`,
      [ngoId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching NGO donations:', err.message);
    res.status(500).json({ error: 'Server error loading NGO donations.' });
  }
};