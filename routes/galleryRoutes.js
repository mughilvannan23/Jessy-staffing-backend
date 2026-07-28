const express = require('express');
const router = express.Router();
const {
  getPublicGallery,
  getAdminGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} = require('../controllers/galleryController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.get('/', getPublicGallery);
router.get('/admin/all', protectAdmin, getAdminGallery);

router.post('/', protectAdmin, upload.single('imageFile'), createGalleryItem);
router.put('/:id', protectAdmin, upload.single('imageFile'), updateGalleryItem);
router.delete('/:id', protectAdmin, deleteGalleryItem);

module.exports = router;
