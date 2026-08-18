const express = require('express');
const upload = require('../middleware/upload');
const { asyncHandler } = require('../middleware/errorHandler');
const ctrl = require('../controllers/pipeline.controller');

const router = express.Router();

router.post('/analyze-claim', upload.single('document'), asyncHandler(ctrl.analyze));

module.exports = router;
