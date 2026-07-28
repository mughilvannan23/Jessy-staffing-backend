const Application = require('../models/Application');
const Job = require('../models/Job');
const { processFileUpload } = require('../middlewares/uploadMiddleware');

// @desc Submit candidate application
// @route POST /api/applications
const applyForJob = async (req, res, next) => {
  try {
    const {
      jobId,
      name,
      phone,
      email,
      address,
      qualification,
      experience,
      expectedSalary,
      coverLetter
    } = req.body;

    if (!jobId || !name || !phone || !email || !qualification || !experience) {
      return res.status(400).json({ success: false, message: 'Please complete all required application fields' });
    }

    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      return res.status(404).json({ success: false, message: 'Specified job post does not exist' });
    }

    let resumeUrl = '';
    let photoUrl = '';

    if (req.files && req.files.resume) {
      resumeUrl = await processFileUpload(req.files.resume[0], 'staffing_resumes');
    }
    if (req.files && req.files.photo) {
      photoUrl = await processFileUpload(req.files.photo[0], 'staffing_photos');
    }

    if (!resumeUrl) {
      return res.status(400).json({ success: false, message: 'Resume document upload is required' });
    }

    const application = new Application({
      jobId,
      name,
      phone,
      email,
      address: address || '',
      qualification,
      experience,
      expectedSalary: expectedSalary || '',
      resumeUrl,
      photoUrl,
      coverLetter: coverLetter || '',
      status: 'pending'
    });

    const savedApp = await application.save();
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Our HR team will contact you shortly.',
      application: savedApp
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all applications for Admin
// @route GET /api/applications/admin/all
const getAdminApplications = async (req, res, next) => {
  try {
    const { status, jobId } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (jobId) query.jobId = jobId;

    const applications = await Application.find(query)
      .populate('jobId', 'jobTitle category location employmentType companyName')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications, count: applications.length });
  } catch (error) {
    next(error);
  }
};

// @desc Update application status
// @route PUT /api/applications/:id/status
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (['pending', 'reviewed', 'selected', 'rejected'].includes(status)) {
      application.status = status;
      await application.save();
      res.json({ success: true, application, message: `Application status updated to ${status}` });
    } else {
      res.status(400).json({ success: false, message: 'Invalid status value' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Delete application
// @route DELETE /api/applications/:id
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (application) {
      await application.deleteOne();
      res.json({ success: true, message: 'Application deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Application not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getAdminApplications,
  updateApplicationStatus,
  deleteApplication
};
