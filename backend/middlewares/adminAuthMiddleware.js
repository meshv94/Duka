const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModal');

// Admin JWT Verification Middleware
const verifyAdminToken = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Check if token has admin id
    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload'
      });
    }

    // Fetch admin from DB
    const admin = await Admin.findById(decoded.id)
      .select('-password')
      .populate('vendor_ids', 'name email status');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check if admin is blocked
    if (admin.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact support.'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive. Please contact support.'
      });
    }

    // Attach admin to request
    req.admin = admin.toObject();
    req.adminId = admin._id;

    next();

  } catch (error) {
    console.error('Admin auth error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.'
      });
    }

    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

// Check if admin has specific permission
const checkPermission = (permissionName) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Super admin has all permissions
    if (req.admin.role === 'super_admin') {
      return next();
    }

    // Check if admin has the required permission
    if (!req.admin.permissions || !req.admin.permissions[permissionName]) {
      return res.status(403).json({
        success: false,
        message: `You don't have permission to ${permissionName.replace('can', '').replace(/([A-Z])/g, ' $1').toLowerCase()}`
      });
    }

    next();
  };
};

// Check if admin has specific role
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Check if admin has access to a specific vendor
const checkVendorAccess = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Super admin has access to all vendors
  if (req.admin.role === 'super_admin') {
    return next();
  }

  // Get vendor ID from params
  const vendorId = req.params.vendorId || req.body.vendorId;

  if (!vendorId) {
    return res.status(400).json({
      success: false,
      message: 'Vendor ID is required'
    });
  }

  // Check if vendor is in admin's assigned vendors
  const hasAccess = req.admin.vendor_ids.some(
    vendor => vendor._id.toString() === vendorId.toString()
  );

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: 'You do not have access to this vendor'
    });
  }

  next();
};

module.exports = {
  verifyAdminToken,
  checkPermission,
  checkRole,
  checkVendorAccess
};
