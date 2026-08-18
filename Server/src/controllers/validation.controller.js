const { runRules } = require('../services/validation/ruleEngine');
const { checkConsistency } = require('../services/validation/consistencyCheck');
const { checkEligibility } = require('../services/validation/eligibilityCheck');

async function validateClaim(req, res) {
  const claim = req.body;
  const eligibility = await checkEligibility(claim);
  const validation = runRules(claim, { policy: eligibility.policy, provider: eligibility.provider });
  const consistency = checkConsistency(claim, null);
  res.json({ validation, consistency, eligibility });
}

function consistencyOnly(req, res) {
  res.json(checkConsistency(req.body.claim, req.body.extractedDocument || null));
}

async function eligibilityOnly(req, res) {
  res.json(await checkEligibility(req.body));
}

module.exports = { validateClaim, consistencyOnly, eligibilityOnly };
