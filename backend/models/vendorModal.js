const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vendor name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    mobile_number: {
      type: Number,
      required: [true, 'Mobile number is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    description: {
      type: String,
      trim: true,
    },
    vendor_image: {
      type: String,
      default: '',
    },
    preparation_time_minute: {
      type: Number,
      default: 0,
    },
    open_time: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format: HH:mm (24-hour format)'],
    },
    close_time: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format: HH:mm (24-hour format)'],
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
      enum: ['Asia/Kolkata', 'Asia/Bangalore', 'UTC'],
    },
    packaging_charge: {
      type: Number,
      default: 0,
    },
    convenience_charge: {
      type: Number,
      default: 0,
    },
    delivery_charge: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      enum: [0, 1], // 0 = inactive, 1 = active
      default: 1,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Module reference is required'],
    },
  },
  { timestamps: true }
);

// Create geospatial index for location-based queries
vendorSchema.index({ location: '2dsphere' });

// Virtual to get full vendor info with status text
vendorSchema.virtual('statusText').get(function () {
  return this.status === 1 ? 'Active' : 'Inactive';
});

module.exports = mongoose.model('Vendor', vendorSchema);