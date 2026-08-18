const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');

fs.mkdirSync(config.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.maxUploadBytes },
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.pdf', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      const err = new Error(`Unsupported file type: ${ext}. Allowed: ${allowed.join(', ')}`);
      err.code = 'VALIDATION_ERROR';
      return cb(err);
    }
    cb(null, true);
  },
});

module.exports = upload;
