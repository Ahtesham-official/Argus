const { analyzeClaim } = require('../pipeline/claimIntelligencePipeline');

/**
 * POST /api/pipeline/analyze-claim
 * multipart/form-data: "claim" (JSON string) + optional "document" (file)
 *   OR application/json: { claim: {...} } with no document.
 */
async function analyze(req, res) {
  let claim;
  try {
    claim = req.body.claim ? (typeof req.body.claim === 'string' ? JSON.parse(req.body.claim) : req.body.claim) : req.body;
  } catch (e) {
    return res.status(400).json({ error: { message: 'Invalid JSON in "claim" field', code: 'VALIDATION_ERROR' } });
  }
  if (!claim || Object.keys(claim).length === 0) {
    return res.status(400).json({ error: { message: 'Claim payload is required', code: 'VALIDATION_ERROR' } });
  }

  const documentFile = req.file ? { path: req.file.path, mimeType: req.file.mimetype } : null;
  const result = await analyzeClaim(claim, documentFile);
  res.json(result);
}

module.exports = { analyze };
