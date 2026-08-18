const { daysBetween } = require('../../utils/stats');

/**
 * Cross-field internal consistency checks on a single claim - distinct
 * from the Rule Engine's policy/business rules. These catch data-quality
 * and logical-consistency problems, often the first sign of a fabricated
 * or poorly-transcribed claim.
 */
const MAX_REASONABLE_STAY_DAYS = {
  CARDIAC: 14,
  ORTHOPEDIC: 10,
  GENERAL_SURGERY: 7,
  MATERNITY: 6,
  DEFAULT: 10,
};

function checkConsistency(claim, extractedDocument) {
  const checks = [];

  // 1. Length-of-stay sanity check
  if (claim.admissionDate && claim.dischargeDate) {
    const stay = daysBetween(claim.admissionDate, claim.dischargeDate);
    const maxStay = MAX_REASONABLE_STAY_DAYS[claim.category] || MAX_REASONABLE_STAY_DAYS.DEFAULT;
    checks.push({
      check: 'LENGTH_OF_STAY_REASONABLE',
      passed: stay <= maxStay,
      detail: { stayDays: stay, maxExpected: maxStay },
    });
  }

  // 2. Itemized charges should sum close to the total billed amount
  if (Array.isArray(claim.itemizedCharges) && claim.itemizedCharges.length && claim.billedAmount) {
    const sum = claim.itemizedCharges.reduce((s, item) => s + (item.amount || 0), 0);
    const tolerance = claim.billedAmount * 0.02; // 2% tolerance for rounding
    checks.push({
      check: 'ITEMIZED_SUM_MATCHES_TOTAL',
      passed: Math.abs(sum - claim.billedAmount) <= tolerance,
      detail: { itemizedSum: sum, billedAmount: claim.billedAmount, tolerance },
    });
  }

  // 3. OCR-extracted amount (if a document was processed) should roughly
  //    match the amount declared on the structured claim payload.
  if (extractedDocument?.fields?.totalAmount && claim.billedAmount) {
    const extracted = extractedDocument.fields.totalAmount;
    const diffRatio = Math.abs(extracted - claim.billedAmount) / claim.billedAmount;
    checks.push({
      check: 'DOCUMENT_AMOUNT_MATCHES_CLAIM_AMOUNT',
      passed: diffRatio <= 0.05,
      detail: { extractedAmount: extracted, claimedAmount: claim.billedAmount, diffRatio: Number(diffRatio.toFixed(3)) },
    });
  }

  // 4. Admission date should not be in the future
  if (claim.admissionDate) {
    checks.push({
      check: 'ADMISSION_DATE_NOT_FUTURE',
      passed: new Date(claim.admissionDate) <= new Date(),
      detail: { admissionDate: claim.admissionDate },
    });
  }

  const failed = checks.filter((c) => !c.passed);
  return {
    passed: failed.length === 0,
    checks,
    failedChecks: failed,
  };
}

module.exports = { checkConsistency };
