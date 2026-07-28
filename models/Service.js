const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, required: true }, // e.g. "School Staffing", "Security Staffing", "Healthcare Staffing", "Home Assistance", "Corporate Staffing", "HR Outsourcing"
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'bi-briefcase-fill' }, // Bootstrap icon name or SVG link
    image: { type: String, default: '' },
    features: [{ type: String }],
    rolesProvided: [{ type: String }], // e.g. ["Teachers", "Lab Assistants", "Principal", "Sports Coach"]
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
