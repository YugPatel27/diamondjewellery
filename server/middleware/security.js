/**
 * Security Middleware — Diamond Jewels
 * Implements IP hashing, input sanitization, security headers,
 * and GDPR-compliant data handling utilities.
 */
import crypto from 'crypto';
import { config } from '../config/config.js';

// ─── IP Address Anonymization (GDPR Art. 25 — Privacy by Design) ───
const IP_HASH_SALT = config.jwtSecret; // Use server secret as HMAC key

/**
 * Hash an IP address using HMAC-SHA256 for GDPR-compliant logging.
 * Produces a truncated, irreversible fingerprint.
 */
export const hashIP = (ip) => {
  if (!ip || ip === 'Unknown') return 'unknown';
  return crypto
    .createHmac('sha256', IP_HASH_SALT)
    .update(ip)
    .digest('hex')
    .substring(0, 16); // 16-char fingerprint — enough for abuse detection
};

// ─── Input Sanitization ───

/** Strip HTML/script tags from a string */
export const stripTags = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<[^>]*>/g, '')           // Remove HTML tags
    .replace(/[<>]/g, '')              // Remove stray angle brackets
    .replace(/javascript:/gi, '')      // Remove JS protocol
    .replace(/on\w+\s*=/gi, '')        // Remove inline event handlers
    .trim();
};

/** Deep sanitize an object's string values */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = stripTags(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  return result;
};

/** Express middleware to sanitize req.body */
export const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
};

// ─── Security Headers Middleware ───
export const securityHeaders = (req, res, next) => {
  // Permissions Policy — restrict powerful browser APIs
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );
  // Prevent DNS prefetching to external domains
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  // Prevent IE from executing downloads in site context
  res.setHeader('X-Download-Options', 'noopen');
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Cross-Origin isolation headers
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
};

// ─── JWT Secret Strength Validation ───
export const validateJWTSecret = () => {
  const secret = config.jwtSecret;
  const weakPatterns = [
    'your_secret_key_here',
    'change_me',
    'secret',
    'password',
    'default',
    '123456',
  ];

  if (!secret || secret.length < 32) {
    console.error('🔴 CRITICAL: JWT_SECRET must be at least 32 characters. Current length:', secret?.length || 0);
    if (config.nodeEnv === 'production') {
      process.exit(1);
    } else {
      console.warn('⚠️  Running in dev mode with weak JWT secret — DO NOT use in production!');
    }
  }

  if (weakPatterns.some(p => secret.toLowerCase().includes(p))) {
    console.warn('⚠️  JWT_SECRET contains weak patterns. Generate a strong random secret for production.');
    if (config.nodeEnv === 'production') {
      process.exit(1);
    }
  }
};

// ─── Safe Error Response ───
/**
 * Returns a sanitized error message for API responses.
 * In production, internal errors are hidden from the client.
 */
export const safeErrorMessage = (error, fallback = 'An internal error occurred') => {
  if (config.nodeEnv === 'development') {
    return error?.message || fallback;
  }
  return fallback;
};
