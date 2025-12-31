const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController');
const {
  verifyAdminToken,
  checkPermission,
  checkRole,
  checkVendorAccess
} = require('../../middlewares/adminAuthMiddleware');

// Public Routes
// Admin Login (No authentication required)
router.post('/login', adminController.loginAdmin);

// Protected Routes (Authentication required)
// Get all admins (Super admin only)
router.get('/admins',
  verifyAdminToken,
  checkRole('super_admin'),
  adminController.getAllAdmins
);

// Get admin by ID (Super admin only)
router.get('/admins/:id',
  verifyAdminToken,
  checkRole('super_admin'),
  adminController.getAdminById
);

// Add new admin (Super admin only)
router.post('/admins',
  verifyAdminToken,
  checkRole('super_admin'),
  adminController.addAdmin
);

// Update admin (Super admin only)
router.put('/admins/:id',
  verifyAdminToken,
  checkRole('super_admin'),
  adminController.updateAdmin
);

// Delete admin (Super admin only)
router.delete('/admins/:id',
  verifyAdminToken,
  checkRole('super_admin'),
  adminController.deleteAdmin
);

// Assign vendors to admin (Super admin only)
router.post('/admins/:id/assign-vendors',
  verifyAdminToken,
  checkRole('super_admin'),
  adminController.assignVendors
);

// Remove vendors from admin (Super admin only)
router.post('/admins/:id/remove-vendors',
  verifyAdminToken,
  checkRole('super_admin'),
  adminController.removeVendors
);

// Verify vendor (Admin must have permission and access to vendor)
router.put('/admins/:adminId/verify-vendor/:vendorId',
  verifyAdminToken,
  checkPermission('canVerifyVendors'),
  adminController.verifyVendor
);

module.exports = router;
