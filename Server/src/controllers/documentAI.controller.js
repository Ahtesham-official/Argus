const ocrService = require('../services/documentAI/ocrService');
const classificationService = require('../services/documentAI/classificationService');
const extractionService = require('../services/documentAI/extractionService');

/** POST /api/document-ai/process - full OCR -> classify -> extract pipeline for one upload. */
async function processDocument(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: { message: 'No file uploaded (field name: "document")', code: 'VALIDATION_ERROR' } });
  }
  const ocr = await ocrService.extractText(req.file.path, req.file.mimetype);
  const classification = classificationService.classifyDocument(ocr.text);
  const extraction = await extractionService.extractFieldsAsync(ocr.text);

  res.json({
    file: { originalName: req.file.originalname, sizeBytes: req.file.size },
    ocr: { engine: ocr.engine, confidence: ocr.confidence, textPreview: ocr.text.slice(0, 500) },
    classification,
    extraction,
  });
}

/** POST /api/document-ai/classify - classify raw text without OCR (e.g. text already extracted upstream). */
function classifyText(req, res) {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: { message: '"text" is required', code: 'VALIDATION_ERROR' } });
  res.json(classificationService.classifyDocument(text));
}

/** POST /api/document-ai/extract - extract structured fields from raw text. */
async function extractText(req, res) {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: { message: '"text" is required', code: 'VALIDATION_ERROR' } });
  const result = await extractionService.extractFieldsAsync(text);
  res.json(result);
}

module.exports = { processDocument, classifyText, extractText };
