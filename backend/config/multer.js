const multer = require('multer');
const path = require('path');
const fs = require('fs');
const createError = require('http-errors');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/';
    
    if (file.fieldname === 'document') {
      folder += 'documents/';
    } else if (file.fieldname === 'image') {
      folder += 'images/';
    }
    
    // Create directory if it doesn't exist
    const dir = path.join(__dirname, '../', folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter configuration
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (file.fieldname === 'document') {
    if (ext === '.pdf') {
      cb(null, true);
    } else {
      cb(createError(400, 'Only PDF files are allowed for documents'), false);
    }
  } else if (file.fieldname === 'image') {
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      cb(null, true);
    } else {
      cb(createError(400, 'Only image files are allowed (jpg, jpeg, png)'), false);
    }
  } else {
    cb(createError(400, 'Unexpected file field'), false);
  }
};

// Configure multer
// In multer.js
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    fields: 20 // Enough for all your form fields
  }
});

// Error handling middleware for file uploads
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

module.exports = {
  upload,
  handleUploadErrors
};