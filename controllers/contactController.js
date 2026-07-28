const Contact = require('../models/Contact');
const { processFileUpload } = require('../middlewares/uploadMiddleware');

// @desc Submit user enquiry
// @route POST /api/contact
const submitEnquiry = async (req, res, next) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, subject, and message are required' });
    }

    const contact = new Contact({
      type: 'contact',
      name,
      phone: phone || '',
      email,
      subject,
      message,
      status: 'unread'
    });

    const saved = await contact.save();
    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our HR consultant will get back to you shortly.',
      enquiry: saved
    });
  } catch (error) {
    next(error);
  }
};

// @desc Submit registration (Employee or Employer)
// @route POST /api/contact/register
const submitRegistration = async (req, res, next) => {
  try {
    const {
      type, // 'employee' or 'employer'
      firstName,
      lastName,
      email,
      phone,
      nationality,
      dob,
      specialisation,
      qualificationLevel,
      preferredContract,
      linkedIn,
      company,
      jobTitle,
      message,
      consent
    } = req.body;

    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'First name, last name, email, and phone number are required.' });
    }

    const fullName = `${firstName} ${lastName}`.trim();
    let resumeUrl = '';

    if (req.file) {
      resumeUrl = await processFileUpload(req.file, 'registrations');
    }

    const isEmployer = type === 'employer';
    const subject = isEmployer
      ? `Employer Proposal Request - ${company || fullName}`
      : `Employee CV Registration - ${specialisation || fullName}`;

    const contact = new Contact({
      type: isEmployer ? 'employer' : 'employee',
      name: fullName,
      firstName,
      lastName,
      email,
      phone,
      subject,
      message: message || (isEmployer ? `Employer proposal request submitted by ${company || fullName}` : `Employee CV registered for ${specialisation || 'General Role'}`),
      nationality: nationality || '',
      dob: dob || '',
      specialisation: specialisation || '',
      qualificationLevel: qualificationLevel || '',
      preferredContract: preferredContract || '',
      linkedIn: linkedIn || '',
      resumeUrl,
      company: company || '',
      jobTitle: jobTitle || '',
      consent: consent === 'true' || consent === true,
      status: 'unread'
    });

    const saved = await contact.save();
    res.status(201).json({
      success: true,
      message: isEmployer
        ? 'Your proposal request has been submitted successfully! Our team will contact you shortly.'
        : 'Your CV has been registered successfully! Our recruitment team will review your details.',
      enquiry: saved
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all contact enquiries (Admin)
// @route GET /api/contact/admin/all
const getAdminEnquiries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;

    const enquiries = await Contact.find(query).sort({ createdAt: -1 });
    res.json({ success: true, enquiries, count: enquiries.length });
  } catch (error) {
    next(error);
  }
};

// @desc Update enquiry status
// @route PUT /api/contact/:id/status
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    if (['unread', 'read', 'responded'].includes(status)) {
      contact.status = status;
      await contact.save();
      res.json({ success: true, contact, message: `Status updated to ${status}` });
    } else {
      res.status(400).json({ success: false, message: 'Invalid status' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Delete enquiry
// @route DELETE /api/contact/:id
const deleteEnquiry = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (contact) {
      await contact.deleteOne();
      res.json({ success: true, message: 'Enquiry deleted' });
    } else {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitEnquiry,
  submitRegistration,
  getAdminEnquiries,
  updateEnquiryStatus,
  deleteEnquiry
};

