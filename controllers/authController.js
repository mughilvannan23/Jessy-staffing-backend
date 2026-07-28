const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

// @desc Auth admin & get token
// @route POST /api/auth/login
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      return res.json({
        success: true,
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id)
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get admin profile
// @route GET /api/auth/profile
const getAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (admin) {
      res.json({ success: true, admin });
    } else {
      res.status(404).json({ success: false, message: 'Admin not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Update admin profile
// @route PUT /api/auth/profile
const updateAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (admin) {
      admin.name = req.body.name || admin.name;
      admin.email = req.body.email || admin.email;
      const updatedAdmin = await admin.save();
      res.json({
        success: true,
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        token: generateToken(updatedAdmin._id)
      });
    } else {
      res.status(404).json({ success: false, message: 'Admin not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Change admin password
// @route PUT /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (admin && (await admin.matchPassword(currentPassword))) {
      admin.password = newPassword;
      await admin.save();
      res.json({ success: true, message: 'Password updated successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid current password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Forgot password
// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'No account with that email exists' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    admin.resetToken = resetToken;
    admin.resetTokenExpire = Date.now() + 3600000; // 1 hour
    await admin.save();

    res.json({
      success: true,
      message: 'Password reset token generated',
      resetToken // Returned for convenience in dev/demo
    });
  } catch (error) {
    next(error);
  }
};

// @desc Reset password
// @route POST /api/auth/reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    const admin = await Admin.findOne({
      resetToken,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    admin.password = newPassword;
    admin.resetToken = null;
    admin.resetTokenExpire = null;
    await admin.save();

    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
  forgotPassword,
  resetPassword
};
