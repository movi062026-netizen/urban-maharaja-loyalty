const dotenv = require('dotenv');
const path = require('path');

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/urban-maharaja',
  
  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-in-production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  
  // Client
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  
  // Google
  GOOGLE_REVIEW_URL: process.env.GOOGLE_REVIEW_URL || '',
  GOOGLE_MAPS_URL: process.env.GOOGLE_MAPS_URL || '',
  RESERVATION_URL: process.env.RESERVATION_URL || '',
  
  // Redis (optional)
  REDIS_URL: process.env.REDIS_URL || '',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Helpers
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

// Validate critical env vars in production
if (env.isProduction) {
  const required = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'CLIENT_URL'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

module.exports = env;
