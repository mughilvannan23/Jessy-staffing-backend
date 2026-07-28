const express = require('express');
const router = express.Router();
const {
  getPublicClients,
  getAdminClients,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.get('/', getPublicClients);
router.get('/admin/all', protectAdmin, getAdminClients);

router.post('/', protectAdmin, upload.single('logoFile'), createClient);
router.put('/:id', protectAdmin, upload.single('logoFile'), updateClient);
router.delete('/:id', protectAdmin, deleteClient);

module.exports = router;
