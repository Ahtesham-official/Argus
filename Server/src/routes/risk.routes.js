const express = require('express');
const ctrl = require('../controllers/risk.controller');

const router = express.Router();

router.get('/provider/:providerId', ctrl.providerRisk);
router.get('/providers', ctrl.allProvidersRisk);

module.exports = router;
