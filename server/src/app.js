const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');
const logger = require('./config/logger');
const requestId = require('./middleware/requestId');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// ── Security ──────────────────────────────────────────
app.use(helmet());

// CORS
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
}));

// ── Request Processing ────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request ID for tracing
app.use(requestId);

// Request logging
app.use(morgan(':method :url :status :response-time ms', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Rate limiting
app.use('/api/', apiLimiter);

// ── API Routes ────────────────────────────────────────
app.use('/api/v1', routes);

// ── Error Handling ────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
