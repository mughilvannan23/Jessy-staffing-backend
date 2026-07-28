const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
    qualification: { type: String, required: true },
    experience: { type: String, required: true },
    expectedSalary: { type: String, default: '' },
    resumeUrl: { type: String, required: true },
    photoUrl: { type: String, default: '' },
    coverLetter: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'reviewed', 'selected', 'rejected'], default: 'pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
