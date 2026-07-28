const Testimonial = require('../models/Testimonial');
const { processFileUpload } = require('../middlewares/uploadMiddleware');

// @desc Get active testimonials
// @route GET /api/testimonials
const getPublicTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json({ success: true, testimonials });
  } catch (error) {
    next(error);
  }
};

// @desc Get all testimonials (Admin)
// @route GET /api/testimonials/admin/all
const getAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, testimonials });
  } catch (error) {
    next(error);
  }
};

// @desc Create Testimonial
// @route POST /api/testimonials
const createTestimonial = async (req, res, next) => {
  try {
    let photo = '';
    if (req.file) {
      photo = await processFileUpload(req.file, 'staffing_testimonials');
    } else if (req.body.photo) {
      photo = req.body.photo;
    }

    const { name, designation, company, review, rating, status } = req.body;

    const testimonial = new Testimonial({
      name,
      designation,
      company: company || '',
      photo,
      review,
      rating: Number(rating) || 5,
      status: status || 'active'
    });

    const saved = await testimonial.save();
    res.status(201).json({ success: true, testimonial: saved, message: 'Testimonial created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Update Testimonial
// @route PUT /api/testimonials/:id
const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    if (req.file) {
      testimonial.photo = await processFileUpload(req.file, 'staffing_testimonials');
    } else if (req.body.photo !== undefined) {
      testimonial.photo = req.body.photo;
    }

    ['name', 'designation', 'company', 'review', 'rating', 'status'].forEach(field => {
      if (req.body[field] !== undefined) testimonial[field] = req.body[field];
    });

    const updated = await testimonial.save();
    res.json({ success: true, testimonial: updated, message: 'Testimonial updated' });
  } catch (error) {
    next(error);
  }
};

// @desc Delete Testimonial
// @route DELETE /api/testimonials/:id
const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
      await testimonial.deleteOne();
      res.json({ success: true, message: 'Testimonial deleted' });
    } else {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
