const express = require('express');
const router = express.Router();
const {
  getPublicServices,
  getServiceByIdentifier,
  getAdminServices,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.get('/', getPublicServices);
router.get('/admin/all', protectAdmin, getAdminServices);
router.get('/:identifier', getServiceByIdentifier);

router.post('/', protectAdmin, upload.single('imageFile'), createService);
router.put('/:id', protectAdmin, upload.single('imageFile'), updateService);
router.delete('/:id', protectAdmin, deleteService);

module.exports = router;
