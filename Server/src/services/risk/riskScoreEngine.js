const config = require('../../config');
const store = require('../../data/store');
const { clamp } = require('../../utils/stats');

/**
 * Risk Score Engine.
 *
 * Combines Claim Validation + Fraud Intelligence + Document AI confidence
 * into a single weighted, normalized (0-100) Claim Risk Score, plus a
 * Provider Risk Score and a Confidence Score for the extraction/analysis
 * itself. Weights live in config so they can be tuned/A-B tested without
 * code changes.
 */
function computeClaimRiskScore({ validationResult, consistencyResult, anomalyResult, duplicateResult, patternResult, networkResult, documentConfidence }) {
  const { weights } = config.risk;

  // Normalize each sub-signal to 0-100 before weighting.
  // Divisor reflects a realistic "bad" claim (~2 HIGH + 1 MEDIUM violation);
  // using the theoretical max (9) would dilute a single HIGH violation too much.
  const validationScore = clamp((validationResult.violationScore / 7) * 100);
  const consistencyPenalty = consistencyResult && !consistencyResult.passed
    ? clamp(consistencyResult.failedChecks.length * 20)
    : 0;
  const anomalyScore = anomalyResult.score;
  const duplicateScore = duplicateResult.score;
  const patternScore = patternResult.score;
  const networkScore = networkResult.score;
  // Low document confidence slightly raises risk (harder to verify claim).
  const documentRiskContribution = documentConfidence != null ? (1 - documentConfidence) * 100 : 0;

  const weighted =
    (validationScore * 0.6 + consistencyPenalty * 0.4) * weights.validation +
    anomalyScore * weights.anomaly +
    duplicateScore * weights.duplicate +
    patternScore * weights.pattern +
    networkScore * weights.network +
    documentRiskContribution * weights.documentConfidence;

  let claimRiskScore = clamp(Math.round(weighted));

  // Hard-stop: a HIGH severity rule violation (e.g. impossible dates, missing
  // mandatory fields) is a data-integrity failure on its own, regardless of
  // whether other signal families happen to be clean. Never let that get
  // diluted down into a LOW risk classification.
  const hasHighSeverityViolation = validationResult.violations.some((v) => v.severity === 'HIGH');
  if (hasHighSeverityViolation) {
    claimRiskScore = Math.max(claimRiskScore, config.risk.thresholds.low);
  }

  return {
    claimRiskScore,
    band: riskBand(claimRiskScore),
    breakdown: {
      validationScore: Math.round(validationScore),
      consistencyPenalty,
      anomalyScore,
      duplicateScore,
      patternScore,
      networkScore,
      documentRiskContribution: Math.round(documentRiskContribution),
      weightsUsed: weights,
    },
  };
}

function riskBand(score) {
  const { low, medium, high } = config.risk.thresholds;
  if (score < low) return 'LOW';
  if (score < medium) return 'MEDIUM';
  if (score < high) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Provider Risk Score: aggregates a provider's historical flagged ratio.
 * Distinct from a single claim's risk - this answers "should this
 * provider's claims generally receive more scrutiny".
 */
async function computeProviderRiskScore(providerId) {
  const provider = await store.findProvider(providerId);
  if (!provider) return { providerId, providerRiskScore: null, reason: 'Provider not found' };

  const flaggedRatio = provider.claimCount > 0 ? provider.flaggedCount / provider.claimCount : 0;
  const providerRiskScore = clamp(Math.round(flaggedRatio * 100));

  return {
    providerId,
    providerName: provider.name,
    claimCount: provider.claimCount,
    flaggedCount: provider.flaggedCount,
    flaggedRatio: Number(flaggedRatio.toFixed(2)),
    providerRiskScore,
    band: riskBand(providerRiskScore),
  };
}

/**
 * Confidence Score: how much the pipeline actually knows about this claim -
 * distinct from risk. A LOW risk score built on incomplete document
 * extraction deserves less trust than one built on a fully-verified claim.
 */
function computeConfidenceScore({ documentConfidence, anomalyResult }) {
  const docComponent = documentConfidence != null ? documentConfidence : 0.7; // neutral default when no document was processed
  const sampleSizeComponent = clamp((anomalyResult.sampleSize || 0) * 4, 0, 100) / 100;
  const confidence = Number((docComponent * 0.6 + sampleSizeComponent * 0.4).toFixed(2));
  return { confidenceScore: confidence, docComponent, sampleSizeComponent };
}

module.exports = { computeClaimRiskScore, computeProviderRiskScore, computeConfidenceScore, riskBand };
