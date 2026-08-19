const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const logger = require('../../utils/logger');

let tesseractAvailable = null;

function checkTesseractAvailable() {
  return new Promise((resolve) => {
    if (tesseractAvailable !== null) return resolve(tesseractAvailable);
    execFile('tesseract', ['--version'], (err) => {
      tesseractAvailable = !err;
      resolve(tesseractAvailable);
    });
  });
}

/**
 * Runs OCR on an image/PDF using the system Tesseract binary.
 * This is the pluggable integration point referenced by the "OCR" box in
 * the Document AI layer - swap this function for AWS Textract, Azure Form
 * Recognizer, or Google Vision without touching classification/extraction.
 */
function runTesseract(filePath) {
  return new Promise((resolve, reject) => {
    const outBase = path.join(os.tmpdir(), `ocr-${Date.now()}`);
    execFile('tesseract', [filePath, outBase, '--psm', '6'], (err) => {
      if (err) return reject(err);
      fs.readFile(`${outBase}.txt`, 'utf8', (readErr, text) => {
        fs.unlink(`${outBase}.txt`, () => {});
        if (readErr) return reject(readErr);
        resolve(text);
      });
    });
  });
}

/**
 * Extracts raw text from an uploaded document.
 * - Image/PDF files: real OCR via the system tesseract binary when present.
 * - .txt files: read directly (useful for local dev/testing without a
 *   tesseract install, and for callers that already have extracted text,
 *   e.g. from an upstream NHCX/FHIR document payload).
 */
const groqService = require('../ai/groqService');

async function extractText(filePath, mimeType) {
  const isPlainText = mimeType === 'text/plain' || filePath.endsWith('.txt');
  if (isPlainText) {
    const text = fs.readFileSync(filePath, 'utf8');
    return { text, engine: 'passthrough-text', confidence: 1.0 };
  }

  // 1. Try Groq Vision OCR first if available
  if (groqService.isGroqAvailable()) {
    try {
      logger.info('Performing OCR using Groq Vision AI engine...', { filePath });
      const groqResult = await groqService.performGroqOCR(filePath, mimeType);
      return groqResult;
    } catch (err) {
      logger.warn('Groq OCR failed, falling back to local OCR engine', { error: err.message });
    }
  }

  // 2. Fallback to local Tesseract OCR
  const available = await checkTesseractAvailable();
  if (!available) {
    const err = new Error(
      'OCR engine unavailable: neither Groq API key nor local system "tesseract" binary was found. ' +
        'Configure GROQ_API_KEY in .env or install tesseract-ocr.'
    );
    err.code = 'OCR_ENGINE_UNAVAILABLE';
    throw err;
  }

  try {
    const text = await runTesseract(filePath);
    // Tesseract doesn't give a single scalar confidence via stdout mode;
    // approximate one from output density as a lightweight quality signal.
    const confidence = estimateOcrConfidence(text);
    return { text, engine: 'tesseract-5', confidence };
  } catch (err) {
    logger.error('OCR extraction failed', { error: err.message, filePath });
    const wrapped = new Error(`OCR processing failed: ${err.message}`);
    wrapped.code = 'OCR_PROCESSING_FAILED';
    throw wrapped;
  }
}

function estimateOcrConfidence(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const alnumRatio =
    (trimmed.match(/[a-zA-Z0-9]/g) || []).length / trimmed.length;
  const lengthScore = Math.min(trimmed.length / 300, 1);
  return Number((alnumRatio * 0.7 + lengthScore * 0.3).toFixed(2));
}

module.exports = { extractText, checkTesseractAvailable };
