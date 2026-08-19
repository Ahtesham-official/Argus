require('dotenv').config();
const { analyzeClaim } = require('../src/pipeline/claimIntelligencePipeline');
const groqService = require('../src/services/ai/groqService');
const qwenBrain = require('../src/services/ai/qwenBrain');

async function testEngine() {
  console.log('=== TESTING ARGUS DUAL-AI ENGINE ===');
  console.log('QWEN_BASE_URL:', process.env.QWEN_BASE_URL);
  console.log('QWEN_MODEL:', process.env.QWEN_MODEL);
  console.log('QWEN_API_KEY Available:', qwenBrain.isQwenAvailable());
  console.log('GROQ_API_KEY Available:', groqService.isGroqAvailable());

  const sampleClaim = {
    claimId: 'CLM-TEST-999',
    patientId: 'PAT-101',
    patientName: 'Rahul Sharma',
    hospitalName: 'Apollo Hospital Delhi',
    policyNumber: 'POL-100293',
    claimAmount: 145000,
    billedAmount: 145000,
    category: 'INPATIENT',
    procedureCode: 'PR-101',
    diagnosisCode: 'J18.9',
    admissionDate: '2026-08-10T00:00:00.000Z',
    dischargeDate: '2026-08-14T00:00:00.000Z',
    providerId: 'PRV-101',
  };

  try {
    console.log('\n[1] Testing Direct Qwen Brain Orchestration Plan...');
    const plan = await qwenBrain.orchestratePipelinePlan({ claim: sampleClaim, hasDocument: true });
    console.log('Qwen Plan Result:', JSON.stringify(plan, null, 2));

    console.log('\n[2] Connecting to MongoDB...');
    const connectDB = require('../src/config/database');
    await connectDB();

    console.log('\n[3] Testing Full Claim Intelligence Pipeline Execution...');
    const result = await analyzeClaim(sampleClaim, null);

    console.log('\n[3] Qwen Executive Brain Decision Result:');
    console.log(JSON.stringify(result.qwenExecutiveDecision, null, 2));

    console.log('\n=== ALL ENGINE VERIFICATIONS PASSED SUCCESSFULLY ===');
    process.exit(0);
  } catch (err) {
    console.error('\n!!! ERROR DURING AI ENGINE TEST !!!', err);
    process.exit(1);
  }
}

testEngine();
