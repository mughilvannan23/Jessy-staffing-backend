const Job = require('../models/Job');
const { upload, processFileUpload } = require('../middlewares/uploadMiddleware');

// @desc Get public jobs (with search, filter, pagination)
// @route GET /api/jobs
const getPublicJobs = async (req, res, next) => {
  try {
    const { keyword, category, location, employmentType, experience, isFeatured, page = 1, limit = 12 } = req.query;

    const query = { status: 'published' };

    if (keyword) {
      query.$or = [
        { jobTitle: { $regex: keyword, $options: 'i' } },
        { department: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { qualification: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (location && location !== 'All') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (employmentType && employmentType !== 'All') {
      query.employmentType = employmentType;
    }

    if (experience && experience !== 'All') {
      query.experience = experience;
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    const count = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(limit) * (Number(page) - 1));

    res.json({
      success: true,
      jobs,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      totalJobs: count
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single job details
// @route GET /api/jobs/:id
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      res.json({ success: true, job });
    } else {
      res.status(404).json({ success: false, message: 'Job not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get admin jobs (all statuses)
// @route GET /api/jobs/admin/all
const getAdminJobs = async (req, res, next) => {
  try {
    const { keyword, category, status } = req.query;
    const query = {};

    if (keyword) {
      query.$or = [
        { jobTitle: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json({ success: true, jobs, count: jobs.length });
  } catch (error) {
    next(error);
  }
};

// @desc Create new job post
// @route POST /api/jobs
const createJob = async (req, res, next) => {
  try {
    let companyImage = '';
    if (req.file) {
      companyImage = await processFileUpload(req.file, 'staffing_jobs');
    } else if (req.body.companyImage) {
      companyImage = req.body.companyImage;
    }

    const {
      jobTitle,
      category,
      department,
      location,
      employmentType,
      experience,
      salary,
      vacancies,
      qualification,
      skills,
      description,
      responsibilities,
      benefits,
      genderPreference,
      ageLimit,
      workingHours,
      status,
      expiryDate,
      isFeatured,
      companyName
    } = req.body;

    const parsedSkills = Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []);
    const parsedResponsibilities = Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n').map(r => r.trim()).filter(Boolean) : []);
    const parsedBenefits = Array.isArray(benefits) ? benefits : (benefits ? benefits.split('\n').map(b => b.trim()).filter(Boolean) : []);

    const job = new Job({
      jobTitle,
      category,
      department,
      location,
      employmentType,
      experience,
      salary,
      vacancies: Number(vacancies) || 1,
      qualification,
      skills: parsedSkills,
      description,
      responsibilities: parsedResponsibilities,
      benefits: parsedBenefits,
      genderPreference: genderPreference || 'Any',
      ageLimit: ageLimit || '20 - 45 Years',
      workingHours: workingHours || '8 Hours / Shift',
      status: status || 'published',
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      companyImage,
      companyName: companyName || 'Apex Global Staffing'
    });

    const createdJob = await job.save();
    res.status(201).json({ success: true, job: createdJob, message: 'Job created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Update job post
// @route PUT /api/jobs/:id
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (req.file) {
      job.companyImage = await processFileUpload(req.file, 'staffing_jobs');
    } else if (req.body.companyImage !== undefined) {
      job.companyImage = req.body.companyImage;
    }

    const fields = [
      'jobTitle', 'category', 'department', 'location', 'employmentType',
      'experience', 'salary', 'vacancies', 'qualification', 'description',
      'genderPreference', 'ageLimit', 'workingHours', 'status', 'companyName'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });

    if (req.body.skills !== undefined) {
      job.skills = Array.isArray(req.body.skills) ? req.body.skills : req.body.skills.split(',').map(s => s.trim());
    }
    if (req.body.responsibilities !== undefined) {
      job.responsibilities = Array.isArray(req.body.responsibilities) ? req.body.responsibilities : req.body.responsibilities.split('\n').map(r => r.trim()).filter(Boolean);
    }
    if (req.body.benefits !== undefined) {
      job.benefits = Array.isArray(req.body.benefits) ? req.body.benefits : req.body.benefits.split('\n').map(b => b.trim()).filter(Boolean);
    }
    if (req.body.isFeatured !== undefined) {
      job.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
    }
    if (req.body.expiryDate) {
      job.expiryDate = new Date(req.body.expiryDate);
    }

    const updatedJob = await job.save();
    res.json({ success: true, job: updatedJob, message: 'Job updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Delete job post
// @route DELETE /api/jobs/:id
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      await job.deleteOne();
      res.json({ success: true, message: 'Job removed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Job not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicJobs,
  getJobById,
  getAdminJobs,
  createJob,
  updateJob,
  deleteJob
};
