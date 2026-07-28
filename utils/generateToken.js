const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_staffing_hr_2026_premium_enterprise', {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
