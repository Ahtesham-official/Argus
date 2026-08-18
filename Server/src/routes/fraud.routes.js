const express = require('express');
const ctrl = require('../controllers/fraud.controller');

const router = express.Router();

router.post('/anomaly', ctrl.anomaly);
router.post('/duplicate', ctrl.duplicate);
router.post('/pattern', ctrl.pattern);
router.post('/network', ctrl.network);
router.post('/scan', ctrl.fullScan);

module.exports = router;
