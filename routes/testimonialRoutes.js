const express = require('express');
const router = express.Router();
const {
  getPublicTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.get('/', getPublicTestimonials);
router.get('/admin/all', protectAdmin, getAdminTestimonials);

router.post('/', protectAdmin, upload.single('photoFile'), createTestimonial);
router.put('/:id', protectAdmin, upload.single('photoFile'), updateTestimonial);
router.delete('/:id', protectAdmin, deleteTestimonial);

module.exports = router;
