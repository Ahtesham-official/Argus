/**
 * Smoke test - starts the app in-process (no separate server needed) and
 * exercises every layer of the AI Intelligence pipeline. Run with:
 *   npm run smoke-test
 *
 * This is a fast sanity check, not a full test suite - it asserts on
 * shape/behavior, not exact scores (scores depend on the seeded random
 * historical data).
 */
const http = require('http');
const app = require('../src/app');

const PORT = 4999;
let failures = 0;

function assert(condition, message) {
  if (!condition) {
    failures += 1;
    console.error(`FAIL: ${message}`);
  } else {
    console.log(`PASS: ${message}`);
  }
}

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      { hostname: 'localhost', port: PORT, path, method, headers: { 'Content-Type': 'application/json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) } },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : null });
          } catch (e) {
            resolve({ status: res.statusCode, body: raw });
          }
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

const connectDB = require('../src/config/database');

async function run() {
  await connectDB();
  const server = app.listen(PORT);
  console.log(`Smoke test server listening on ${PORT}\n`);

  try {
    // Health check
    const health = await request('GET', '/health');
    assert(health.status === 200 && health.body.status === 'ok', 'GET /health returns 200 + ok status');

    // Sample data endpoint
    const meta = await request('GET', '/api/meta/sample-data');
    assert(meta.status === 200 && meta.body.providers.length > 0, 'GET /api/meta/sample-data returns seeded providers');

    // Normal claim through the full pipeline
    const normalClaim = {
      patientId: 'PAT-2000',
      providerId: 'PRV-1000',
      category: 'GENERAL_SURGERY',
      procedureCode: 'PRC-GSUR-03',
      diagnosisCode: 'K35',
      admissionDate: '2026-01-05',
      dischargeDate: '2026-01-07',
      billedAmount: 54000,
    };
    const normalResult = await request('POST', '/api/pipeline/analyze-claim', { claim: normalClaim });
    assert(normalResult.status === 200, 'POST /api/pipeline/analyze-claim (normal claim) returns 200');
    assert(typeof normalResult.body.risk.claim.claimRiskScore === 'number', 'Pipeline returns a numeric claimRiskScore');
    assert(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(normalResult.body.risk.claim.band), 'Risk band is one of the expected buckets');

    // Deliberately broken claim: impossible dates + diagnosis mismatch + extreme amount
    const badClaim = {
      patientId: 'PAT-2001',
      providerId: 'PRV-1003',
      category: 'GENERAL_SURGERY',
      procedureCode: 'PRC-GSUR-03',
      diagnosisCode: 'I21',
      admissionDate: '2026-01-10',
      dischargeDate: '2026-01-09',
      billedAmount: 480000,
    };
    const badResult = await request('POST', '/api/pipeline/analyze-claim', { claim: badClaim });
    assert(badResult.body.validation.violations.some((v) => v.ruleId === 'R003'), 'Rule engine catches discharge-before-admission (R003)');
    assert(badResult.body.validation.violations.some((v) => v.ruleId === 'R005'), 'Rule engine catches procedure/diagnosis mismatch (R005)');
    assert(badResult.body.fraud.anomaly.isAnomaly === true, 'Anomaly detector flags the extreme billed amount');
    assert(badResult.body.explainability.reasons.length > 0, 'Explainability layer produces reasons for the flagged claim');
    assert(badResult.body.explainability.recommendation.action !== 'AUTO_APPROVE', 'A flagged claim is never auto-approved');

    // Duplicate detection: submit the same claim twice
    const dupClaim = {
      patientId: 'PAT-2010',
      providerId: 'PRV-1001',
      category: 'ORTHOPEDIC',
      procedureCode: 'PRC-ORTH-02',
      diagnosisCode: 'M17',
      admissionDate: '2026-02-01',
      dischargeDate: '2026-02-03',
      billedAmount: 90000,
    };
    await request('POST', '/api/pipeline/analyze-claim', { claim: dupClaim });
    const dupResult = await request('POST', '/api/pipeline/analyze-claim', { claim: dupClaim });
    assert(dupResult.body.fraud.duplicate.isDuplicate === true, 'Duplicate detector catches an exact resubmission');

    // Validation-only endpoint with missing mandatory fields
    const missingFieldsResult = await request('POST', '/api/validation/validate', { patientId: 'PAT-2000' });
    assert(missingFieldsResult.body.validation.passed === false, 'Rule engine rejects a claim missing mandatory fields');

    // Document AI: classify + extract raw text without a file upload
    const docText =
      'Patient Name: Ramesh Kumar\nAdmission Date: 05/01/2026\nDischarge Date: 07/01/2026\nDiagnosis: K35\nTotal Amount: Rs. 54500';
    const classifyResult = await request('POST', '/api/document-ai/classify', { text: docText });
    assert(classifyResult.status === 200 && classifyResult.body.documentType, 'Document classification returns a document type');
    const extractResult = await request('POST', '/api/document-ai/extract', { text: docText });
    assert(extractResult.body.fields.totalAmount === 54500, 'Field extraction correctly parses the total amount');
    assert(extractResult.body.fields.patientName === 'Ramesh Kumar', 'Field extraction correctly parses the patient name');

    // Provider risk leaderboard
    const providerRisk = await request('GET', '/api/risk/providers');
    assert(providerRisk.status === 200 && Array.isArray(providerRisk.body), 'GET /api/risk/providers returns a list');

    // Error handling
    const badRequest = await request('POST', '/api/pipeline/analyze-claim', {});
    assert(badRequest.status === 400, 'Empty claim payload returns 400');
    const notFound = await request('GET', '/api/nonexistent');
    assert(notFound.status === 404, 'Unknown route returns 404');
  } finally {
    server.close();
  }

  console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
}

run().catch((err) => {
  console.error('Smoke test crashed:', err);
  process.exit(1);
});
