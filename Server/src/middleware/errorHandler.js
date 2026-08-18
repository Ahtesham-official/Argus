const logger = require('../utils/logger');

/** Wraps async route handlers so rejected promises reach the error handler. */
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

/** Centralized error -> JSON response mapping. */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error(err.message, { code: err.code, stack: err.stack, path: req.path });

  const statusByCode = {
    OCR_ENGINE_UNAVAILABLE: 503,
    OCR_PROCESSING_FAILED: 422,
    VALIDATION_ERROR: 400,
    NOT_FOUND: 404,
    LIMIT_FILE_SIZE: 413,
  };
  const status = statusByCode[err.code] || err.status || 500;

  res.status(status).json({
    error: {
      message: err.message,
      code: err.code || 'INTERNAL_ERROR',
    },
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: { message: `No route for ${req.method} ${req.path}`, code: 'NOT_FOUND' } });
}

module.exports = { asyncHandler, errorHandler, notFoundHandler };
