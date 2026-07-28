const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['contact', 'employee', 'employer'], default: 'contact' },
    name: { type: String, required: true, trim: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, default: '' },

    // Employee Registration Specific Fields
    nationality: { type: String, default: '' },
    dob: { type: String, default: '' },
    specialisation: { type: String, default: '' },
    qualificationLevel: { type: String, default: '' },
    preferredContract: { type: String, default: '' },
    linkedIn: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },

    // Employer Registration Specific Fields
    company: { type: String, default: '' },
    jobTitle: { type: String, default: '' },

    consent: { type: Boolean, default: false },
    status: { type: String, enum: ['unread', 'read', 'responded'], default: 'unread' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);

