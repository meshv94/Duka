const express = require('express');
const router = express.Router();
const vendorController = require('../../controllers/admin/vendorController');
const upload = require('../../middleware/upload'); // Assuming you have an upload middleware

// CRUD Operations

// Create a new vendor
// Single image upload
router.post('/vendors', upload.single('resturant_image'), vendorController.createVendor);

// Get all vendors
router.get('/vendors', vendorController.getAllVendors);

// Get active vendors
router.get('/vendors/active/list', vendorController.getActiveVendors);

// Get vendors by module
router.get('/vendors/module/:moduleId', vendorController.getVendorsByModule);

// Get vendor by ID
router.get('/vendors/:id', vendorController.getVendorById);

// Update vendor
router.put('/vendors/:id', upload.single('resturant_image'),vendorController.updateVendor);

// Delete vendor
router.delete('/vendors/:id', vendorController.deleteVendor);

module.exports = router;
