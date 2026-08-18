const store = require('../../data/store');
const { stringSimilarity, daysBetween, clamp } = require('../../utils/stats');

const NEAR_DUPLICATE_WINDOW_DAYS = 30;
const NEAR_DUPLICATE_AMOUNT_TOLERANCE = 0.1; // 10%

/**
 * Exact + fuzzy (near-)duplicate detection.
 * - Exact: identical patient+provider+procedure+admission date already exists.
 * - Near-duplicate: same patient+provider+category within a short window and
 *   a similar amount - a common signature of resubmission or split-billing
 *   fraud (breaking one large claim into several smaller ones).
 */
async function detectDuplicates(claim) {
  const allClaims = await store.getAllClaims();
  const candidates = allClaims.filter(
    (c) => c.claimId !== claim.claimId && c.patientId === claim.patientId
  );

  const exactMatches = candidates.filter(
    (c) =>
      c.providerId === claim.providerId &&
      c.procedureCode === claim.procedureCode &&
      (c.admissionDate && claim.admissionDate && new Date(c.admissionDate).getTime() === new Date(claim.admissionDate).getTime())
  );

  const nearMatches = candidates
    .filter((c) => c.providerId === claim.providerId && c.category === claim.category)
    .map((c) => {
      const dayGap = daysBetween(c.admissionDate, claim.admissionDate);
      const amountDiffRatio = claim.billedAmount
        ? Math.abs(c.billedAmount - claim.billedAmount) / claim.billedAmount
        : 1;
      return { claim: c, dayGap, amountDiffRatio };
    })
    .filter(
      (m) =>
        m.dayGap <= NEAR_DUPLICATE_WINDOW_DAYS &&
        m.amountDiffRatio <= NEAR_DUPLICATE_AMOUNT_TOLERANCE
    );

  // Optional: fuzzy match on free-text claim description / invoice number
  let descriptionSimilarity = null;
  if (claim.invoiceNumber) {
    const similar = candidates
      .filter((c) => c.invoiceNumber)
      .map((c) => ({ claimId: c.claimId, similarity: stringSimilarity(c.invoiceNumber, claim.invoiceNumber) }))
      .filter((m) => m.similarity >= 0.85)
      .sort((a, b) => b.similarity - a.similarity);
    if (similar.length) descriptionSimilarity = similar;
  }

  const isDuplicate = exactMatches.length > 0;
  const isNearDuplicate = nearMatches.length > 0;

  const score = clamp(
    (exactMatches.length > 0 ? 90 : 0) +
      (isNearDuplicate ? 40 + nearMatches.length * 5 : 0) +
      (descriptionSimilarity ? 20 : 0)
  );

  return {
    isDuplicate,
    isNearDuplicate,
    score,
    exactMatches: exactMatches.map((c) => c.claimId),
    nearMatches: nearMatches.map((m) => ({
      claimId: m.claim.claimId,
      dayGap: Number(m.dayGap.toFixed(1)),
      amountDiffRatio: Number(m.amountDiffRatio.toFixed(3)),
    })),
    descriptionSimilarity,
  };
}

module.exports = { detectDuplicates };
