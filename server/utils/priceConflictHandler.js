import Product from '../models/Product.js';
import Order from '../models/Order.js';

/**
 * Check if product prices have changed since order initiation
 * Returns: { hasConflict, conflictDetails, newPrice }
 */
export const checkPriceConflict = async (productId, originalPrice, quantity = 1) => {
  try {
    const product = await Product.findById(productId).lean();
    
    if (!product) {
      return {
        hasConflict: true,
        conflictReason: 'Product not found or has been deleted',
        originalPrice: originalPrice,
        newPrice: 0,
        currentProduct: null
      };
    }

    const currentPrice = product.price;
    const priceDifference = currentPrice - originalPrice;
    const percentageDifference = Math.abs((priceDifference / originalPrice) * 100);

    if (currentPrice !== originalPrice) {
      return {
        hasConflict: true,
        conflictReason: priceDifference > 0 ? 'price_increased' : 'price_decreased',
        originalPrice: originalPrice,
        newPrice: currentPrice,
        priceDifference: priceDifference,
        percentageDifference: percentageDifference.toFixed(2),
        quantity: quantity,
        totalOriginal: originalPrice * quantity,
        totalNew: currentPrice * quantity,
        totalDifference: priceDifference * quantity,
        currentProduct: {
          id: product.id,
          name: product.name,
          makingCharges: product.makingCharges,
          metalPrice: product.metalPrice,
          diamondPrice: product.diamondPrice
        }
      };
    }

    return {
      hasConflict: false,
      originalPrice: originalPrice,
      newPrice: currentPrice,
      currentProduct: {
        id: product.id,
        name: product.name,
        makingCharges: product.makingCharges,
        metalPrice: product.metalPrice,
        diamondPrice: product.diamondPrice
      }
    };
  } catch (error) {
    console.error('Price conflict check error:', error);
    return {
      hasConflict: true,
      conflictReason: 'Error checking price',
      error: error.message
    };
  }
};

/**
 * Check multiple products in an order for price conflicts
 */
export const checkOrderPriceConflicts = async (orderItems) => {
  const conflicts = [];
  const allConflict = [];

  for (const item of orderItems) {
    const conflict = await checkPriceConflict(item.productId, item.price, item.quantity);
    
    if (conflict.hasConflict) {
      conflicts.push({
        productId: item.productId,
        productName: item.name,
        ...conflict
      });
      allConflict.push(true);
    } else {
      allConflict.push(false);
    }
  }

  return {
    hasAnyConflict: conflicts.length > 0,
    conflicts: conflicts,
    conflictCount: conflicts.length,
    totalItems: orderItems.length,
    allItemsHaveConflict: allConflict.every(c => c)
  };
};

/**
 * Handle order with price conflict - multiple strategies
 * Strategies: 'delay', 'notify', 'cancel', 'auto_update'
 */
export const handlePriceConflict = async (orderId, conflictDetails, strategy = 'delay') => {
  try {
    const order = await Order.findById(orderId);
    
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    switch (strategy) {
      case 'delay':
        // Delay the order and mark as pending review
        order.status = 'price_conflict';
        order.priceConflictNotified = true;
        order.priceConflictReason = JSON.stringify(conflictDetails.conflicts);
        order.priceLocked = true;
        order.priceLockedAt = new Date();
        await order.save();
        return {
          success: true,
          message: 'Order delayed due to price conflict. Admin notification sent.',
          action: 'delayed',
          orderId
        };

      case 'notify':
        // Notify admin and user but continue
        order.priceConflictNotified = true;
        order.priceConflictReason = JSON.stringify(conflictDetails.conflicts);
        await order.save();
        return {
          success: true,
          message: 'Price conflict detected and logged. Notifications sent.',
          action: 'notified',
          orderId
        };

      case 'auto_update':
        // Automatically update order with new prices
        let newTotal = 0;
        for (const conflict of conflictDetails.conflicts) {
          const itemIndex = order.items.findIndex(
            item => item.productId.toString() === conflict.productId.toString()
          );
          
          if (itemIndex !== -1) {
            order.items[itemIndex].price = conflict.newPrice;
            newTotal += conflict.newPrice * order.items[itemIndex].quantity;
          }
        }
        
        order.totalPrice = newTotal;
        order.gst = Math.round(newTotal * 0.03);
        order.finalTotal = newTotal + order.gst;
        order.priceConflictNotified = true;
        order.priceConflictReason = 'Auto-updated to current prices';
        order.priceLocked = false;
        await order.save();
        
        return {
          success: true,
          message: 'Order prices automatically updated to current rates.',
          action: 'auto_updated',
          orderId,
          newFinalTotal: order.finalTotal
        };

      case 'cancel':
        // Cancel the order
        order.status = 'cancelled';
        order.priceConflictNotified = true;
        order.priceConflictReason = JSON.stringify(conflictDetails.conflicts);
        await order.save();
        return {
          success: true,
          message: 'Order cancelled due to price conflict.',
          action: 'cancelled',
          orderId
        };

      default:
        return {
          success: false,
          message: 'Invalid strategy',
          validStrategies: ['delay', 'notify', 'auto_update', 'cancel']
        };
    }
  } catch (error) {
    console.error('Price conflict handling error:', error);
    return {
      success: false,
      message: 'Error handling price conflict',
      error: error.message
    };
  }
};

/**
 * Lock product prices for a specific order
 * Prevents price changes from affecting this order
 */
export const lockOrderPricing = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    order.priceLocked = true;
    order.priceLockedAt = new Date();
    order.originalPrice = order.finalTotal;
    await order.save();

    return {
      success: true,
      message: 'Order pricing locked',
      orderId,
      lockedPrice: order.finalTotal,
      lockedAt: order.priceLockedAt
    };
  } catch (error) {
    console.error('Lock pricing error:', error);
    return {
      success: false,
      message: 'Error locking pricing',
      error: error.message
    };
  }
};

/**
 * Get all orders with price conflicts pending admin review
 */
export const getPriceConflictOrders = async (limit = 50) => {
  try {
    const orders = await Order.find({ status: 'price_conflict' })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return {
      success: true,
      count: orders.length,
      orders
    };
  } catch (error) {
    console.error('Get conflict orders error:', error);
    return {
      success: false,
      message: 'Error fetching conflict orders',
      error: error.message
    };
  }
};

/**
 * Resolve a price conflict order - approve or reject
 */
export const resolvePriceConflict = async (orderId, action = 'approve', newPricing = null) => {
  try {
    const order = await Order.findById(orderId);
    
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    if (action === 'approve') {
      if (newPricing) {
        order.totalPrice = newPricing.totalPrice;
        order.gst = newPricing.gst;
        order.finalTotal = newPricing.finalTotal;
      }
      order.status = 'confirmed';
      order.priceConflictNotified = false;
    } else if (action === 'reject') {
      order.status = 'cancelled';
      order.priceConflictNotified = false;
    } else {
      return {
        success: false,
        message: 'Invalid action. Use "approve" or "reject".'
      };
    }

    await order.save();

    return {
      success: true,
      message: `Order ${action}ed`,
      orderId,
      newStatus: order.status,
      finalTotal: order.finalTotal
    };
  } catch (error) {
    console.error('Resolve conflict error:', error);
    return {
      success: false,
      message: 'Error resolving conflict',
      error: error.message
    };
  }
};
