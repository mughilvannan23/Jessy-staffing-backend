const express = require('express');
const router = express.Router();
const {
  submitEnquiry,
  submitRegistration,
  getAdminEnquiries,
  updateEnquiryStatus,
  deleteEnquiry
} = require('../controllers/contactController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.post('/', submitEnquiry);
router.post('/register', upload.single('resume'), submitRegistration);
router.get('/admin/all', protectAdmin, getAdminEnquiries);
router.put('/:id/status', protectAdmin, updateEnquiryStatus);
router.delete('/:id', protectAdmin, deleteEnquiry);

module.exports = router;

