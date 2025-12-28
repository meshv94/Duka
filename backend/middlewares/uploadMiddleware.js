const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

dotenv.config();

// Get image environment (local or cloudinary)
const imgEnv = process.env.IMG_ENV || 'local';

// Local storage configuration
const uploadDir = process.env.UPLOAD_PATH || path.join(__dirname, '../uploads');
const fileUrl = process.env.FILE_URL || 'http://localhost:5000';

// Create uploads directory if using local storage
if (imgEnv === 'local' && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Cloudinary (only if using cloudinary)
if (imgEnv === 'cloudinary') {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Configure storage based on IMG_ENV
let storage;

if (imgEnv === 'cloudinary') {
  // Cloudinary storage
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'delivery-app', // Folder name in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Optional: resize large images
    }
  });
} else {
  // Local disk storage
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename: timestamp-randomnumber-originalname
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
  });
}

// File filter for images only
const fileFilter = (req, file, cb) => {
  // Allowed image types
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Only image files are allowed. Received: ${file.mimetype}`), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to get file URL based on storage type
const getFileUrl = (file) => {
  if (imgEnv === 'cloudinary') {
    // Cloudinary provides the URL directly
    return file.path; // Cloudinary path is the full URL
  } else {
    // Local storage - construct URL
    return `${fileUrl}/uploads/${file.filename}`;
  }
};

// Helper function to get path for DB storage
const getDbPath = (file) => {
  if (imgEnv === 'cloudinary') {
    // Store Cloudinary URL in DB
    return file.path;
  } else {
    // Store relative path for local storage
    return path.relative(path.dirname(uploadDir), file.path);
  }
};

// Middleware to handle file upload and generate URL
const uploadMiddleware = {

  // Single file upload
  single: (fieldName = 'image') => {
    return [
      upload.single(fieldName),
      (req, res, next) => {
        if (req.file) {
          // Generate URL based on storage type
          const fileUrlPath = getFileUrl(req.file);
          const dbPath = getDbPath(req.file);

          // Attach file info to request
          req.file.fileUrl = fileUrlPath;
          req.file.urlForDB = dbPath;
          req.file.storageType = imgEnv;

          // For local storage, also add relative path
          if (imgEnv === 'local') {
            req.file.relativePath = dbPath;
          }
        }
        next();
      }
    ];
  },

  // Multiple files upload
  multiple: (fieldName = 'images', maxFiles = 5) => {
    return [
      upload.array(fieldName, maxFiles),
      (req, res, next) => {
        if (req.files && req.files.length > 0) {
          req.files = req.files.map(file => {
            const fileUrlPath = getFileUrl(file);
            const dbPath = getDbPath(file);

            const fileData = {
              ...file,
              fileUrl: fileUrlPath,
              urlForDB: dbPath,
              storageType: imgEnv
            };

            // For local storage, also add relative path
            if (imgEnv === 'local') {
              fileData.relativePath = dbPath;
            }

            return fileData;
          });
        }
        next();
      }
    ];
  },

  // Fields upload (multiple fields)
  fields: (fields = []) => {
    return [
      upload.fields(fields),
      (req, res, next) => {
        // Process each field
        Object.keys(req.files || {}).forEach(fieldName => {
          req.files[fieldName] = req.files[fieldName].map(file => {
            const fileUrlPath = getFileUrl(file);
            const dbPath = getDbPath(file);

            const fileData = {
              ...file,
              fileUrl: fileUrlPath,
              urlForDB: dbPath,
              storageType: imgEnv
            };

            // For local storage, also add relative path
            if (imgEnv === 'local') {
              fileData.relativePath = dbPath;
            }

            return fileData;
          });
        });
        next();
      }
    ];
  }
};

// Error handler middleware for multer errors
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 5MB limit'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next();
};

module.exports = {
  upload: uploadMiddleware,
  multerErrorHandler,
  imgEnv, // Export for reference
  cloudinary // Export cloudinary instance for direct usage if needed
};
