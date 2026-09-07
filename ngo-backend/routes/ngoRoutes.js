const express = require('express');
const router = express.Router();
const { getNgoProfile, getNgoDonations } = require('../controllers/ngoController');
const verifyToken = require('../middleware/authMiddleware');
const { verifyNgo } = verifyToken;

router.get('/profile', verifyNgo, getNgoProfile);
router.get('/donations', verifyNgo, getNgoDonations);

module.exports = router;
