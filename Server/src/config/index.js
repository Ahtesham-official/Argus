require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 4000,
  env: process.env.NODE_ENV || 'development',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxUploadBytes: parseInt(process.env.MAX_UPLOAD_BYTES, 10) || 15 * 1024 * 1024, // 15MB
  risk: {
    // Weights for the composite claim risk score. Kept centralised and
    // config-driven so Risk Score Engine tuning doesn't require code changes.
    weights: {
      validation: 0.25,
      anomaly: 0.2,
      duplicate: 0.2,
      pattern: 0.2,
      network: 0.1,
      documentConfidence: 0.05,
    },
    thresholds: {
      low: 30,
      medium: 60,
      high: 80,
    },
    autoApproveMax: 20,
    investigateMin: 70,
  },
  ai: {
    qwenApiKey: process.env.QWEN_API_KEY || '',
    qwenModel: process.env.QWEN_MODEL || 'qwen-max',
    qwenBaseUrl: process.env.QWEN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    groqApiKey: process.env.GROQ_API_KEY || '',
    groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    groqVisionModel: process.env.GROQ_VISION_MODEL || 'llama-3.2-11b-vision-preview',
  },
};
