const express = require('express');
const upload = require('../middleware/upload');
const { asyncHandler } = require('../middleware/errorHandler');
const ctrl = require('../controllers/documentAI.controller');

const router = express.Router();

router.post('/process', upload.single('document'), asyncHandler(ctrl.processDocument));
router.post('/classify', ctrl.classifyText);
router.post('/extract', ctrl.extractText);

module.exports = router;
