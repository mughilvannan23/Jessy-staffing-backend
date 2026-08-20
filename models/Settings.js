const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Jessy Agencies' },
    founder: { type: String, default: 'B. Devaraj' },
    tagline: { type: String, default: 'Staffing & HR Solutions' },
    contactEmail: { type: String, default: 'contact@jessyagencies.com' },
    contactPhone: { type: String, default: '8056567352 / 9487577852' },
    officePhone: { type: String, default: '04175-252535' },
    address: { type: String, default: 'No 267, Ramu Army Complex, Vettavalam Road, Enthal Bypass, Tiruvannamalai - 606601' },
    whatsappNumber: { type: String, default: '+918056567352' },
    socialLinks: {
      linkedin: { type: String, default: 'https://linkedin.com' },
      facebook: { type: String, default: 'https://facebook.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      instagram: { type: String, default: 'https://instagram.com' }
    },
    metaTitle: { type: String, default: 'Jessy Agencies - Placement Consultancy & Staffing Services' },
    metaDescription: { type: String, default: 'Jessy Agencies offering School Staffing, Security Guard Deployment, Healthcare Personnel, Home Care Nursing, and Corporate HR Services in Tiruvannamalai.' },
    googleMapsUrl: { type: String, default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15589.673895982885!2d79.0558661!3d12.2274438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bacc084cf73e721%3A0x6732f913d09a2503!2sTiruvannamalai%2C%20Tamil%20Nadu%20606601!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
