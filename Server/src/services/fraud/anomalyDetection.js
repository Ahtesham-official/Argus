const store = require('../../data/store');
const { mean, stdDev, zScore, iqrBounds, clamp } = require('../../utils/stats');

/**
 * Statistical anomaly detection on claim amount, benchmarked against the
 * historical distribution for the same procedure category. Combines two
 * classic, explainable methods:
 *   - Z-score (how many standard deviations from the category mean)
 *   - IQR (Tukey's fences - robust to skewed distributions)
 * Either method triggering is enough to flag - agreement between both
 * raises confidence, surfaced in the explanation.
 */
async function detectAmountAnomaly(claim) {
  const comparableClaims = await store.getHistoricalClaims({
    category: claim.category,
    excludeClaimId: claim.claimId,
  });

  if (comparableClaims.length < 5) {
    return {
      isAnomaly: false,
      reason: 'Insufficient historical data for this procedure category',
      sampleSize: comparableClaims.length,
      score: 0,
    };
  }

  const amounts = comparableClaims.map((c) => c.billedAmount);
  const avg = mean(amounts);
  const sd = stdDev(amounts, avg);
  const z = zScore(claim.billedAmount, avg, sd);
  const { lower, upper } = iqrBounds(amounts);

  const zFlag = Math.abs(z) >= 2.5;
  const iqrFlag = claim.billedAmount < lower || claim.billedAmount > upper;

  // Score in [0,100]: scales with how far outside normal range the claim is.
  const score = clamp(Math.round((Math.abs(z) / 4) * 100));

  return {
    isAnomaly: zFlag || iqrFlag,
    score,
    method: zFlag && iqrFlag ? 'z-score+iqr' : zFlag ? 'z-score' : iqrFlag ? 'iqr' : 'none',
    zScore: Number(z.toFixed(2)),
    categoryMean: Math.round(avg),
    categoryStdDev: Math.round(sd),
    iqrBounds: { lower: Math.round(lower), upper: Math.round(upper) },
    sampleSize: comparableClaims.length,
    billedAmount: claim.billedAmount,
  };
}

module.exports = { detectAmountAnomaly };
