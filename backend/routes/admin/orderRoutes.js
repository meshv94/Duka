const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/admin/orderController');
const { verifyAdminToken, checkPermission } = require('../../middlewares/adminAuthMiddleware');

// Order Routes - All routes require authentication

// Get all orders (with optional filters)
// Automatically filtered by vendor access
router.get('/orders',
  verifyAdminToken,
  checkPermission('canManageOrders'),
  orderController.getAllOrders
);

// Get order statistics
router.get('/orders/stats',
  verifyAdminToken,
  checkPermission('canManageOrders'),
  orderController.getOrderStats
);

// Get order by ID
router.get('/orders/:id',
  verifyAdminToken,
  checkPermission('canManageOrders'),
  orderController.getOrderById
);

// Update order status
router.put('/orders/:id/status',
  verifyAdminToken,
  checkPermission('canManageOrders'),
  orderController.updateOrderStatus
);

// Mark order as delivered
router.put('/orders/:id/deliver',
  verifyAdminToken,
  checkPermission('canManageOrders'),
  orderController.markAsDelivered
);

// Cancel order with reason
router.put('/orders/:id/cancel',
  verifyAdminToken,
  checkPermission('canManageOrders'),
  orderController.cancelOrder
);

// Delete/Cancel order
router.delete('/orders/:id',
  verifyAdminToken,
  checkPermission('canManageOrders'),
  orderController.deleteOrder
);

module.exports = router;
