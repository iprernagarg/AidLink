const express = require('express');
const router = express.Router();
const { getFeedback } = require('../controllers/feedbackController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, getFeedback);

module.exports = router;