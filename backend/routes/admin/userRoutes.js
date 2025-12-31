const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const { verifyAdminToken, checkRole } = require('../../middlewares/adminAuthMiddleware');

// All user routes require super admin access only

// User Statistics
router.get('/users/stats',
  verifyAdminToken,
  checkRole('super_admin'),
  userController.getUserStats
);

// Get all users
router.get('/users',
  verifyAdminToken,
  checkRole('super_admin'),
  userController.getAllUsers
);

// Get user by ID
router.get('/users/:id',
  verifyAdminToken,
  checkRole('super_admin'),
  userController.getUserById
);

// Update user
router.put('/users/:id',
  verifyAdminToken,
  checkRole('super_admin'),
  userController.updateUser
);

// Delete user
router.delete('/users/:id',
  verifyAdminToken,
  checkRole('super_admin'),
  userController.deleteUser
);

// Block/Unblock user
router.put('/users/:id/toggle-block',
  verifyAdminToken,
  checkRole('super_admin'),
  userController.toggleBlockUser
);

module.exports = router;
