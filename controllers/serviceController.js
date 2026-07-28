const Service = require('../models/Service');
const { processFileUpload } = require('../middlewares/uploadMiddleware');

// @desc Get active services
// @route GET /api/services
const getPublicServices = async (req, res, next) => {
  try {
    const services = await Service.find({ status: 'active' }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, services });
  } catch (error) {
    next(error);
  }
};

// @desc Get single service by slug or id
// @route GET /api/services/:identifier
const getServiceByIdentifier = async (req, res, next) => {
  try {
    const identifier = req.params.identifier;
    let service = await Service.findOne({ slug: identifier });
    if (!service && identifier.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(identifier);
    }
    if (service) {
      res.json({ success: true, service });
    } else {
      res.status(404).json({ success: false, message: 'Service not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get all services (Admin)
// @route GET /api/services/admin/all
const getAdminServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, services });
  } catch (error) {
    next(error);
  }
};

// @desc Create Service
// @route POST /api/services
const createService = async (req, res, next) => {
  try {
    let image = '';
    if (req.file) {
      image = await processFileUpload(req.file, 'staffing_services');
    } else if (req.body.image) {
      image = req.body.image;
    }

    const { title, slug, category, shortDescription, description, icon, features, rolesProvided, status, order } = req.body;

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const parsedFeatures = Array.isArray(features) ? features : (features ? features.split('\n').map(f => f.trim()).filter(Boolean) : []);
    const parsedRoles = Array.isArray(rolesProvided) ? rolesProvided : (rolesProvided ? rolesProvided.split(',').map(r => r.trim()).filter(Boolean) : []);

    const service = new Service({
      title,
      slug: generatedSlug,
      category,
      shortDescription,
      description,
      icon: icon || 'bi-briefcase-fill',
      image,
      features: parsedFeatures,
      rolesProvided: parsedRoles,
      status: status || 'active',
      order: Number(order) || 0
    });

    const savedService = await service.save();
    res.status(201).json({ success: true, service: savedService, message: 'Service created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Update Service
// @route PUT /api/services/:id
const updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (req.file) {
      service.image = await processFileUpload(req.file, 'staffing_services');
    } else if (req.body.image !== undefined) {
      service.image = req.body.image;
    }

    ['title', 'category', 'shortDescription', 'description', 'icon', 'status', 'order'].forEach(field => {
      if (req.body[field] !== undefined) service[field] = req.body[field];
    });

    if (req.body.slug) service.slug = req.body.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (req.body.features !== undefined) {
      service.features = Array.isArray(req.body.features) ? req.body.features : req.body.features.split('\n').map(f => f.trim()).filter(Boolean);
    }
    if (req.body.rolesProvided !== undefined) {
      service.rolesProvided = Array.isArray(req.body.rolesProvided) ? req.body.rolesProvided : req.body.rolesProvided.split(',').map(r => r.trim()).filter(Boolean);
    }

    const updatedService = await service.save();
    res.json({ success: true, service: updatedService, message: 'Service updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Delete Service
// @route DELETE /api/services/:id
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      await service.deleteOne();
      res.json({ success: true, message: 'Service removed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Service not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicServices,
  getServiceByIdentifier,
  getAdminServices,
  createService,
  updateService,
  deleteService
};
