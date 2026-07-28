const Client = require('../models/Client');
const { processFileUpload } = require('../middlewares/uploadMiddleware');

// @desc Get active clients (logos)
// @route GET /api/clients
const getPublicClients = async (req, res, next) => {
  try {
    const clients = await Client.find({ status: 'active' }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, clients });
  } catch (error) {
    next(error);
  }
};

// @desc Get all clients (Admin)
// @route GET /api/clients/admin/all
const getAdminClients = async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, clients });
  } catch (error) {
    next(error);
  }
};

// @desc Add corporate client
// @route POST /api/clients
const createClient = async (req, res, next) => {
  try {
    let logo = '';
    if (req.file) {
      logo = await processFileUpload(req.file, 'staffing_clients');
    } else if (req.body.logo) {
      logo = req.body.logo;
    }

    const { companyName, website, status, order } = req.body;

    const client = new Client({
      companyName,
      logo,
      website: website || '',
      status: status || 'active',
      order: Number(order) || 0
    });

    const saved = await client.save();
    res.status(201).json({ success: true, client: saved, message: 'Corporate partner client added' });
  } catch (error) {
    next(error);
  }
};

// @desc Update corporate client
// @route PUT /api/clients/:id
const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    if (req.file) {
      client.logo = await processFileUpload(req.file, 'staffing_clients');
    } else if (req.body.logo !== undefined) {
      client.logo = req.body.logo;
    }

    ['companyName', 'website', 'status', 'order'].forEach(field => {
      if (req.body[field] !== undefined) client[field] = req.body[field];
    });

    const updated = await client.save();
    res.json({ success: true, client: updated, message: 'Client updated' });
  } catch (error) {
    next(error);
  }
};

// @desc Delete client
// @route DELETE /api/clients/:id
const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (client) {
      await client.deleteOne();
      res.json({ success: true, message: 'Client deleted' });
    } else {
      res.status(404).json({ success: false, message: 'Client not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicClients,
  getAdminClients,
  createClient,
  updateClient,
  deleteClient
};
