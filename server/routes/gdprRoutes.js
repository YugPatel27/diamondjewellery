/**
 * GDPR Compliance Routes — Diamond Jewels
 * Provides endpoints for:
 * - Data Export (Right to Portability, Art. 20)
 * - Account Deletion (Right to Erasure, Art. 17)
 * - Consent Management (Art. 7)
 * - Consent Withdrawal
 */
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';
import {
  eraseUserData,
  exportUserData,
  recordConsent,
  withdrawConsent,
  CONSENT_VERSION,
} from '../middleware/gdpr.js';
import { hashIP, safeErrorMessage } from '../middleware/security.js';
import { getClientIp } from '../controllers/activityController.js';
import { logActivity } from '../controllers/activityController.js';

const router = express.Router();

// Rate limit GDPR endpoints to prevent abuse
const gdprLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 5,                     // 5 requests per hour
  message: 'Too many data requests. Please try again later.',
});

// All GDPR routes require authentication
router.use(authenticate);

/**
 * GET /api/gdpr/export — Export all personal data (Art. 20)
 */
router.get('/export', gdprLimiter, async (req, res) => {
  try {
    const data = await exportUserData(req.userId);
    if (!data) {
      return res.status(404).json({ success: false, message: 'User data not found' });
    }

    await logActivity(req.userId, 'GDPR Data Export', 'User exported their personal data', 'GDPR', null, req);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="my-data-${Date.now()}.json"`);
    res.json({
      success: true,
      message: 'Your data export is ready',
      data,
    });
  } catch (error) {
    console.error('GDPR Export Error:', error);
    res.status(500).json({ success: false, message: safeErrorMessage(error, 'Failed to export data') });
  }
});

/**
 * DELETE /api/gdpr/erase — Delete account and all personal data (Art. 17)
 */
router.delete('/erase', gdprLimiter, async (req, res) => {
  try {
    const { confirmEmail } = req.body;

    // Require email confirmation as a safety measure
    if (!confirmEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address to confirm account deletion',
      });
    }

    await logActivity(req.userId, 'GDPR Account Deletion', 'User requested complete data erasure', 'GDPR', null, req);

    const result = await eraseUserData(req.userId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Partial data deletion occurred. Please contact support.',
        details: result.deletedData,
      });
    }

    res.json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted.',
      deletedData: result.deletedData,
    });
  } catch (error) {
    console.error('GDPR Erasure Error:', error);
    res.status(500).json({ success: false, message: safeErrorMessage(error, 'Failed to delete account') });
  }
});

/**
 * POST /api/gdpr/consent — Record user consent with version tracking
 */
router.post('/consent', async (req, res) => {
  try {
    const { dataProcessing, marketing, analytics } = req.body;
    const hashedIp = hashIP(getClientIp(req));

    const user = await recordConsent(
      req.userId,
      { dataProcessing, marketing, analytics },
      hashedIp
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await logActivity(req.userId, 'GDPR Consent Updated', `Consent recorded (v${CONSENT_VERSION})`, 'GDPR', null, req);

    res.json({
      success: true,
      message: 'Consent preferences recorded',
      consentVersion: CONSENT_VERSION,
      user,
    });
  } catch (error) {
    console.error('Consent Recording Error:', error);
    res.status(500).json({ success: false, message: safeErrorMessage(error, 'Failed to record consent') });
  }
});

/**
 * POST /api/gdpr/withdraw-consent — Withdraw marketing/analytics consent
 */
router.post('/withdraw-consent', async (req, res) => {
  try {
    const user = await withdrawConsent(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await logActivity(req.userId, 'GDPR Consent Withdrawn', 'User withdrew marketing and analytics consent', 'GDPR', null, req);

    res.json({
      success: true,
      message: 'Consent withdrawn. Marketing and analytics processing has been stopped.',
      user,
    });
  } catch (error) {
    console.error('Consent Withdrawal Error:', error);
    res.status(500).json({ success: false, message: safeErrorMessage(error, 'Failed to withdraw consent') });
  }
});

/**
 * GET /api/gdpr/consent-status — Check current consent status
 */
router.get('/consent-status', async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId).select('gdprConsent preferences');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      currentVersion: CONSENT_VERSION,
      consent: user.gdprConsent,
      preferences: user.preferences,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: safeErrorMessage(error, 'Failed to fetch consent status') });
  }
});

export default router;
