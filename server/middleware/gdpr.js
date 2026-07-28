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
    // Fetch likes first (needed to decrement product counts), and run all
    // independent deletions concurrently instead of sequentially.
    const [orderResult, cartResult, appointmentResult, logResult, likes] =
      await Promise.all([
        Order.deleteMany({ userId }),
        Cart.findOneAndDelete({ userId }),
        Appointment.deleteMany({ userId }),
        ActivityLog.deleteMany({ userId }),
        ProductLike.find({ userId }, 'productId').lean(),
      ]);

    results.orders = orderResult.deletedCount;
    results.cart = !!cartResult;
    results.appointments = appointmentResult.deletedCount;
    results.activityLogs = logResult.deletedCount;

    // Decrement product like counts and remove likes in parallel.
    // bulkWrite replaces the previous N sequential findOneAndUpdate calls.
    const [, likeResult] = await Promise.all([
      likes.length
        ? Product.bulkWrite(
            likes.map(({ productId }) => ({
              updateOne: {
                filter: { id: productId },
                update: { $inc: { likesCount: -1 } },
              },
            }))
          )
        : Promise.resolve(),
      ProductLike.deleteMany({ userId }),
    ]);
    results.likes = likeResult.deletedCount;

    // Delete the user record last, once all related data is confirmed removed.
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
    const [user, orders, cart, appointments, activityLogs, likes] =
      await Promise.all([
        User.findById(userId).select('-password -__v').lean(),
        Order.find({ userId })
          .select('-__v -paymentVerificationToken -pricingSnapshotHash -checkoutToken')
          .lean(),
        Cart.findOne({ userId }).select('-__v').lean(),
        Appointment.find({ userId }).select('-__v').lean(),
        ActivityLog.find({ userId })
          .select('-__v')
          .sort({ createdAt: -1 })
          .limit(500)
          .lean(),
        ProductLike.find({ userId }).select('-__v').lean(),
      ]);

    if (!user) return null;

    return {
      exportDate: new Date().toISOString(),
      consentVersion: CONSENT_VERSION,
      dataSubject: { ...user, _id: user._id.toString() },
      orders: orders.map((o) => ({ ...o, _id: o._id.toString() })),
      cart: cart ? { ...cart, _id: cart._id.toString() } : null,
      appointments: appointments.map((a) => ({ ...a, _id: a._id.toString() })),
      activityLogs: activityLogs.map((l) => ({
        action: l.action,
        description: l.description,
        entityType: l.entityType,
        createdAt: l.createdAt,
        // IP is hashed, so safe to include
        ipFingerprint: l.ipAddress,
      })),
      productLikes: likes.map((l) => ({
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
 * Shared consent-field updater — used by recordConsent and withdrawConsent
 * to avoid duplicating the findByIdAndUpdate/select/error-handling boilerplate.
 */
const updateUserFields = async (userId, update, errorLabel) => {
  try {
    return await User.findByIdAndUpdate(userId, { $set: update }, { new: true }).select('-password');
  } catch (error) {
    console.error(`${errorLabel} Error:`, error);
    return null;
  }
};

/**
 * Record user consent with version tracking
 */
export const recordConsent = (userId, consentData, ipAddress) =>
  updateUserFields(
    userId,
    {
      'gdprConsent.consentGiven': true,
      'gdprConsent.consentDate': new Date(),
      'gdprConsent.consentVersion': CONSENT_VERSION,
      'gdprConsent.ipAddress': ipAddress,
      'gdprConsent.dataProcessing': consentData.dataProcessing ?? true,
      'gdprConsent.marketing': consentData.marketing ?? false,
      'gdprConsent.analytics': consentData.analytics ?? false,
    },
    'Consent Recording'
  );

/**
 * Withdraw consent — disables marketing and optional processing
 */
export const withdrawConsent = (userId) =>
  updateUserFields(
    userId,
    {
      'gdprConsent.marketing': false,
      'gdprConsent.analytics': false,
      'gdprConsent.consentWithdrawnAt': new Date(),
      'preferences.newsletter': false,
      'preferences.emailUpdates': false,
      'preferences.smsAlerts': false,
    },
    'Consent Withdrawal'
  );