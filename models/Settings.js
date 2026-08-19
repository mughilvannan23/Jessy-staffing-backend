const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Jessy Global Staffing & HR Solutions' },
    tagline: { type: String, default: 'Empowering Enterprises with World-Class Talent' },
    contactEmail: { type: String, default: 'info@jessystaffing.com' },
    contactPhone: { type: String, default: '+1 (800) 555-JESSY' },
    address: { type: String, default: '100 Enterprise Boulevard, Suite 500, Financial District, NY 10005' },
    whatsappNumber: { type: String, default: '+18005552739' },
    socialLinks: {
      linkedin: { type: String, default: 'https://linkedin.com' },
      facebook: { type: String, default: 'https://facebook.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      instagram: { type: String, default: 'https://instagram.com' }
    },
    metaTitle: { type: String, default: 'Jessy HR - Premium Staffing & HR Solutions' },
    metaDescription: { type: String, default: 'International Staffing, Executive Search, Security, Healthcare, Corporate, and School HR Outsourcing Services.' },
    googleMapsUrl: { type: String, default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2543635164!2d-74.11976373946229!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
