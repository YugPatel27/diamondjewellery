import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const DEFAULT_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const TIME_UNIT_MS = {
  d: 24 * 60 * 60 * 1000,
  h: 60 * 60 * 1000,
  m: 60 * 1000,
  s: 1000,
};

const extractBearerToken = (authorizationHeader) => {
  if (!authorizationHeader) return null;

  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return null;

  return token;
};

export const authenticate = (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin;
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, message: 'Token has expired' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  return next();
};

export const generateToken = (userId, isAdmin = false) => {
  return jwt.sign(
    { userId, isAdmin, issuedAt: Date.now() },
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );
};

export const getTokenExpiryTime = () => {
  const jwtExpire = config.jwtExpire;

  if (typeof jwtExpire !== 'string') {
    return DEFAULT_EXPIRY_MS;
  }

  const match = jwtExpire.match(/^(\d+)([dhms])$/);
  if (!match) {
    return DEFAULT_EXPIRY_MS;
  }

  const [, value, unit] = match;
  return Number(value) * TIME_UNIT_MS[unit];
};

export const sendTokenWithExpiry = (userId, isAdmin = false) => {
  const token = generateToken(userId, isAdmin);
  const expiresIn = getTokenExpiryTime();
  const expiresAt = Date.now() + expiresIn;

  return { token, expiresIn, expiresAt };
};