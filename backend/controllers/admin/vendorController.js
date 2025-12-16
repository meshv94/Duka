const Joi = require('joi');
const Vendor = require('../../models/vendorModal');

// Validation Schemas
const createVendorSchema = Joi.object({
  name: Joi.string().trim().required().max(100).messages({
    'string.empty': 'Vendor name is required',
    'any.required': 'Vendor name is required',
    'string.max': 'Name cannot exceed 100 characters'
  }),
  email: Joi.string().email().required().lowercase().messages({
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
    'string.email': 'Please provide a valid email'
  }),
  mobile_number: Joi.number().required().messages({
    'number.base': 'Mobile number must be a number',
    'any.required': 'Mobile number is required'
  }),
  address: Joi.string().trim().required().messages({
    'string.empty': 'Address is required',
    'any.required': 'Address is required'
  }),
  latitude: Joi.string().required().messages({
    'string.empty': 'Latitude is required',
    'any.required': 'Latitude is required'
  }),
  longitude: Joi.string().required().messages({
    'string.empty': 'Longitude is required',
    'any.required': 'Longitude is required'
  }),
  open_time: Joi.string().required().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).messages({
    'string.empty': 'Open time is required',
    'any.required': 'Open time is required',
    'string.pattern.base': 'Open time must be in HH:mm format (24-hour)'
  }),
  close_time: Joi.string().required().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).messages({
    'string.empty': 'Close time is required',
    'any.required': 'Close time is required',
    'string.pattern.base': 'Close time must be in HH:mm format (24-hour)'
  }),
  timezone: Joi.string().valid('Asia/Kolkata', 'Asia/Bangalore', 'UTC').optional().default('Asia/Kolkata').messages({
    'any.only': 'Timezone must be one of: Asia/Kolkata, Asia/Bangalore, UTC'
  }),
  preparation_time_minute: Joi.number().optional().default(0).messages({
    'number.base': 'Preparation time must be a number'
  }),
  resturant_image: Joi.string().optional().default('').messages({
    'string.base': 'Restaurant image must be a string'
  }),
  packaging_charge: Joi.number().optional().default(0).messages({
    'number.base': 'Packaging charge must be a number'
  }),
  convenience_charge: Joi.number().optional().default(0).messages({
    'number.base': 'Convenience charge must be a number'
  }),
  delivery_charge: Joi.number().optional().default(0).messages({
    'number.base': 'Delivery charge must be a number'
  }),
  description: Joi.string().trim().optional().default('').messages({
    'string.base': 'Description must be a string'
  }),
  status: Joi.number().valid(0, 1).optional().default(1).messages({
    'any.only': 'Status must be 0 (inactive) or 1 (active)'
  }),
  module: Joi.string().required().messages({
    'string.empty': 'Module ID is required',
    'any.required': 'Module ID is required'
  })
});

const updateVendorSchema = Joi.object({
  name: Joi.string().trim().max(100).optional().messages({
    'string.max': 'Name cannot exceed 100 characters'
  }),
  email: Joi.string().email().optional().lowercase().messages({
    'string.email': 'Please provide a valid email'
  }),
  mobile_number: Joi.number().optional().messages({
    'number.base': 'Mobile number must be a number'
  }),
  address: Joi.string().trim().optional(),
  latitude: Joi.string().optional(),
  longitude: Joi.string().optional(),
  open_time: Joi.string().optional().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).messages({
    'string.pattern.base': 'Open time must be in HH:mm format (24-hour)'
  }),
  close_time: Joi.string().optional().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).messages({
    'string.pattern.base': 'Close time must be in HH:mm format (24-hour)'
  }),
  timezone: Joi.string().valid('Asia/Kolkata', 'Asia/Bangalore', 'UTC').optional().messages({
    'any.only': 'Timezone must be one of: Asia/Kolkata, Asia/Bangalore, UTC'
  }),
  preparation_time_minute: Joi.number().optional(),
  resturant_image: Joi.string().optional(),
  packaging_charge: Joi.number().optional(),
  convenience_charge: Joi.number().optional(),
  delivery_charge: Joi.number().optional(),
  description: Joi.string().trim().optional(),
  status: Joi.number().valid(0, 1).optional().messages({
    'any.only': 'Status must be 0 (inactive) or 1 (active)'
  })
}).min(1).messages({
  'object.min': 'At least one field is required to update'
});

// Create a new vendor
exports.createVendor = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createVendorSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, email, module } = value;

    // Check if vendor with same email already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message: 'Vendor with this email already exists'
      });
    }

    // Create location object for geospatial queries
    const locationData = {
      type: 'Point',
      coordinates: [parseFloat(value.longitude), parseFloat(value.latitude)]
    };

    const vendor = new Vendor({
      ...value,
      location: locationData
    });

    const savedVendor = await vendor.save();

    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      data: savedVendor
    });

  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating vendor',
      error: error.message
    });
  }
};

// Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('module', 'name');
    
    res.status(200).json({
      success: true,
      message: 'Vendors retrieved successfully',
      data: vendors,
      count: vendors.length
    });

  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vendors',
      error: error.message
    });
  }
};

// Get vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById(id).populate('module', 'name');
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vendor retrieved successfully',
      data: vendor
    });

  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vendor',
      error: error.message
    });
  }
};

// Update vendor
exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    const { error, value } = updateVendorSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // Check if vendor exists
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Check if email is being changed and if new email already exists
    if (value.email && value.email !== vendor.email) {
      const existingVendor = await Vendor.findOne({ email: value.email });
      if (existingVendor) {
        return res.status(409).json({
          success: false,
          message: 'Vendor with this email already exists'
        });
      }
    }

    // Update location if latitude/longitude is provided
    if (value.latitude || value.longitude) {
      value.location = {
        type: 'Point',
        coordinates: [
          parseFloat(value.longitude || vendor.longitude),
          parseFloat(value.latitude || vendor.latitude)
        ]
      };
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(id, value, { 
      new: true,
      runValidators: true 
    }).populate('module', 'name');

    res.status(200).json({
      success: true,
      message: 'Vendor updated successfully',
      data: updatedVendor
    });

  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating vendor',
      error: error.message
    });
  }
};

// Delete vendor
exports.deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findByIdAndDelete(id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vendor deleted successfully',
      data: vendor
    });

  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting vendor',
      error: error.message
    });
  }
};

// Get vendors by module
exports.getVendorsByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const vendors = await Vendor.find({ module: moduleId }).populate('module', 'name');
    
    res.status(200).json({
      success: true,
      message: 'Vendors retrieved successfully',
      data: vendors,
      count: vendors.length
    });

  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vendors',
      error: error.message
    });
  }
};
