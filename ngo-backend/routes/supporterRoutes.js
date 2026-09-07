const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middleware/authMiddleware');
const {
  getSupporterProfile,
  uploadProfileDocument,
  getSupporterDashboardSummary,
  getDiscoverCampaigns,
  getNgosList,
  applyVolunteer,
  getSupporterVolunteering,
  createDonation,
  getSupporterDonations,
  logHours
} = require('../controllers/supporterController');

// Multer storage for volunteer CVs and supporting documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'volunteer_doc_' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const { verifySupporter } = verifyToken;

// Supporter routes protected with verifySupporter or verifyToken
router.get('/profile', verifySupporter, getSupporterProfile);
router.post('/profile/document', verifySupporter, upload.single('document'), uploadProfileDocument);
router.get('/dashboard', verifySupporter, getSupporterDashboardSummary);
router.get('/campaigns', verifyToken, getDiscoverCampaigns);
router.get('/ngos', verifyToken, getNgosList);
router.post('/volunteer', verifySupporter, upload.single('document'), applyVolunteer);
router.get('/volunteering', verifySupporter, getSupporterVolunteering);
router.post('/donate', verifySupporter, createDonation);
router.get('/donations', verifySupporter, getSupporterDonations);
router.post('/log-hours', verifySupporter, logHours);

module.exports = router;
