import ActivityLog from '../models/ActivityLog.js';
import User from '../models/User.js';
import { hashIP } from '../middleware/security.js';

// Helper function to get client IP
export const getClientIp = (req) => {
  return (req.headers['x-forwarded-for'] || '').split(',')[0] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.ip || 
         'Unknown';
};

export const logActivity = async (userId, action, description, entityType, entityId, req = null) => {
  try {
    const user = userId ? await User.findById(userId).select('phone') : null;
    
    const logData = {
      userId,
      action,
      description,
      entityType,
      entityId,
      phoneNumber: user?.phone || null,
    };

    if (req) {
      // Hash IP address for GDPR-compliant storage (Art. 25 — Privacy by Design)
      const rawIp = getClientIp(req);
      logData.ipAddress = hashIP(rawIp);
      logData.userAgent = req.headers['user-agent'] || null;
      logData.browser = parseBrowser(req.headers['user-agent']);
    }

    const log = new ActivityLog(logData);
    await log.save();
  } catch (error) {
    console.error('Activity logging error:', error);
  }
};

// Helper to parse browser from user agent
const parseBrowser = (userAgent) => {
  if (!userAgent) return 'Unknown';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Other';
};

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ userId: req.userId })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch activity logs' });
  }
};

export const getAllActivityLogs = async (req, res) => {
  try {
    const { action, userId, ipAddress } = req.query;
    const filter = {};

    if (action) filter.action = action;
    if (userId) filter.userId = userId;
    if (ipAddress) filter.ipAddress = ipAddress;

    const logs = await ActivityLog.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(1000);

    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch logs' });
  }
};

export const deleteActivityLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await ActivityLog.findByIdAndDelete(id);
    
    if (!log) {
      return res.status(404).json({ success: false, message: 'Activity log not found' });
    }

    res.json({ success: true, message: 'Activity log deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete activity log' });
  }
};

export const createActivityLog = async (req, res) => {
  try {
    const { action, description, entityType, entityId } = req.body;

    if (!action) {
      return res.status(400).json({ success: false, message: 'Action is required' });
    }

    await logActivity(req.userId, action, description, entityType, entityId, req);

    res.json({ success: true, message: 'Activity logged successfully' });
  } catch (error) {
    console.error('Create activity log error:', error);
    res.status(500).json({ success: false, message: 'Failed to create activity log' });
  }
};

export const deleteMultipleActivityLogs = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid IDs array' });
    }

    const result = await ActivityLog.deleteMany({ _id: { $in: ids } });
    
    res.json({ success: true, message: 'Activity logs deleted', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete activity logs' });
  }
};
