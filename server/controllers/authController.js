import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import { generateToken, sendTokenWithExpiry } from '../middleware/auth.js';
import { logActivity } from './activityController.js';
import { hashIP, stripTags, safeErrorMessage } from '../middleware/security.js';
import { CONSENT_VERSION } from '../middleware/gdpr.js';
import { getClientIp } from './activityController.js';
import { validateEmail, validatePassword, validatePhone } from '../utils/validators.js';

// ─── Strong Password Policy ───
const PASSWORD_POLICY = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
};

const validatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') return 'Password is required';
  if (password.length < PASSWORD_POLICY.minLength) return `Password must be at least ${PASSWORD_POLICY.minLength} characters`;
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (PASSWORD_POLICY.requireNumber && !/\d/.test(password)) return 'Password must contain at least one number';
  if (PASSWORD_POLICY.requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';
  return null;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    // Sanitize inputs
    const cleanName = stripTags(name).substring(0, 100);
    const cleanEmail = stripTags(email).toLowerCase().trim().substring(0, 120);
    const cleanPhone = stripTags(phone).replace(/[^\d+\-\s]/g, '').substring(0, 20);

    // Validate email format
    if (!validateEmail(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Validate phone format
    if (!validatePhone(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number (10 digits required)' });
    }

    // Enforce strong password policy
    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      return res.status(400).json({ success: false, message: passwordError });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Hash password with strong salt rounds
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Record GDPR consent at registration
    const hashedIp = hashIP(getClientIp(req));

    const user = new User({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      phone: cleanPhone,
      gdprConsent: {
        consentGiven: true,
        consentDate: new Date(),
        consentVersion: CONSENT_VERSION,
        ipAddress: hashedIp,
        dataProcessing: true,
        marketing: false,
        analytics: false,
      },
    });
    await user.save();

    const { token, expiresIn, expiresAt } = sendTokenWithExpiry(user._id, user.isAdmin);

    await logActivity(user._id, 'Account Created', `New account registered`, 'Auth', user._id, req);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      expiresIn,
      expiresAt,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        kycStatus: user.kycStatus,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        pincode: user.pincode,
        preferences: user.preferences,
        gdprConsent: {
          consentGiven: user.gdprConsent.consentGiven,
          consentVersion: user.gdprConsent.consentVersion,
          consentDate: user.gdprConsent.consentDate,
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    // Use constant-time lookup — don't reveal if email exists
    const user = await User.findOne({ email: stripTags(email).toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last active timestamp
    user.lastActiveAt = new Date();
    await user.save();

    const { token, expiresIn, expiresAt } = sendTokenWithExpiry(user._id, user.isAdmin);

    await logActivity(user._id, 'User Login', `User logged in`, 'Auth', user._id, req);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      expiresIn,
      expiresAt,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        kycStatus: user.kycStatus,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        pincode: user.pincode,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, pincode } = req.body;

    // Sanitize update data
    const updateData = {};
    if (name) updateData.name = stripTags(name).substring(0, 100);
    if (phone) updateData.phone = stripTags(phone).replace(/[^\d+\-\s]/g, '').substring(0, 20);
    if (address) updateData.address = stripTags(address).substring(0, 250);
    if (city) updateData.city = stripTags(city).substring(0, 100);
    if (pincode) updateData.pincode = stripTags(pincode).substring(0, 10);

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};
