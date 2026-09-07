const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { registerSupporter, loginUser, registerNgo, updateNgoStatus, getPendingNgos } = require('../controllers/authController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

const ngoUploadFiles = upload.fields([
  { name: 'registrationCertificate', maxCount: 1 },
  { name: 'supportingDocument', maxCount: 1 },
]);

router.post('/register/individual', registerSupporter);
router.post('/register-ngo', ngoUploadFiles, registerNgo);
router.post('/login', loginUser);
router.put('/admin/ngo-status', updateNgoStatus);
router.get('/admin/ngos/pending', getPendingNgos);

module.exports = router;