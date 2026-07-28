const Job = require('../models/Job');
const Application = require('../models/Application');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const Contact = require('../models/Contact');
const Service = require('../models/Service');

// @desc Get admin dashboard summary & statistics
// @route GET /api/dashboard/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const totalJobs = await Job.countDocuments();
    const publishedJobs = await Job.countDocuments({ status: 'published' });
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const selectedCandidates = await Application.countDocuments({ status: 'selected' });
    const rejectedCandidates = await Application.countDocuments({ status: 'rejected' });
    const reviewedApplications = await Application.countDocuments({ status: 'reviewed' });

    const totalGallery = await Gallery.countDocuments();
    const totalTestimonials = await Testimonial.countDocuments();
    const totalEnquiries = await Contact.countDocuments();
    const unreadEnquiries = await Contact.countDocuments({ status: 'unread' });
    const totalServices = await Service.countDocuments();

    // Recent 5 applications
    const recentApplications = await Application.find()
      .populate('jobId', 'jobTitle location category')
      .sort({ createdAt: -1 })
      .limit(5);

    // Latest 5 jobs
    const latestJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Distribution by Job Category
    const categoryStats = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Monthly Application Trend data
    const applicationStatusDistribution = [
      { name: 'Pending', value: pendingApplications, color: '#f59e0b' },
      { name: 'Reviewed', value: reviewedApplications, color: '#3b82f6' },
      { name: 'Selected', value: selectedCandidates, color: '#10b981' },
      { name: 'Rejected', value: rejectedCandidates, color: '#ef4444' }
    ];

    res.json({
      success: true,
      stats: {
        totalJobs,
        publishedJobs,
        totalApplications,
        pendingApplications,
        selectedCandidates,
        rejectedCandidates,
        reviewedApplications,
        totalGallery,
        totalTestimonials,
        totalEnquiries,
        unreadEnquiries,
        totalServices,
        visitors: 14850 // Simulated dynamic impression counter
      },
      categoryStats: categoryStats.map(item => ({ name: item._id, count: item.count })),
      applicationStatusDistribution,
      recentApplications,
      latestJobs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
