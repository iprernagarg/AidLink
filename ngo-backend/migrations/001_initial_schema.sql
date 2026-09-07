-- Migration: 001_initial_schema.sql
-- Description: Create all core tables and constraints for AidLink

-- 1. NGOs Table
CREATE TABLE IF NOT EXISTS ngos (
  id SERIAL PRIMARY KEY,
  org_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  darpan_id VARCHAR(255) NOT NULL UNIQUE,
  verification_status VARCHAR(50) DEFAULT 'PENDING',
  registration_cert_url TEXT,
  supporting_doc_url TEXT,
  role VARCHAR(50) DEFAULT 'NGO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  registration_cert_path VARCHAR(255),
  supporting_doc_path VARCHAR(255),
  short_name VARCHAR(50),
  hq VARCHAR(100),
  founded INTEGER,
  tagline TEXT,
  reg_type VARCHAR(100),
  pan VARCHAR(20),
  fcra VARCHAR(50),
  status_80g VARCHAR(50),
  sectors JSONB,
  verification JSONB,
  team JSONB,
  docs JSONB
);

-- 2. Supporters Table
CREATE TABLE IF NOT EXISTS supporters (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  aadhaar_id VARCHAR(255) NOT NULL UNIQUE,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  help_types TEXT[] NOT NULL,
  role VARCHAR(50) DEFAULT 'SUPPORTER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resume_path VARCHAR(500)
);

-- 3. Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  ngo_id INTEGER REFERENCES ngos(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  disaster VARCHAR(255),
  region VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  objective TEXT,
  target_households INTEGER DEFAULT 0,
  start_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  health VARCHAR(50) DEFAULT 'not_started',
  progress INTEGER DEFAULT 0,
  last_update_published TIMESTAMP,
  beneficiaries JSONB DEFAULT '{"note": "", "districts": [], "genderSplit": {"male": 0, "other": 0, "female": 0}, "householdsReached": 0, "individualsReached": 0, "vulnerableGroupsCovered": []}'::jsonb,
  cover_image_path VARCHAR(255),
  is_urgent BOOLEAN DEFAULT false
);

-- 4. Expenses Table (created before evidence to support FK)
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  vendor VARCHAR(255),
  amount NUMERIC NOT NULL,
  expense_date DATE,
  note TEXT,
  status VARCHAR(50) DEFAULT 'declared',
  evidence_linked BOOLEAN DEFAULT false
);

-- 5. Donations Table
CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  donor VARCHAR(255),
  amount NUMERIC,
  purpose VARCHAR(255),
  method VARCHAR(50),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ngo_id INTEGER REFERENCES ngos(id) ON DELETE SET NULL
);

-- 6. Evidence Table
CREATE TABLE IF NOT EXISTS evidence (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  document_type VARCHAR(100),
  file_path VARCHAR(500) NOT NULL,
  linked_expense_id INTEGER REFERENCES expenses(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by VARCHAR(100) DEFAULT 'System',
  linked_to VARCHAR(255)
);

-- 7. Volunteers Table
CREATE TABLE IF NOT EXISTS volunteers (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  supporter_id INTEGER REFERENCES supporters(id),
  name VARCHAR(255),
  role VARCHAR(150),
  skills JSONB,
  hours_logged INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  applied_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  document_path VARCHAR(500)
);

-- 8. Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  name VARCHAR(255),
  source VARCHAR(150),
  allocated INTEGER DEFAULT 0,
  deployed INTEGER DEFAULT 0,
  unit VARCHAR(50)
);

-- 9. Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  name VARCHAR(255),
  source VARCHAR(100),
  comment TEXT,
  dimensions JSONB,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Impact Reports Table
CREATE TABLE IF NOT EXISTS impact_reports (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  title VARCHAR(255),
  period VARCHAR(100),
  status VARCHAR(50) DEFAULT 'published',
  published_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Activities Table
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  activity_date DATE,
  location VARCHAR(255),
  volunteers_assigned INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'scheduled',
  notes TEXT
);

-- 12. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  actor VARCHAR(100),
  action VARCHAR(255),
  detail TEXT,
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Updates Table
CREATE TABLE IF NOT EXISTS updates (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  title VARCHAR(255),
  body TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Workshops Table
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
