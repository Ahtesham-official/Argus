/**
 * Document classification.
 *
 * Heuristic keyword-scoring classifier. This is the same pattern production
 * systems use as a fast, explainable first pass (or as a fallback / sanity
 * check next to a trained transformer classifier) - each document type is
 * defined by a weighted keyword set, and the highest-scoring type wins.
 * Swap `scoreDocument` for a call to a hosted classification model without
 * changing the caller's contract: { documentType, confidence, matchedKeywords }.
 */
const DOCUMENT_TYPES = {
  HOSPITAL_BILL: ['invoice', 'bill', 'total amount', 'itemized', 'amount payable', 'room rent', 'hospital'],
  DISCHARGE_SUMMARY: ['discharge summary', 'admission date', 'discharge date', 'diagnosis', 'course in hospital', 'condition on discharge'],
  PRESCRIPTION: ['rx', 'prescription', 'dosage', 'tablet', 'mg', 'take twice daily', 'refill'],
  LAB_REPORT: ['laboratory', 'specimen', 'reference range', 'test name', 'result', 'pathology'],
  DIAGNOSTIC_REPORT: ['mri', 'ct scan', 'x-ray', 'radiology', 'impression', 'findings'],
  ID_PROOF: ['aadhaar', 'passport', 'date of birth', 'government of india', 'permanent account number'],
  INSURANCE_CARD: ['policy number', 'sum insured', 'tpa', 'insurer', 'member id', 'cashless'],
};

function classifyDocument(text = '') {
  const lower = text.toLowerCase();
  const scores = {};

  for (const [type, keywords] of Object.entries(DOCUMENT_TYPES)) {
    const matched = keywords.filter((kw) => lower.includes(kw));
    scores[type] = { count: matched.length, matched, ratio: matched.length / keywords.length };
  }

  const [bestType, bestScore] = Object.entries(scores).sort(
    (a, b) => b[1].ratio - a[1].ratio
  )[0];

  if (bestScore.count === 0) {
    return {
      documentType: 'UNKNOWN',
      confidence: 0,
      matchedKeywords: [],
      allScores: scores,
    };
  }

  return {
    documentType: bestType,
    confidence: Number(Math.min(0.5 + bestScore.ratio, 0.98).toFixed(2)),
    matchedKeywords: bestScore.matched,
    allScores: scores,
  };
}

module.exports = { classifyDocument, DOCUMENT_TYPES };
