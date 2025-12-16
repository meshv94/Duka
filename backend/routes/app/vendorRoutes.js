const express = require('express');
const router = express.Router();
const vendorController = require('../../controllers/app/vendorController');
const { verifyToken } = require('../../middlewares/authMiddleware');

// Require auth to use user's default address for proximity sorting
router.get('/vendors/active', verifyToken, vendorController.getActiveVendors);

module.exports = router;
