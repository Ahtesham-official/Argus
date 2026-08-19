const fs = require('fs');
const config = require('../../config');
const logger = require('../../utils/logger');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Checks if Groq API is configured.
 */
function isGroqAvailable() {
  const key = config.ai.groqApiKey;
  return Boolean(key && key !== 'your_groq_api_key_here');
}

/**
 * Calls Groq chat completion API (OpenAI compatible endpoint).
 */
async function callGroqAPI({ messages, model = config.ai.groqModel, temperature = 0.1, response_format = null }) {
  if (!isGroqAvailable()) {
    throw new Error('Groq API Key is not configured in GROQ_API_KEY');
  }

  const payload = {
    model,
    messages,
    temperature,
  };

  if (response_format) {
    payload.response_format = response_format;
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.ai.groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error('Groq API call failed', { status: response.status, body: errorText });
    throw new Error(`Groq API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Performs high-speed OCR / text extraction on document images/files using Groq Vision model.
 */
async function performGroqOCR(filePath, mimeType) {
  try {
    const fileData = fs.readFileSync(filePath);
    const base64Data = fileData.toString('base64');
    const dataUrl = `data:${mimeType || 'image/png'};base64,${base64Data}`;

    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Perform complete, high-accuracy OCR text extraction on this medical claim/bill image. Return ONLY the extracted text formatted cleanly without additional conversational intro.',
          },
          {
            type: 'image_url',
            image_url: {
              url: dataUrl,
            },
          },
        ],
      },
    ];

    const extractedText = await callGroqAPI({
      messages,
      model: config.ai.groqVisionModel,
      temperature: 0.1,
    });

    return {
      text: extractedText.trim(),
      engine: 'groq-vision',
      confidence: 0.95,
    };
  } catch (err) {
    logger.error('Groq OCR Vision extraction failed', { error: err.message, filePath });
    throw err;
  }
}

/**
 * Performs high-speed NLP structured extraction using Groq text models.
 */
async function performGroqNLPExtraction(rawText) {
  try {
    const prompt = `Extract medical claim fields from the raw text provided below. Return a valid JSON object matching this schema:
{
  "patientName": string or null,
  "hospitalName": string or null,
  "policyNumber": string or null,
  "admissionDate": string (DD/MM/YYYY) or null,
  "dischargeDate": string (DD/MM/YYYY) or null,
  "diagnosisCode": string or null,
  "totalAmount": number or null
}

Raw Text:
"""
${rawText}
"""`;

    const messages = [
      { role: 'system', content: 'You are a precise medical document data extractor. Output valid JSON only.' },
      { role: 'user', content: prompt },
    ];

    const responseText = await callGroqAPI({
      messages,
      model: config.ai.groqModel,
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    const fields = JSON.parse(responseText);
    const expectedKeys = ['patientName', 'hospitalName', 'policyNumber', 'admissionDate', 'dischargeDate', 'diagnosisCode', 'totalAmount'];
    const foundCount = expectedKeys.filter((k) => fields[k] !== undefined && fields[k] !== null).length;
    const completeness = Number((foundCount / expectedKeys.length).toFixed(2));

    return {
      fields,
      completeness,
      foundFieldCount: foundCount,
      expectedFieldCount: expectedKeys.length,
      engine: 'groq-nlp',
    };
  } catch (err) {
    logger.error('Groq NLP extraction failed', { error: err.message });
    throw err;
  }
}

module.exports = {
  isGroqAvailable,
  performGroqOCR,
  performGroqNLPExtraction,
};
