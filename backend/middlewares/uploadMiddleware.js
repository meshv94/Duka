const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

// Get upload path from environment or use default
const uploadDir = process.env.UPLOAD_PATH || path.join(__dirname, '../uploads');
const fileUrl = process.env.FILE_URL || 'http://localhost:5000';

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
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

// Middleware to handle file upload and generate URL
const uploadMiddleware = {
  
  // Single file upload
  single: (fieldName = 'image') => {
    return [
      upload.single(fieldName),
      (req, res, next) => {
        if (req.file) {
          // Generate relative path for database storage
          const relativePath = path.relative(path.dirname(uploadDir), req.file.path);
          const fileUrlPath = `${fileUrl}/uploads/${req.file.filename}`;
          
          // Attach file info to request
          req.file.relativePath = relativePath;
          req.file.fileUrl = fileUrlPath;
          req.file.urlForDB = relativePath; // Path relative to server root
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
          req.files = req.files.map(file => ({
            ...file,
            relativePath: path.relative(path.dirname(uploadDir), file.path),
            fileUrl: `${fileUrl}/uploads/${file.filename}`,
            urlForDB: path.relative(path.dirname(uploadDir), file.path)
          }));
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
          req.files[fieldName] = req.files[fieldName].map(file => ({
            ...file,
            relativePath: path.relative(path.dirname(uploadDir), file.path),
            fileUrl: `${fileUrl}/uploads/${file.filename}`,
            urlForDB: path.relative(path.dirname(uploadDir), file.path)
          }));
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
  multerErrorHandler
};
