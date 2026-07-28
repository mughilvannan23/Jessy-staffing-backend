const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    logo: { type: String, required: true },
    website: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', clientSchema);
