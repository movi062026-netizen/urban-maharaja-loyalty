const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');
const logger = require('./config/logger');
const requestId = require('./middleware/requestId');
const { apiLimiter } = require('./middleware/rateLimiter');
const { sanitizeInput } = require('./middleware/sanitize');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Render / Vercel sit behind one reverse proxy — trust it so req.ip is the real
// client IP (otherwise every visitor shares one rate-limit bucket)
app.set('trust proxy', 1);
app.disable('x-powered-by');

// ── Security ──────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'same-site' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

// CORS
// CLIENT_URL may hold a comma-separated list (e.g. production + www + preview domains)
const allowedOrigins = env.CLIENT_URL.split(',').map((o) => o.trim().replace(/\/+$/, '')).filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  maxAge: 600,
}));

// ── Request Processing ────────────────────────────────
// Bills are uploaded as multipart (multer has its own limit) — JSON bodies stay small
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

// Block NoSQL operator injection ({"email": {"$ne": null}} etc.)
app.use(sanitizeInput);

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
