import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Rate limit auth endpoints to prevent brute force attacks
const registerLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 registrations per IP per window
  message: 'Too many registration attempts. Please try again in 15 minutes.',
});

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                    // 10 login attempts per IP per window
  message: 'Too many login attempts. Please try again in 15 minutes.',
});

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;
