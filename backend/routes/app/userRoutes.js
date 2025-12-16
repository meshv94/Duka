const express = require('express');
const router = express.Router();
const userController = require('../../controllers/app/userController');
const { verifyToken } = require('../../middlewares/authMiddleware');

// Auth Routes (Public)

// Send OTP - For both registration and login
router.post('/auth/send-otp', userController.sendOtp);

// Verify OTP - Handles both registration and login
router.post('/auth/verify-otp', userController.verifyOtp);

// Logout
router.post('/auth/logout', verifyToken, userController.logout);

// User Profile Routes (Protected)

// Get user profile
router.get('/profile', verifyToken, userController.getUserProfile);

// Update user profile
router.put('/profile/update', verifyToken, userController.updateUserProfile);

module.exports = router;
