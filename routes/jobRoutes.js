const express = require('express');
const router = express.Router();
const {
  getPublicJobs,
  getJobById,
  getAdminJobs,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.get('/', getPublicJobs);
router.get('/admin/all', protectAdmin, getAdminJobs);
router.get('/:id', getJobById);

router.post('/', protectAdmin, upload.single('companyImageFile'), createJob);
router.put('/:id', protectAdmin, upload.single('companyImageFile'), updateJob);
router.delete('/:id', protectAdmin, deleteJob);

module.exports = router;
