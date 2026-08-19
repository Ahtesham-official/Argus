const config = require('../../config');
const logger = require('../../utils/logger');
const groqService = require('./groqService');

/**
 * Checks if Qwen API key is configured.
 */
function isQwenAvailable() {
  const key = config.ai.qwenApiKey;
  return Boolean(key && key !== 'your_qwen_api_key_here');
}

/**
 * Sends messages to Qwen API endpoint (OpenAI compatible endpoint).
 */
async function callQwenAPI({ messages, model = config.ai.qwenModel, temperature = 0.2, response_format = null }) {
  if (!isQwenAvailable()) {
    throw new Error('Qwen API key is not configured in QWEN_API_KEY');
  }

  const baseUrl = (config.ai.qwenBaseUrl || 'https://dashscope.aliyuncs.com/compatible-mode/v1').replace(/\/+$/, '');
  const endpoint = `${baseUrl}/chat/completions`;
  const payload = {
    model,
    messages,
    temperature,
  };

  if (response_format) {
    payload.response_format = response_format;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.ai.qwenApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error('Qwen API call failed', { status: response.status, body: errorText });
    throw new Error(`Qwen API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Qwen Brain Orchestrator: Determines execution plan and tool selection.
 */
async function orchestratePipelinePlan({ claim, hasDocument }) {
  const prompt = `You are Qwen, the Master Decision Brain of the Argus AI Claims Intelligence Platform.
Analyze the request details and formulate the optimal tool execution plan.

Available Tools / Tasks:
- "RUN_GROQ_OCR": High-speed visual text extraction from medical document images via Groq.
- "CLASSIFY_DOCUMENT": Categorize document (Hospital Bill, Discharge Summary, Lab Report, etc.).
- "RUN_GROQ_NLP_EXTRACTION": Extract structured JSON fields (Patient Name, Bill Amount, Dates) via Groq NLP.
- "VALIDATE_CLAIM_RULES": Run policy eligibility, coverage, and consistency rule checks.
- "DETECT_FRAUD_RISK": Perform anomaly, duplicate, pattern, and provider network fraud checks.
- "COMPUTE_RISK_SCORE": Calculate final risk score band (LOW, MEDIUM, HIGH, CRITICAL).

Input State:
- Document Uploaded: ${hasDocument ? 'YES' : 'NO'}
- Claim Details: ${JSON.stringify(claim || {})}

Return a valid JSON object matching this schema:
{
  "reasoning": string,
  "requiredTools": array of tool names,
  "priorityRiskFactors": array of strings
}`;

  if (!isQwenAvailable()) {
    logger.info('Qwen API unconfigured; defaulting to standard tool workflow plan.');
    const defaultTools = hasDocument
      ? ['RUN_GROQ_OCR', 'CLASSIFY_DOCUMENT', 'RUN_GROQ_NLP_EXTRACTION', 'VALIDATE_CLAIM_RULES', 'DETECT_FRAUD_RISK', 'COMPUTE_RISK_SCORE']
      : ['VALIDATE_CLAIM_RULES', 'DETECT_FRAUD_RISK', 'COMPUTE_RISK_SCORE'];
    return {
      reasoning: 'Standard pipeline plan (Qwen offline / fallback mode).',
      requiredTools: defaultTools,
      priorityRiskFactors: ['document_completeness', 'billing_anomaly'],
    };
  }

  try {
    const messages = [
      { role: 'system', content: 'You are an expert AI orchestrator for insurance claim intelligence.' },
      { role: 'user', content: prompt },
    ];

    const resultText = await callQwenAPI({
      messages,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(resultText);
  } catch (err) {
    logger.warn('Qwen orchestration call fallback', { error: err.message });
    return {
      reasoning: `Fallback pipeline plan due to error: ${err.message}`,
      requiredTools: hasDocument
        ? ['RUN_GROQ_OCR', 'CLASSIFY_DOCUMENT', 'RUN_GROQ_NLP_EXTRACTION', 'VALIDATE_CLAIM_RULES', 'DETECT_FRAUD_RISK', 'COMPUTE_RISK_SCORE']
        : ['VALIDATE_CLAIM_RULES', 'DETECT_FRAUD_RISK', 'COMPUTE_RISK_SCORE'],
      priorityRiskFactors: [],
    };
  }
}

/**
 * Qwen Brain Final Decision & Synthesis Generator.
 */
async function generateExecutiveDecision({ claim, documentAI, riskResult, fraudResult }) {
  if (!isQwenAvailable()) {
    return {
      engine: 'rule-engine-fallback',
      summary: `Claim evaluated with Risk Score ${riskResult?.score || 'N/A'} (${riskResult?.band || 'NORMAL'}).`,
      recommendation: riskResult?.band === 'HIGH' || riskResult?.band === 'CRITICAL' ? 'FLAG_FOR_MANUAL_INVESTIGATION' : 'AUTO_APPROVE',
    };
  }

  try {
    const prompt = `You are Qwen, the Executive Brain of Argus. Generate the final decision report for Claim ${claim?.claimId || ''}.

Document AI Data: ${JSON.stringify(documentAI || {})}
Risk Score Engine Result: ${JSON.stringify(riskResult || {})}
Fraud Signals: ${JSON.stringify(fraudResult || {})}

Return a valid JSON object matching:
{
  "summary": string,
  "recommendation": "AUTO_APPROVE" | "FAST_TRACK_PAYMENT" | "FLAG_FOR_MANUAL_INVESTIGATION" | "REJECT",
  "reasoningSteps": array of strings,
  "confidenceScore": number (0-1)
}`;

    const messages = [
      { role: 'system', content: 'You are the chief AI underwriting decision engine. Output valid JSON only.' },
      { role: 'user', content: prompt },
    ];

    const responseText = await callQwenAPI({
      messages,
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(responseText);
    return {
      engine: 'qwen-brain-v1',
      ...parsed,
    };
  } catch (err) {
    logger.error('Qwen executive decision generation failed', { error: err.message });
    return {
      engine: 'fallback',
      summary: 'Evaluation completed via rule engine fallback.',
      recommendation: riskResult?.band === 'HIGH' ? 'FLAG_FOR_MANUAL_INVESTIGATION' : 'AUTO_APPROVE',
    };
  }
}

module.exports = {
  isQwenAvailable,
  orchestratePipelinePlan,
  generateExecutiveDecision,
  callQwenAPI,
};
