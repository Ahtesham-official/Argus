const { computeProviderRiskScore } = require('../services/risk/riskScoreEngine');
const store = require('../data/store');

async function providerRisk(req, res) {
  res.json(await computeProviderRiskScore(req.params.providerId));
}

async function allProvidersRisk(req, res) {
  const providers = await store.listProviders();
  const scores = await Promise.all(providers.map((p) => computeProviderRiskScore(p.providerId)));
  res.json(scores);
}

module.exports = { providerRisk, allProvidersRisk };
