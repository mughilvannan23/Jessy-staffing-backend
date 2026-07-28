const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getAdminApplications,
  updateApplicationStatus,
  deleteApplication
} = require('../controllers/applicationController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

const cpUpload = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'photo', maxCount: 1 }
]);

router.post('/', cpUpload, applyForJob);
router.get('/admin/all', protectAdmin, getAdminApplications);
router.put('/:id/status', protectAdmin, updateApplicationStatus);
router.delete('/:id', protectAdmin, deleteApplication);

module.exports = router;
