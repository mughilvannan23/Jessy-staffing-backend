const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true }, // e.g. Healthcare, Security, Corporate, School, Home Care
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    employmentType: { type: String, required: true, enum: ['Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Permanent'] },
    experience: { type: String, required: true }, // e.g. "2-5 Years", "Freshers"
    salary: { type: String, required: true }, // e.g. "$4,000 - $6,000 / mo" or "₹35,000 - ₹50,000"
    vacancies: { type: Number, default: 1 },
    qualification: { type: String, required: true },
    skills: [{ type: String }],
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    benefits: [{ type: String }],
    genderPreference: { type: String, default: 'Any' }, // Male, Female, Any
    ageLimit: { type: String, default: '20 - 45 Years' },
    workingHours: { type: String, default: '8 Hours / Shift' },
    status: { type: String, enum: ['published', 'draft', 'closed'], default: 'published' },
    expiryDate: { type: Date },
    isFeatured: { type: Boolean, default: false },
    companyImage: { type: String, default: '' },
    companyName: { type: String, default: 'Apex Global Staffing' },
    publishedDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
