const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/profile', protectAdmin, getAdminProfile);
router.put('/profile', protectAdmin, updateAdminProfile);
router.put('/change-password', protectAdmin, changePassword);

module.exports = router;
