const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/admin/orderController');

// Order Routes

// Get all orders (with optional filters)
router.get('/orders', orderController.getAllOrders);

// Get order statistics
router.get('/orders/stats', orderController.getOrderStats);

// Get order by ID
router.get('/orders/:id', orderController.getOrderById);

// Update order status
router.put('/orders/:id/status', orderController.updateOrderStatus);

// Delete/Cancel order
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;
