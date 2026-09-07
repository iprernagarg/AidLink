require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/db'); // Import the database connection

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors());
app.use(express.json());

// Existing Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/campaigns', require('./routes/campaignRoutes'));

// New Dashboard Routes
app.use('/api/ngos', require('./routes/ngoRoutes'));
app.use('/api/supporters', require('./routes/supporterRoutes'));
app.use('/api/workshops', require('./routes/workshopRoutes'));
app.use('/api/volunteers', require('./routes/volunteerRoutes'));
app.use('/api', require('./routes/expenseRoutes')); // Mounted at /api for /campaigns/:campaignId/expenses
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// Basic test route
app.get('/', (req, res) => {
  res.send('AidLink API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Test the database connection
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected successfully at:', res.rows[0].now);
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
});