const express = require('express');
const router = express.Router();
const { updateVolunteerStatus } = require('../controllers/volunteerController');
const verifyToken = require('../middleware/authMiddleware');

router.put('/:id/status', verifyToken, updateVolunteerStatus);

module.exports = router;