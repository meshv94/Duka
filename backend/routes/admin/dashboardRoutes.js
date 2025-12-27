const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboardController');

// Dashboard Routes

// Get comprehensive dashboard overview
router.get('/dashboard/overview', dashboardController.getDashboardOverview);

// Get revenue statistics for charts
router.get('/dashboard/revenue-stats', dashboardController.getRevenueStats);

module.exports = router;
