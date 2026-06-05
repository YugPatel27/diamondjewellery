import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String, required: true, index: true },
    description: String,
    entityType: String,
    entityId: mongoose.Schema.Types.ObjectId,
    ipAddress: { type: String, index: true },
    userAgent: String,
    phoneNumber: String,
    country: String,
    city: String,
    browser: String,
  },
  { timestamps: true, ttl: 2592000 } // 30 days auto-delete
);

activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ ipAddress: 1, createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
