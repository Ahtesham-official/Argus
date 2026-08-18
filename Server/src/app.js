const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const requestId = require('./middleware/requestId');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const apiRoutes = require('./routes');
const store = require('./data/store');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestId);
app.use(morgan(':method :url :status :response-time ms - reqId=:req[x-request-id]'));

// Health check - what a load balancer / orchestration layer would poll.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'claims-ai-intelligence-layer', timestamp: new Date().toISOString() });
});

// Lightweight introspection of the seeded in-memory data layer, useful for
// building sample requests against this API.
app.get('/api/meta/sample-data', async (req, res) => {
  const providers = await store.listProviders();
  const claims = await store.getHistoricalClaims();
  res.json({
    providers,
    procedureCategories: store.listProcedureCategories(),
    sampleHistoricalClaims: claims.slice(0, 5),
  });
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
