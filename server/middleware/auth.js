import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

export const generateToken = (userId, isAdmin = false) => {
  const token = jwt.sign(
    { 
      userId, 
      isAdmin,
      issuedAt: Date.now()
    }, 
    config.jwtSecret, 
    { expiresIn: config.jwtExpire }
  );
  return token;
};

// Get token expiry time in milliseconds
export const getTokenExpiryTime = () => {
  const jwtExpire = config.jwtExpire;
  if (typeof jwtExpire === 'string') {
    const match = jwtExpire.match(/(\d+)([a-z])/);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];
      switch (unit) {
        case 'd': return value * 24 * 60 * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'm': return value * 60 * 1000;
        case 's': return value * 1000;
        default: return 7 * 24 * 60 * 60 * 1000; // 7 days default
      }
    }
  }
  return 7 * 24 * 60 * 60 * 1000; // 7 days default
};

// Send token expiry info to client
export const sendTokenWithExpiry = (userId, isAdmin = false) => {
  const token = generateToken(userId, isAdmin);
  const expiresIn = getTokenExpiryTime();
  const expiresAt = Date.now() + expiresIn;
  
  return {
    token,
    expiresIn,
    expiresAt
  };
};
