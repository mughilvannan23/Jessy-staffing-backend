const Gallery = require('../models/Gallery');
const { processFileUpload } = require('../middlewares/uploadMiddleware');

// @desc Get public gallery items
// @route GET /api/gallery
const getPublicGallery = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { status: 'active' };
    if (category && category !== 'All') {
      query.category = category;
    }
    const items = await Gallery.find(query).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    next(error);
  }
};

// @desc Get all gallery items (Admin)
// @route GET /api/gallery/admin/all
const getAdminGallery = async (req, res, next) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    next(error);
  }
};

// @desc Add gallery item
// @route POST /api/gallery
const createGalleryItem = async (req, res, next) => {
  try {
    let image = '';
    if (req.file) {
      image = await processFileUpload(req.file, 'staffing_gallery');
    } else if (req.body.image) {
      image = req.body.image;
    }

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image file or URL is required' });
    }

    const { title, description, category, status } = req.body;

    const item = new Gallery({
      title,
      description: description || '',
      category: category || 'Corporate',
      image,
      status: status || 'active'
    });

    const savedItem = await item.save();
    res.status(201).json({ success: true, item: savedItem, message: 'Gallery item uploaded successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Update gallery item
// @route PUT /api/gallery/:id
const updateGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    if (req.file) {
      item.image = await processFileUpload(req.file, 'staffing_gallery');
    } else if (req.body.image !== undefined) {
      item.image = req.body.image;
    }

    ['title', 'description', 'category', 'status'].forEach(field => {
      if (req.body[field] !== undefined) item[field] = req.body[field];
    });

    const updatedItem = await item.save();
    res.json({ success: true, item: updatedItem, message: 'Gallery item updated' });
  } catch (error) {
    next(error);
  }
};

// @desc Delete gallery item
// @route DELETE /api/gallery/:id
const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (item) {
      await item.deleteOne();
      res.json({ success: true, message: 'Gallery item deleted' });
    } else {
      res.status(404).json({ success: false, message: 'Item not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicGallery,
  getAdminGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};
