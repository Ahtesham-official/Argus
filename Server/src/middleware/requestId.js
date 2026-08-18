const { v4: uuid } = require('uuid');

/** Stamps every request with an ID for tracing across the pipeline/logs. */
module.exports = function requestId(req, res, next) {
  req.requestId = req.headers['x-request-id'] || uuid();
  res.setHeader('X-Request-Id', req.requestId);
  next();
};
