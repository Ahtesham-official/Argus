const { detectAmountAnomaly } = require('../services/fraud/anomalyDetection');
const { detectDuplicates } = require('../services/fraud/duplicateDetection');
const { detectPatterns } = require('../services/fraud/patternDetection');
const { analyzeNetwork } = require('../services/fraud/networkAnalysis');

async function anomaly(req, res) {
  res.json(await detectAmountAnomaly(req.body));
}
async function duplicate(req, res) {
  res.json(await detectDuplicates(req.body));
}
async function pattern(req, res) {
  res.json(await detectPatterns(req.body));
}
async function network(req, res) {
  res.json(await analyzeNetwork(req.body));
}
/** Runs all four fraud detectors together without validation/risk/explainability. */
async function fullScan(req, res) {
  const claim = req.body;
  const [anomalyResult, duplicateResult, patternResult, networkResult] = await Promise.all([
    detectAmountAnomaly(claim),
    detectDuplicates(claim),
    detectPatterns(claim),
    analyzeNetwork(claim),
  ]);
  res.json({
    anomaly: anomalyResult,
    duplicate: duplicateResult,
    pattern: patternResult,
    network: networkResult,
  });
}

module.exports = { anomaly, duplicate, pattern, network, fullScan };
