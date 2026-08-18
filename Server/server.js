const app = require('./src/app');
const config = require('./src/config');
const logger = require('./src/utils/logger');
const connectDB = require("./src/config/database")

connectDB();
const server = app.listen(config.port, () => {
  logger.info(`AI Intelligence layer listening on port ${config.port}`, { env: config.env });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down');
  server.close(() => process.exit(0));
});

module.exports = server;
