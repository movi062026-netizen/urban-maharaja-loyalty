const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const connectDB = require('./config/database');

const { initRedis, ping: pingRedis } = require('./integrations/redis');

const start = async () => {
  // Connect to MongoDB
  await connectDB();

  // Initialize Upstash Redis
  const redisClient = initRedis();
  if (redisClient) {
    const pong = await pingRedis();
    logger.info(pong ? '✅ Upstash Redis connected' : '⚠️ Upstash Redis ping failed');
  }

  // Start HTTP server
  const server = app.listen(env.PORT, () => {
    logger.info(`🏰 Urban Maharaja API running on port ${env.PORT}`, {
      environment: env.NODE_ENV,
      port: env.PORT,
      redis: !!redisClient,
    });
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force shutdown after 10s
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Unhandled rejections
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', { error: reason?.message || reason });
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    process.exit(1);
  });
};

start();
