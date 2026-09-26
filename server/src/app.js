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

// ── Root Gateway & Healthcheck ────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🏰 Urban Maharaja API Gateway is Live & Operational',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      api: '/api/v1',
    },
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Urban Maharaja API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// ── Error Handling ────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
