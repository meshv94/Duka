const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboardController');
const { verifyAdminToken, checkRole } = require('../../middlewares/adminAuthMiddleware');

// All dashboard routes require super admin access only

// Get comprehensive dashboard overview
router.get('/dashboard/overview',
  verifyAdminToken,
  checkRole('super_admin'),
  dashboardController.getDashboardOverview
);

// Get revenue statistics for charts
router.get('/dashboard/revenue-stats',
  verifyAdminToken,
  checkRole('super_admin'),
  dashboardController.getRevenueStats
);

module.exports = router;
