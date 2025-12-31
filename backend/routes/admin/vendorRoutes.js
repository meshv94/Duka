const express = require('express');
const router = express.Router();
const vendorController = require('../../controllers/admin/vendorController');
const { upload } = require('../../middlewares/uploadMiddleware');
const { verifyAdminToken, checkPermission, checkRole } = require('../../middlewares/adminAuthMiddleware');

// Vendor CRUD Operations - All routes require authentication

// Create a new vendor (Super admin only)
router.post('/vendors',
  verifyAdminToken,
  checkRole('super_admin'),
  upload.single('vendor_image'),
  vendorController.createVendor
);

// Get all vendors (filtered by vendor access)
router.get('/vendors',
  verifyAdminToken,
  vendorController.getAllVendors
);

// Get vendors by module (filtered by vendor access)
router.get('/vendors/module/:moduleId',
  verifyAdminToken,
  vendorController.getVendorsByModule
);

// Get all products for a vendor (must have vendor access)
router.get('/vendors/:id/products',
  verifyAdminToken,
  checkPermission('canManageProducts'),
  vendorController.getProductsByVendor
);

// Get vendor by ID (must have vendor access)
router.get('/vendors/:id',
  verifyAdminToken,
  vendorController.getVendorById
);

// Update vendor (must have vendor access and update permission)
router.put('/vendors/:id',
  verifyAdminToken,
  checkPermission('canUpdateVendor'),
  upload.single('vendor_image'),
  vendorController.updateVendor
);

// Delete vendor (Super admin only)
router.delete('/vendors/:id',
  verifyAdminToken,
  checkRole('super_admin'),
  vendorController.deleteVendor
);

// Product routes (admin) - Require product management permission
router.post('/products',
  verifyAdminToken,
  checkPermission('canManageProducts'),
  upload.single('image'),
  vendorController.createProduct
);

router.get('/products',
  verifyAdminToken,
  checkPermission('canManageProducts'),
  vendorController.getProducts
);

router.get('/products/:id',
  verifyAdminToken,
  checkPermission('canManageProducts'),
  vendorController.getProductById
);

router.put('/products/:id',
  verifyAdminToken,
  checkPermission('canManageProducts'),
  upload.single('image'),
  vendorController.updateProduct
);

router.delete('/products/:id',
  verifyAdminToken,
  checkPermission('canManageProducts'),
  vendorController.deleteProduct
);

module.exports = router;
