const express = require('express');
const router = express.Router();
const moduleController = require('../../controllers/admin/moduleController');
const { upload } = require('../../middlewares/uploadMiddleware');
const { verifyAdminToken, checkRole } = require('../../middlewares/adminAuthMiddleware');

// All module routes require super admin access only

// Create a new module
router.post('/modules',
  verifyAdminToken,
  checkRole('super_admin'),
  upload.single('image'),
  moduleController.createModule
);

// Get all modules
router.get('/modules',
  verifyAdminToken,
  checkRole('super_admin'),
  moduleController.getAllModules
);

// Get active modules
router.get('/modules/active/list',
  verifyAdminToken,
  // checkRole('super_admin'),
  moduleController.getActiveModules
);

// Get inactive modules
router.get('/modules/inactive/list',
  verifyAdminToken,
  checkRole('super_admin'),
  moduleController.getInactiveModules
);

// Get module by ID
router.get('/modules/:id',
  verifyAdminToken,
  checkRole('super_admin'),
  moduleController.getModuleById
);

// Update module
router.put('/modules/:id',
  verifyAdminToken,
  checkRole('super_admin'),
  upload.single('image'),
  moduleController.updateModule
);

// Delete module
router.delete('/modules/:id',
  verifyAdminToken,
  checkRole('super_admin'),
  moduleController.deleteModule
);

module.exports = router;
