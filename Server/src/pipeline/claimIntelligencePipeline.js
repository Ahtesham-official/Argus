const { v4: uuid } = require('uuid');
const store = require('../data/store');

const ocrService = require('../services/documentAI/ocrService');
const classificationService = require('../services/documentAI/classificationService');
const extractionService = require('../services/documentAI/extractionService');

const { runRules } = require('../services/validation/ruleEngine');
const { checkConsistency } = require('../services/validation/consistencyCheck');
const { checkEligibility } = require('../services/validation/eligibilityCheck');

const { detectAmountAnomaly } = require('../services/fraud/anomalyDetection');
const { detectDuplicates } = require('../services/fraud/duplicateDetection');
const { detectPatterns } = require('../services/fraud/patternDetection');
const { analyzeNetwork } = require('../services/fraud/networkAnalysis');

const { computeClaimRiskScore, computeProviderRiskScore, computeConfidenceScore } = require('../services/risk/riskScoreEngine');
const { buildExplanation } = require('../services/explainability/explainabilityEngine');

/**
 * Runs a claim through the full AI Intelligence layer, mirroring the
 * architecture diagram's top-to-bottom flow:
 *
 *   Document AI -> Claim Validation -> Fraud Intelligence
 *                -> Risk Score Engine -> Explainability AI
 *
 * `documentFile` is optional - {path, mimeType} for an uploaded document to
 * OCR/classify/extract before validation. If omitted, the pipeline runs on
 * the structured `claim` payload alone.
 */
async function analyzeClaim(claim, documentFile) {
  const claimId = claim.claimId || `CLM-NEW-${uuid().slice(0, 8)}`;
  const enrichedClaim = { ...claim, claimId };

  // --- 1. Document AI (optional) ---------------------------------------
  let documentAIResult = null;
  if (documentFile) {
    const ocr = await ocrService.extractText(documentFile.path, documentFile.mimeType);
    const classification = classificationService.classifyDocument(ocr.text);
    const extraction = extractionService.extractFields(ocr.text);
    documentAIResult = {
      ocrEngine: ocr.engine,
      ocrConfidence: ocr.confidence,
      classification,
      extraction,
    };
  }
  const documentConfidence = documentAIResult
    ? Number(((documentAIResult.ocrConfidence + documentAIResult.extraction.completeness) / 2).toFixed(2))
    : null;

  // --- 2. Claim Validation ----------------------------------------------
  const eligibilityResult = await checkEligibility(enrichedClaim);
  const validationResult = runRules(enrichedClaim, {
    policy: eligibilityResult.policy,
    provider: eligibilityResult.provider,
  });
  const consistencyResult = checkConsistency(enrichedClaim, documentAIResult?.extraction ? { fields: documentAIResult.extraction.fields } : null);

  // --- 3. Fraud Intelligence ----------------------------------------------
  const anomalyResult = await detectAmountAnomaly(enrichedClaim);
  const duplicateResult = await detectDuplicates(enrichedClaim);
  const patternResult = await detectPatterns(enrichedClaim);
  const networkResult = await analyzeNetwork(enrichedClaim);

  // --- 4. Risk Score Engine ----------------------------------------------
  const riskResult = computeClaimRiskScore({
    validationResult,
    consistencyResult,
    anomalyResult,
    duplicateResult,
    patternResult,
    networkResult,
    documentConfidence,
  });
  const providerRiskResult = await computeProviderRiskScore(enrichedClaim.providerId);
  const confidenceResult = computeConfidenceScore({ documentConfidence, anomalyResult });

  // --- 5. Explainability AI ----------------------------------------------
  const explanation = buildExplanation({
    claim: enrichedClaim,
    validationResult,
    consistencyResult,
    eligibilityResult,
    anomalyResult,
    duplicateResult,
    patternResult,
    networkResult,
    riskResult,
  });

  // Persist + feed back into the provider's flagged count for future scoring.
  await store.saveSubmittedClaim(enrichedClaim);
  if (riskResult.band === 'HIGH' || riskResult.band === 'CRITICAL') {
    await store.flagProvider(enrichedClaim.providerId);
  }

  return {
    claimId,
    claim: enrichedClaim,
    documentAI: documentAIResult,
    validation: { ...validationResult, consistency: consistencyResult, eligibility: eligibilityResult },
    fraud: { anomaly: anomalyResult, duplicate: duplicateResult, pattern: patternResult, network: networkResult },
    risk: { claim: riskResult, provider: providerRiskResult, confidence: confidenceResult },
    explainability: explanation,
  };
}

module.exports = { analyzeClaim };
