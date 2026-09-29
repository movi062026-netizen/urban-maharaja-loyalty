const multer = require('multer');
const { ValidationError } = require('../utils/errors');

// Store file in memory as Buffer for streaming to Cloudinary
const storage = multer.memoryStorage();

// Allowed MIME types for bill receipts
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'image/heic',
  'image/heif',
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(
      new ValidationError(
        `Invalid bill file format (${file.mimetype}). Please upload an image file (JPG, PNG, or WEBP).`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max size
  },
  fileFilter,
});

module.exports = {
  uploadBill: upload.single('bill'),
};
