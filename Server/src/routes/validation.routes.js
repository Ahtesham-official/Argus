const express = require('express');
const ctrl = require('../controllers/validation.controller');

const router = express.Router();

router.post('/validate', ctrl.validateClaim);
router.post('/consistency', ctrl.consistencyOnly);
router.post('/eligibility', ctrl.eligibilityOnly);

module.exports = router;
