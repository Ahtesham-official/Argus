const express = require('express');
const documentAIRoutes = require('./documentAI.routes');
const validationRoutes = require('./validation.routes');
const fraudRoutes = require('./fraud.routes');
const riskRoutes = require('./risk.routes');
const pipelineRoutes = require('./pipeline.routes');

const router = express.Router();

router.use('/document-ai', documentAIRoutes);
router.use('/validation', validationRoutes);
router.use('/fraud', fraudRoutes);
router.use('/risk', riskRoutes);
router.use('/pipeline', pipelineRoutes);

module.exports = router;
