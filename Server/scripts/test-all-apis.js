const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 2001; // Targeting the running server
const HOST = 'localhost';

// Helper for HTTP requests
function sendRequest(options, bodyData, isBuffer = false) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: HOST,
        port: PORT,
        path: options.path,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let raw = [];
        res.on('data', (chunk) => raw.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(raw);
          const text = buffer.toString('utf8');
          let parsed;
          try {
            parsed = JSON.parse(text);
          } catch (e) {
            parsed = text;
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );

    req.on('error', (err) => {
      reject(err);
    });

    if (bodyData) {
      if (isBuffer) {
        req.write(bodyData);
      } else {
        req.write(typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData));
      }
    }
    req.end();
  });
}

// Multipart form-data builder helper
function buildMultipartFormData(fields, files) {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const chunks = [];

  for (const [key, value] of Object.entries(fields)) {
    chunks.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${typeof value === 'object' ? JSON.stringify(value) : value}\r\n`));
  }

  for (const file of files) {
    const fileContent = fs.readFileSync(file.path);
    chunks.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${file.fieldname}"; filename="${file.filename}"\r\nContent-Type: ${file.mimetype}\r\n\r\n`
      )
    );
    chunks.push(fileContent);
    chunks.push(Buffer.from('\r\n'));
  }

  chunks.push(Buffer.from(`--${boundary}--\r\n`));

  const body = Buffer.concat(chunks);
  const headers = {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': body.length,
  };

  return { body, headers, boundary: `multipart/form-data; boundary=${boundary}` };
}

// Sample test data
const sampleClaim = {
  patientId: 'PAT-2000',
  providerId: 'PRV-1000',
  category: 'GENERAL_SURGERY',
  procedureCode: 'PRC-GSUR-03',
  diagnosisCode: 'K35',
  admissionDate: '2026-01-05',
  dischargeDate: '2026-01-07',
  billedAmount: 54000,
};

const sampleText = `Hospital Bill / Medical Summary
Patient Name: Ramesh Kumar
Admission Date: 05/01/2026
Discharge Date: 07/01/2026
Diagnosis: Acute Appendicitis (K35)
Total Amount: Rs. 54500`;

// Create a temp file for document testing
const tempDocPath = path.join(__dirname, 'temp_test_doc.txt');
fs.writeFileSync(tempDocPath, sampleText);

const results = [];

function record(name, passed, details, responseBody) {
  results.push({ name, passed, details, responseBody });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} | ${name} ${details ? `(${details})` : ''}`);
  if (!passed && responseBody) {
    console.log(`   ↳ Response Body: ${JSON.stringify(responseBody, null, 2)}`);
  }
}

async function runTests() {
  console.log(`==================================================`);
  console.log(`🧪 BACKEND API TEST SUITE`);
  console.log(`Target Server: http://${HOST}:${PORT}`);
  console.log(`==================================================\n`);

  try {
    // 1. GET /health
    const resHealth = await sendRequest({ path: '/health', method: 'GET' });
    record('GET /health', resHealth.status === 200 && resHealth.body.status === 'ok', `Status: ${resHealth.status}`, resHealth.body);

    // 2. GET /api/meta/sample-data
    const resMeta = await sendRequest({ path: '/api/meta/sample-data', method: 'GET' });
    record(
      'GET /api/meta/sample-data',
      resMeta.status === 200 && Array.isArray(resMeta.body.providers) && resMeta.body.providers.length > 0,
      `Providers count: ${resMeta.body.providers ? resMeta.body.providers.length : 0}`,
      resMeta.body
    );

    // 3. POST /api/document-ai/classify
    const resClassify = await sendRequest(
      { path: '/api/document-ai/classify', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { text: sampleText }
    );
    record(
      'POST /api/document-ai/classify',
      resClassify.status === 200 && !!resClassify.body.documentType,
      `DocType: ${resClassify.body.documentType}`,
      resClassify.body
    );

    // 4. POST /api/document-ai/extract
    const resExtract = await sendRequest(
      { path: '/api/document-ai/extract', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { text: sampleText }
    );
    record(
      'POST /api/document-ai/extract',
      resExtract.status === 200 && resExtract.body.fields && resExtract.body.fields.totalAmount === 54500,
      `Extracted Patient: ${resExtract.body.fields?.patientName}, Amount: ${resExtract.body.fields?.totalAmount}`,
      resExtract.body
    );

    // 5. POST /api/document-ai/process (file upload)
    const formProcess = buildMultipartFormData({}, [{ fieldname: 'document', filename: 'invoice.txt', mimetype: 'text/plain', path: tempDocPath }]);
    const resProcess = await sendRequest(
      { path: '/api/document-ai/process', method: 'POST', headers: formProcess.headers },
      formProcess.body,
      true
    );
    record(
      'POST /api/document-ai/process (file upload)',
      resProcess.status === 200 && resProcess.body.file && resProcess.body.classification && resProcess.body.extraction,
      `File name: ${resProcess.body.file?.originalName}`,
      resProcess.body
    );

    // 6. POST /api/validation/validate
    const resValidate = await sendRequest(
      { path: '/api/validation/validate', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      sampleClaim
    );
    record(
      'POST /api/validation/validate',
      resValidate.status === 200 && resValidate.body.validation && resValidate.body.eligibility,
      `Validation Passed: ${resValidate.body.validation?.passed}`,
      resValidate.body
    );

    // 7. POST /api/validation/consistency
    const resConsistency = await sendRequest(
      { path: '/api/validation/consistency', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { claim: sampleClaim, extractedDocument: { fields: { totalAmount: 54000 } } }
    );
    record(
      'POST /api/validation/consistency',
      resConsistency.status === 200 && resConsistency.body.passed !== undefined,
      `Passed: ${resConsistency.body.passed}`,
      resConsistency.body
    );

    // 8. POST /api/validation/eligibility
    const resEligibility = await sendRequest(
      { path: '/api/validation/eligibility', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      sampleClaim
    );
    record(
      'POST /api/validation/eligibility',
      resEligibility.status === 200 && resEligibility.body.policy !== undefined,
      `Policy Active: ${resEligibility.body.policy?.status}`,
      resEligibility.body
    );

    // 9. POST /api/fraud/anomaly
    const resAnomaly = await sendRequest(
      { path: '/api/fraud/anomaly', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      sampleClaim
    );
    record(
      'POST /api/fraud/anomaly',
      resAnomaly.status === 200 && resAnomaly.body.isAnomaly !== undefined,
      `Is Anomaly: ${resAnomaly.body.isAnomaly}`,
      resAnomaly.body
    );

    // 10. POST /api/fraud/duplicate
    const resDuplicate = await sendRequest(
      { path: '/api/fraud/duplicate', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      sampleClaim
    );
    record(
      'POST /api/fraud/duplicate',
      resDuplicate.status === 200 && resDuplicate.body.isDuplicate !== undefined,
      `Is Duplicate: ${resDuplicate.body.isDuplicate}`,
      resDuplicate.body
    );

    // 11. POST /api/fraud/pattern
    const resPattern = await sendRequest(
      { path: '/api/fraud/pattern', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      sampleClaim
    );
    record(
      'POST /api/fraud/pattern',
      resPattern.status === 200 && Array.isArray(resPattern.body.matchedPatterns),
      `Matched Patterns: ${resPattern.body.matchedPatterns?.length}`,
      resPattern.body
    );

    // 12. POST /api/fraud/network
    const resNetwork = await sendRequest(
      { path: '/api/fraud/network', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      sampleClaim
    );
    record(
      'POST /api/fraud/network',
      resNetwork.status === 200 && resNetwork.body.score !== undefined,
      `Network Score: ${resNetwork.body.score}`,
      resNetwork.body
    );

    // 13. POST /api/fraud/scan
    const resScan = await sendRequest(
      { path: '/api/fraud/scan', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      sampleClaim
    );
    record(
      'POST /api/fraud/scan',
      resScan.status === 200 && resScan.body.anomaly && resScan.body.duplicate && resScan.body.pattern && resScan.body.network,
      `Full Scan Completed`,
      resScan.body
    );

    // 14. GET /api/risk/provider/:providerId
    const resRiskProvider = await sendRequest({ path: '/api/risk/provider/PRV-1000', method: 'GET' });
    record(
      'GET /api/risk/provider/PRV-1000',
      resRiskProvider.status === 200 && resRiskProvider.body.providerId === 'PRV-1000',
      `Score: ${resRiskProvider.body.providerRiskScore}`,
      resRiskProvider.body
    );

    // 15. GET /api/risk/providers
    const resRiskProviders = await sendRequest({ path: '/api/risk/providers', method: 'GET' });
    record(
      'GET /api/risk/providers',
      resRiskProviders.status === 200 && Array.isArray(resRiskProviders.body),
      `Provider Count: ${resRiskProviders.body.length}`,
      resRiskProviders.body
    );

    // 16. POST /api/pipeline/analyze-claim (JSON payload)
    const resPipelineJson = await sendRequest(
      { path: '/api/pipeline/analyze-claim', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { claim: sampleClaim }
    );
    record(
      'POST /api/pipeline/analyze-claim (JSON)',
      resPipelineJson.status === 200 && resPipelineJson.body.risk && resPipelineJson.body.explainability,
      `Risk Band: ${resPipelineJson.body.risk?.claim?.band}, Action: ${resPipelineJson.body.explainability?.recommendation?.action}`,
      resPipelineJson.body
    );

    // 17. POST /api/pipeline/analyze-claim (Multipart form-data with claim & file)
    const formPipeline = buildMultipartFormData(
      { claim: JSON.stringify(sampleClaim) },
      [{ fieldname: 'document', filename: 'bill.txt', mimetype: 'text/plain', path: tempDocPath }]
    );
    const resPipelineMulti = await sendRequest(
      { path: '/api/pipeline/analyze-claim', method: 'POST', headers: formPipeline.headers },
      formPipeline.body,
      true
    );
    record(
      'POST /api/pipeline/analyze-claim (Multipart)',
      resPipelineMulti.status === 200 && resPipelineMulti.body.documentAI !== null,
      `Document AI processed: ${resPipelineMulti.body.documentAI ? 'Yes' : 'No'}`,
      resPipelineMulti.body
    );

    // --- Error Case Validations ---

    // 18. Error: 404 Not Found
    const res404 = await sendRequest({ path: '/api/non-existent-endpoint', method: 'GET' });
    record('Error handling: GET /api/non-existent-endpoint', res404.status === 404, `Status: ${res404.status}`, res404.body);

    // 19. Error: 400 Bad Request - document-ai/classify missing text
    const resErrClassify = await sendRequest(
      { path: '/api/document-ai/classify', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      {}
    );
    record('Error handling: POST /api/document-ai/classify (missing text)', resErrClassify.status === 400, `Status: ${resErrClassify.status}`, resErrClassify.body);

    // 20. Error: 400 Bad Request - document-ai/process missing document file
    const resErrProcess = await sendRequest(
      { path: '/api/document-ai/process', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      {}
    );
    record('Error handling: POST /api/document-ai/process (missing file)', resErrProcess.status === 400, `Status: ${resErrProcess.status}`, resErrProcess.body);

    // 21. Error: 400 Bad Request - pipeline/analyze-claim empty claim
    const resErrPipeline = await sendRequest(
      { path: '/api/pipeline/analyze-claim', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      {}
    );
    record('Error handling: POST /api/pipeline/analyze-claim (empty body)', resErrPipeline.status === 400, `Status: ${resErrPipeline.status}`, resErrPipeline.body);

  } catch (err) {
    console.error('❌ Test suite crashed with error:', err);
  } finally {
    if (fs.existsSync(tempDocPath)) {
      fs.unlinkSync(tempDocPath);
    }
  }

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  console.log(`\n==================================================`);
  console.log(`📊 TEST RESULTS SUMMARY`);
  console.log(`Total Tests Run: ${results.length}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`==================================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
