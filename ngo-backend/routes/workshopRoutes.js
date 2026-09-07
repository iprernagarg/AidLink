const express = require('express');
const router = express.Router();
const workshopController = require('../controllers/workshopController');
const { verifyNgo } = require('../middleware/authMiddleware');

// Public / Supporter view of workshops
router.get('/', workshopController.getAllWorkshops);

// NGO specific endpoints (verifyNgo handles token verification and NGO role check)
router.post('/', verifyNgo, workshopController.createWorkshop);
router.get('/my', verifyNgo, workshopController.getMyWorkshops);

module.exports = router;
