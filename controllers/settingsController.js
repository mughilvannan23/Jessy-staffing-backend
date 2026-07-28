const Settings = require('../models/Settings');

// @desc Get public website settings
// @route GET /api/settings
const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

// @desc Update website settings (Admin)
// @route PUT /api/settings
const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    const updatedSettings = await settings.save();
    res.json({ success: true, settings: updatedSettings, message: 'Website settings updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings
};
