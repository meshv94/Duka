const express = require('express');
const router = express.Router();
const cartCheckoutController = require('../../controllers/app/cartCheckoutController');
const { verifyToken } = require('../../middlewares/authMiddleware');

// Require auth to use user's default address for proximity sorting
router.post('/checkout', verifyToken, cartCheckoutController.checkout);

// Place order with address and delivery details
router.post('/place-order', verifyToken, cartCheckoutController.placeOrder);

// Create Stripe checkout session
router.post('/create-stripe-checkout', verifyToken, cartCheckoutController.createStripeCheckout);

// Stripe webhook (No auth middleware - Stripe sends requests here)
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), cartCheckoutController.handleStripeWebhook);

// Verify Stripe payment and place order (Fallback for local development)
router.post('/verify-stripe-payment', verifyToken, cartCheckoutController.verifyStripePayment);

module.exports = router;
