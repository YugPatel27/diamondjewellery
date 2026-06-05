/**
 * GDPR Compliance Middleware & Utilities — Diamond Jewels
 * Implements Right to Erasure (Art. 17), Right to Data Portability (Art. 20),
 * Consent management (Art. 7), and data retention enforcement.
 */
import User from '../models/User.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Appointment from '../models/Appointment.js';
import ActivityLog from '../models/ActivityLog.js';
import ProductLike from '../models/ProductLike.js';
import Product from '../models/Product.js';

// Current consent policy version — bump when Privacy Policy changes
export const CONSENT_VERSION = '2.0.0';

/**
 * Right to Erasure (Art. 17) — Complete account and data deletion
 * Removes: User record, orders, cart, appointments, activity logs, wishlist likes
 */
export const eraseUserData = async (userId) => {
  const results = {
    user: false,
    orders: 0,
    cart: false,
    appointments: 0,
    activityLogs: 0,
    likes: 0,
  };

  try {
    // 1. Delete all orders (or anonymize if legally required to retain)
    const orderResult = await Order.deleteMany({ userId });
    results.orders = orderResult.deletedCount;

    // 2. Delete cart
    const cartResult = await Cart.findOneAndDelete({ userId });
    results.cart = !!cartResult;

    // 3. Delete appointments
    const appointmentResult = await Appointment.deleteMany({ userId });
    results.appointments = appointmentResult.deletedCount;

    // 4. Delete activity logs
    const logResult = await ActivityLog.deleteMany({ userId });
    results.activityLogs = logResult.deletedCount;

    // 5. Delete product likes and decrement like counts
    const likes = await ProductLike.find({ userId });
    for (const like of likes) {
      await Product.findOneAndUpdate(
        { id: like.productId },
        { $inc: { likesCount: -1 } }
      );
    }
    const likeResult = await ProductLike.deleteMany({ userId });
    results.likes = likeResult.deletedCount;

    // 6. Delete user record
    const userResult = await User.findByIdAndDelete(userId);
    results.user = !!userResult;

    return { success: true, deletedData: results };
  } catch (error) {
    console.error('GDPR Erasure Error:', error);
    return { success: false, error: error.message, deletedData: results };
  }
};

/**
 * Right to Data Portability (Art. 20) — Export all user data as JSON
 */
export const exportUserData = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password -__v').lean();
    if (!user) return null;

    const orders = await Order.find({ userId })
      .select('-__v -paymentVerificationToken -pricingSnapshotHash -checkoutToken')
      .lean();

    const cart = await Cart.findOne({ userId }).select('-__v').lean();

    const appointments = await Appointment.find({ userId }).select('-__v').lean();

    const activityLogs = await ActivityLog.find({ userId })
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    const likes = await ProductLike.find({ userId }).select('-__v').lean();

    return {
      exportDate: new Date().toISOString(),
      consentVersion: CONSENT_VERSION,
      dataSubject: {
        ...user,
        _id: user._id.toString(),
      },
      orders: orders.map(o => ({ ...o, _id: o._id.toString() })),
      cart: cart ? { ...cart, _id: cart._id.toString() } : null,
      appointments: appointments.map(a => ({ ...a, _id: a._id.toString() })),
      activityLogs: activityLogs.map(l => ({
        action: l.action,
        description: l.description,
        entityType: l.entityType,
        createdAt: l.createdAt,
        // IP is hashed, so safe to include
        ipFingerprint: l.ipAddress,
      })),
      productLikes: likes.map(l => ({
        productId: l.productId,
        likedAt: l.likedAt,
      })),
    };
  } catch (error) {
    console.error('GDPR Export Error:', error);
    return null;
  }
};

/**
 * Record user consent with version tracking
 */
export const recordConsent = async (userId, consentData, ipAddress) => {
  try {
    const update = {
      'gdprConsent.consentGiven': true,
      'gdprConsent.consentDate': new Date(),
      'gdprConsent.consentVersion': CONSENT_VERSION,
      'gdprConsent.ipAddress': ipAddress,
      'gdprConsent.dataProcessing': consentData.dataProcessing ?? true,
      'gdprConsent.marketing': consentData.marketing ?? false,
      'gdprConsent.analytics': consentData.analytics ?? false,
    };

    return await User.findByIdAndUpdate(userId, { $set: update }, { new: true }).select('-password');
  } catch (error) {
    console.error('Consent Recording Error:', error);
    return null;
  }
};

/**
 * Withdraw consent — disables marketing and optional processing
 */
export const withdrawConsent = async (userId) => {
  try {
    const update = {
      'gdprConsent.marketing': false,
      'gdprConsent.analytics': false,
      'gdprConsent.consentWithdrawnAt': new Date(),
      'preferences.newsletter': false,
      'preferences.emailUpdates': false,
      'preferences.smsAlerts': false,
    };

    return await User.findByIdAndUpdate(userId, { $set: update }, { new: true }).select('-password');
  } catch (error) {
    console.error('Consent Withdrawal Error:', error);
    return null;
  }
};
