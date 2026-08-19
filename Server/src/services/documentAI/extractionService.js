/**
 * Structured field extraction from raw OCR text.
 *
 * Regex/pattern based extraction tuned for Indian hospital billing &
 * discharge documents. Each extractor is independent and returns null on
 * no-match rather than throwing, so partial extraction is always possible -
 * completeness is then surfaced as a confidence signal for the Risk Score
 * Engine / Explainability layer.
 */
const FIELD_PATTERNS = {
  patientName: /patient\s*name\s*[:\-]\s*([^\r\n]{2,60})/i,
  hospitalName: /(?:hospital|nursing home|medical center)\s*[:\-]\s*([^\r\n]{2,80})/i,
  policyNumber: /policy\s*(?:no\.?|number)\s*[:\-]\s*([A-Za-z0-9\-\/]{4,30})/i,
  admissionDate: /admission\s*date\s*[:\-]\s*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})/i,
  dischargeDate: /discharge\s*date\s*[:\-]\s*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})/i,
  diagnosisCode: /\b([A-TV-Z][0-9]{2}(?:\.[0-9]{1,2})?)\b/, // ICD-10-like
  totalAmount: /(?:total\s*amount|amount\s*payable|grand\s*total|net\s*amount|total)\s*[:\-]?\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i,
};

function parseAmount(raw) {
  if (!raw) return null;
  const cleaned = raw.replace(/,/g, '');
  const value = parseFloat(cleaned);
  return Number.isFinite(value) ? value : null;
}

const groqService = require('../ai/groqService');
const logger = require('../../utils/logger');

function extractFieldsRegex(text = '') {
  const fields = {};
  for (const [field, pattern] of Object.entries(FIELD_PATTERNS)) {
    const match = text.match(pattern);
    fields[field] = match ? match[1].trim() : null;
  }
  if (fields.totalAmount) fields.totalAmount = parseAmount(fields.totalAmount);

  const expectedFieldCount = Object.keys(FIELD_PATTERNS).length;
  const foundFieldCount = Object.values(fields).filter((v) => v !== null && v !== undefined).length;
  const completeness = Number((foundFieldCount / expectedFieldCount).toFixed(2));

  return {
    fields,
    completeness,
    foundFieldCount,
    expectedFieldCount,
    engine: 'regex-heuristic',
  };
}

async function extractFieldsAsync(text = '') {
  if (groqService.isGroqAvailable()) {
    try {
      logger.info('Performing NLP Field Extraction via Groq AI Engine...');
      return await groqService.performGroqNLPExtraction(text);
    } catch (err) {
      logger.warn('Groq NLP field extraction failed, falling back to regex rules', { error: err.message });
    }
  }
  return extractFieldsRegex(text);
}

function extractFields(text = '') {
  return extractFieldsRegex(text);
}

module.exports = { extractFields, extractFieldsAsync, extractFieldsRegex, FIELD_PATTERNS };
