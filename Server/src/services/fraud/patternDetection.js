const store = require('../../data/store');
const { daysBetween, clamp } = require('../../utils/stats');

const HIGH_FREQUENCY_WINDOW_DAYS = 90;
const HIGH_FREQUENCY_THRESHOLD = 3;
const THRESHOLD_SHAVING_BAND = 0.05; // within 5% below a round-number approval threshold
const COMMON_APPROVAL_THRESHOLDS = [50000, 100000, 200000, 500000];

/**
 * Rule-based pattern signatures evaluated against the provider's / patient's
 * claim history. Each detector is independent and contributes named,
 * explainable evidence - this is what the Explainability layer surfaces
 * as "why was this flagged".
 */
async function detectPatterns(claim) {
  const patterns = [];

  // 1. High-frequency billing: same patient, many claims in a short window.
  const allClaims = await store.getAllClaims();
  const patientClaims = allClaims
    .filter((c) => c.patientId === claim.patientId && c.claimId !== claim.claimId);
  const recentPatientClaims = patientClaims.filter(
    (c) => daysBetween(c.admissionDate, claim.admissionDate) <= HIGH_FREQUENCY_WINDOW_DAYS
  );
  if (recentPatientClaims.length >= HIGH_FREQUENCY_THRESHOLD) {
    patterns.push({
      pattern: 'HIGH_FREQUENCY_PATIENT_CLAIMS',
      description: `Patient has ${recentPatientClaims.length} other claims within ${HIGH_FREQUENCY_WINDOW_DAYS} days`,
      severity: 'MEDIUM',
      evidence: recentPatientClaims.map((c) => c.claimId),
    });
  }

  // 2. Threshold shaving: provider repeatedly bills just under a round
  //    approval threshold - a classic way to dodge stricter review tiers.
  const providerClaims = allClaims.filter((c) => c.providerId === claim.providerId);
  const shavedClaims = providerClaims.filter((c) =>
    COMMON_APPROVAL_THRESHOLDS.some(
      (t) => c.billedAmount < t && c.billedAmount >= t * (1 - THRESHOLD_SHAVING_BAND)
    )
  );
  const claimIsShaved = COMMON_APPROVAL_THRESHOLDS.some(
    (t) => claim.billedAmount < t && claim.billedAmount >= t * (1 - THRESHOLD_SHAVING_BAND)
  );
  if (claimIsShaved && shavedClaims.length >= 3) {
    patterns.push({
      pattern: 'THRESHOLD_SHAVING',
      description: `Provider has ${shavedClaims.length} claims billed just under a common approval threshold`,
      severity: 'HIGH',
      evidence: shavedClaims.map((c) => c.claimId),
    });
  }

  // 3. Upcoding suspicion: this provider bills this procedure category
  //    significantly above the cross-provider average, repeatedly.
  const categoryClaimsAllProviders = await store.getHistoricalClaims({ category: claim.category });
  const categoryClaimsThisProvider = categoryClaimsAllProviders.filter(
    (c) => c.providerId === claim.providerId
  );
  if (categoryClaimsAllProviders.length >= 10 && categoryClaimsThisProvider.length >= 3) {
    const overallAvg =
      categoryClaimsAllProviders.reduce((s, c) => s + c.billedAmount, 0) / categoryClaimsAllProviders.length;
    const providerAvg =
      categoryClaimsThisProvider.reduce((s, c) => s + c.billedAmount, 0) / categoryClaimsThisProvider.length;
    if (providerAvg > overallAvg * 1.4) {
      patterns.push({
        pattern: 'PROVIDER_UPCODING_SUSPICION',
        description: `Provider's average ${claim.category} claim (${Math.round(providerAvg)}) is ${(
          (providerAvg / overallAvg - 1) *
          100
        ).toFixed(0)}% above the cross-provider average (${Math.round(overallAvg)})`,
        severity: 'MEDIUM',
        evidence: { providerAvg: Math.round(providerAvg), overallAvg: Math.round(overallAvg) },
      });
    }
  }

  const score = clamp(
    patterns.reduce((sum, p) => sum + (p.severity === 'HIGH' ? 40 : 25), 0)
  );

  return {
    matchedPatterns: patterns,
    hasPatternMatch: patterns.length > 0,
    score,
  };
}

module.exports = { detectPatterns };
