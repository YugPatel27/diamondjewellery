import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    
    // Profile Details
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' },
    pincode: { type: String, default: '' },
    
    // Preferences & Settings (GDPR Art. 25 — Privacy by Default)
    preferences: {
      newsletter: { type: Boolean, default: false },
      notifications: { type: Boolean, default: true },
      smsAlerts: { type: Boolean, default: false },
      emailUpdates: { type: Boolean, default: false },
    },
    
    // GDPR Consent Tracking (Art. 7 — Conditions for Consent)
    gdprConsent: {
      consentGiven: { type: Boolean, default: false },
      consentDate: { type: Date, default: null },
      consentVersion: { type: String, default: null },
      ipAddress: { type: String, default: null }, // Hashed IP
      dataProcessing: { type: Boolean, default: false },
      marketing: { type: Boolean, default: false },
      analytics: { type: Boolean, default: false },
      consentWithdrawnAt: { type: Date, default: null },
    },
    
    // Data Retention
    lastActiveAt: { type: Date, default: Date.now },
    accountDeletionRequestedAt: { type: Date, default: null },
    
    // Verification & Rights
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    kycStatus: { type: String, enum: ['pending', 'verified', 'rejected', 'none'], default: 'none' },
    kycDocument: { type: String, default: null },
    
    // Relations
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);
