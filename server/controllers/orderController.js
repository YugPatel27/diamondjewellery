import mongoose from 'mongoose';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { config } from '../config/config.js';
import { logActivity } from './activityController.js';

const generateOrderId = () => `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const GST_RATE = 0.03;
const MAX_QUANTITY_PER_ITEM = 10;
const ALLOWED_PAYMENT_STATUSES = new Set(['pending', 'paid', 'failed']);
const ALLOWED_PAYMENT_METHODS = new Set(['cod', 'stripe', 'upi', 'bank_transfer', 'check']);

const normalizeString = (value, maxLength) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
};

const normalizeShippingAddress = (shippingAddress) => {
  if (!shippingAddress || typeof shippingAddress !== 'object') {
    return null;
  }

  const name = normalizeString(shippingAddress.name, 120);
  const email = normalizeString(shippingAddress.email, 120);
  const phone = normalizeString(shippingAddress.phone, 30);
  const address = normalizeString(shippingAddress.address, 240);
  const city = normalizeString(shippingAddress.city, 100);
  const pincode = normalizeString(shippingAddress.pincode, 20);

  if (!name || !email || !phone || !address || !city || !pincode) {
    return null;
  }

  return { name, email, phone, address, city, pincode };
};

const normalizeCustomization = (customization) => {
  if (!customization || typeof customization !== 'object') {
    return undefined;
  }

  const sanitized = {};

  const ringSize = normalizeString(customization.ringSize, 12);
  if (ringSize) sanitized.ringSize = ringSize;

  const categoryOption = normalizeString(customization.categoryOption, 60);
  if (categoryOption) sanitized.categoryOption = categoryOption;

  const engravingText = normalizeString(customization.engravingText, 80);
  if (engravingText) sanitized.engravingText = engravingText;

  const engravingFont = normalizeString(customization.engravingFont, 40);
  if (engravingFont) sanitized.engravingFont = engravingFont;

  if (Array.isArray(customization.engravingSymbols)) {
    const symbols = customization.engravingSymbols
      .map((symbol) => normalizeString(symbol, 8))
      .filter(Boolean)
      .slice(0, 6);
    if (symbols.length > 0) sanitized.engravingSymbols = symbols;
  }

  if (customization.selectedDiamond && typeof customization.selectedDiamond === 'object') {
    const selectedDiamond = {
      carat: Number(customization.selectedDiamond.carat) || undefined,
      color: normalizeString(customization.selectedDiamond.color, 4),
      clarity: normalizeString(customization.selectedDiamond.clarity, 8),
      price: Math.max(0, Number(customization.selectedDiamond.price) || 0),
    };
    if (selectedDiamond.carat || selectedDiamond.color || selectedDiamond.clarity || selectedDiamond.price > 0) {
      sanitized.selectedDiamond = selectedDiamond;
    }
  }

  const directPrice = Math.max(0, Number(customization.customizationPrice) || 0);
  if (directPrice > 0) {
    sanitized.customizationPrice = directPrice;
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
};

const resolveCustomizationPrice = (customization) => {
  if (!customization || typeof customization !== 'object') return 0;
  const selectedPrice = Number(customization?.selectedDiamond?.price);
  if (Number.isFinite(selectedPrice) && selectedPrice > 0) return Math.round(selectedPrice);
  const directPrice = Number(customization?.customizationPrice);
  if (Number.isFinite(directPrice) && directPrice > 0) return Math.round(directPrice);
  return 0;
};

const createHmacToken = (payload) =>
  crypto.createHmac('sha256', config.jwtSecret).update(JSON.stringify(payload)).digest('hex');

const buildPricingSignature = ({ userId, checkoutToken, items, subtotal, gst, finalTotal }) =>
  createHmacToken({ userId, checkoutToken, items, subtotal, gst, finalTotal, purpose: 'pricing-snapshot' });

const buildPaymentVerificationToken = ({ userId, orderId, checkoutToken, pricingSnapshotHash, finalTotal }) =>
  createHmacToken({ userId, orderId, checkoutToken, pricingSnapshotHash, finalTotal, purpose: 'payment-verification' });

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, notes, paymentMethod = 'cod', items: requestItems, checkoutToken } = req.body;
    const normalizedShippingAddress = normalizeShippingAddress(shippingAddress);

    if (!normalizedShippingAddress) {
      return res.status(400).json({ success: false, message: 'Invalid shipping address' });
    }

    if (!ALLOWED_PAYMENT_METHODS.has(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method' });
    }

    const normalizedNotes = normalizeString(notes, 500);

    if (checkoutToken) {
      const existingOrder = await Order.findOne({ userId: req.userId, checkoutToken }).populate('items.productId');
      if (existingOrder) {
        return res.status(200).json({
          success: true,
          message: 'Order already initiated',
          order: existingOrder
        });
      }
    }

    const sourceItems = Array.isArray(requestItems) && requestItems.length > 0
      ? requestItems
      : null;

    if (sourceItems && sourceItems.length > 25) {
      return res.status(400).json({ success: false, message: 'Too many items in one order' });
    }

    let items = [];
    let totalPrice = 0;
    let totalItems = 0;
    let pricingSnapshotItems = [];

    let diamondTotal = 0;
    let metalTotal = 0;
    let makingChargesTotal = 0;
    let certificationTotal = 0;

    if (sourceItems) {
      for (const item of sourceItems) {
        const rawProductId = item.productId ?? item.product?.id ?? item.product?.productId;
        if (!rawProductId) {
          return res.status(400).json({ success: false, message: 'Order item missing productId' });
        }

        let product = null;
        const parsedId = Number(rawProductId);
        if (!Number.isNaN(parsedId)) {
          product = await Product.findOne({ id: parsedId });
        }
        if (!product && mongoose.Types.ObjectId.isValid(rawProductId)) {
          product = await Product.findOne({ _id: rawProductId });
        }
        if (!product) {
          product = await Product.findOne({ id: String(rawProductId) });
        }
        
        if (!product) {
          return res.status(400).json({ success: false, message: `Product ${rawProductId} not found` });
        }

        const quantity = Number(item.quantity);
        if (!Number.isInteger(quantity) || quantity <= 0 || quantity > MAX_QUANTITY_PER_ITEM) {
          return res.status(400).json({ success: false, message: `Invalid quantity for ${product.name}` });
        }
        if (typeof product.stock === 'number' && quantity > product.stock) {
          return res.status(400).json({ success: false, message: `${product.name} has limited stock` });
        }

        const customization = normalizeCustomization(item.customization);
        const customizationPrice = resolveCustomizationPrice(customization);
        const itemPrice = product.price + customizationPrice;

        items.push({
          productId: product._id,
          name: product.name,
          price: itemPrice,
          quantity,
          image: product.image,
          description: product.description,
          customization,
          customizationPrice,
          diamondPrice: product.diamondPrice || 0,
          metalPrice: product.metalPrice || 0,
          makingCharges: product.makingCharges || 0,
          certificationCharges: product.certificationCharges || 0,
          metalType: product.metal,
          goldWeight: product.goldWeight
        });

        totalPrice += itemPrice * quantity;
        totalItems += quantity;
        pricingSnapshotItems.push({
          productId: String(product._id),
          quantity,
          basePrice: product.price,
          customizationPrice,
          itemPrice,
          lineTotal: itemPrice * quantity,
        });

        diamondTotal += (product.diamondPrice || 0) * quantity;
        metalTotal += (product.metalPrice || 0) * quantity;
        makingChargesTotal += (product.makingCharges || 0) * quantity;
        certificationTotal += (product.certificationCharges || 0) * quantity;
      }
    } else {
      const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }

      for (const item of cart.items) {
        const product = item.productId;
        const quantity = Number(item.quantity);
        if (!Number.isInteger(quantity) || quantity <= 0 || quantity > MAX_QUANTITY_PER_ITEM) {
          return res.status(400).json({ success: false, message: `Invalid quantity for ${product.name}` });
        }
        if (typeof product.stock === 'number' && quantity > product.stock) {
          return res.status(400).json({ success: false, message: `${product.name} has limited stock` });
        }

        const customization = normalizeCustomization(item.customization);
        const customizationPrice = resolveCustomizationPrice(customization || item.customization);
        const itemPrice = product.price + customizationPrice;

        items.push({
          productId: product._id,
          name: product.name,
          price: itemPrice,
          quantity,
          image: product.image,
          description: product.description,
          customization,
          customizationPrice,
          diamondPrice: product.diamondPrice || 0,
          metalPrice: product.metalPrice || 0,
          makingCharges: product.makingCharges || 0,
          certificationCharges: product.certificationCharges || 0,
          metalType: product.metal,
          goldWeight: product.goldWeight
        });

        totalPrice += itemPrice * quantity;
        totalItems += quantity;
        pricingSnapshotItems.push({
          productId: String(product._id),
          quantity,
          basePrice: product.price,
          customizationPrice,
          itemPrice,
          lineTotal: itemPrice * quantity,
        });

        diamondTotal += (product.diamondPrice || 0) * quantity;
        metalTotal += (product.metalPrice || 0) * quantity;
        makingChargesTotal += (product.makingCharges || 0) * quantity;
        certificationTotal += (product.certificationCharges || 0) * quantity;
      }
    }

    const finalTotal = totalPrice;
    const calculatedSubtotal = Math.round(finalTotal / (1 + GST_RATE));
    const gst = finalTotal - calculatedSubtotal;
    const baseTotalPrice = calculatedSubtotal;
    const orderId = generateOrderId();
    const pricingSnapshotHash = buildPricingSignature({
      userId: req.userId,
      checkoutToken,
      items: pricingSnapshotItems,
      subtotal: baseTotalPrice,
      gst,
      finalTotal,
    });
    const paymentVerificationToken = buildPaymentVerificationToken({
      userId: req.userId,
      orderId,
      checkoutToken,
      pricingSnapshotHash,
      finalTotal,
    });

    const order = new Order({
      orderId,
      userId: req.userId,
      items,
      totalPrice: baseTotalPrice,
      gst,
      finalTotal,
      totalItems,
      priceSummary: {
        diamondTotal,
        metalTotal,
        makingChargesTotal,
        certificationTotal
      },
      shippingAddress: normalizedShippingAddress,
      notes: normalizedNotes,
      paymentMethod,
      checkoutToken,
      pricingSnapshotHash,
      paymentVerificationToken,
      pricingSnapshot: {
        items: pricingSnapshotItems,
        subtotal: baseTotalPrice,
        gst,
        finalTotal,
        generatedAt: new Date().toISOString(),
      },
      paymentStatus: 'pending',
      status: 'pending'
    });

    await order.save();
    await User.findByIdAndUpdate(req.userId, { $push: { orders: order._id } });

    // Clear cart
    const cart = await Cart.findOne({ userId: req.userId });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      cart.totalItems = 0;
      await cart.save();
    }

    await logActivity(req.userId, 'Order Placed', `Placed order ${order.orderId} with total ₹${order.finalTotal}`, 'Order', order._id, req);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        ...order.toObject(),
        orderId: order.orderId
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    if (error?.code === 11000 && error?.keyPattern?.checkoutToken) {
      const existingOrder = await Order.findOne({ userId: req.userId, checkoutToken: req.body?.checkoutToken }).populate('items.productId');
      if (existingOrder) {
        return res.status(200).json({
          success: true,
          message: 'Order already initiated',
          order: existingOrder
        });
      }
    }
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let order;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id).populate('items.productId');
    }
    if (!order) {
      order = await Order.findOne({ orderId: id }).populate('items.productId');
    }
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    if (order.userId.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.productId');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('userId', 'name email phone')
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot cancel order with status: ${order.status}` 
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ 
      success: true, 
      message: 'Order cancelled successfully', 
      order 
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only pending orders can be confirmed' 
      });
    }

    order.status = 'confirmed';
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    await order.save();

    res.json({ 
      success: true, 
      message: 'Order confirmed successfully', 
      order 
    });
  } catch (error) {
    console.error('Confirm order error:', error);
    res.status(500).json({ success: false, message: 'Failed to confirm order' });
  }
};

export const addTrackingNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber } = req.body;

    if (!trackingNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tracking number is required' 
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { trackingNumber },
      { new: true }
    ).populate('items.productId');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ 
      success: true, 
      message: 'Tracking number added successfully', 
      order 
    });
  } catch (error) {
    console.error('Add tracking number error:', error);
    res.status(500).json({ success: false, message: 'Failed to add tracking number' });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentMethod, paymentVerificationToken } = req.body;
    const userId = req.userId;

    if (!ALLOWED_PAYMENT_STATUSES.has(paymentStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment status' 
      });
    }

    if (paymentMethod && !ALLOWED_PAYMENT_METHODS.has(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
      });
    }

    let order;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.userId.toString() !== userId && !req.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized to update this order' 
      });
    }

    if (!req.isAdmin) {
      if (paymentStatus !== 'paid') {
        return res.status(403).json({
          success: false,
          message: 'Payment updates can only be confirmed by the customer or a trusted webhook'
        });
      }

      if (!paymentVerificationToken || paymentVerificationToken !== order.paymentVerificationToken) {
        return res.status(403).json({
          success: false,
          message: 'Payment verification failed'
        });
      }
    }

    if (order.paymentStatus === 'paid' && paymentStatus === 'paid') {
      return res.json({
        success: true,
        message: 'Payment already processed for this order',
        order
      });
    }

    const updateData = { paymentStatus };
    if (paymentStatus === 'paid') {
      updateData.status = 'confirmed';
    } else if (paymentStatus === 'failed') {
      updateData.status = 'pending';
    }
    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
    }

    let updatedOrder;
    if (paymentStatus === 'paid') {
      updatedOrder = await Order.findOneAndUpdate(
        { _id: order._id, paymentStatus: { $ne: 'paid' } },
        updateData,
        { new: true }
      ).populate('items.productId');

      if (!updatedOrder) {
        const alreadyPaidOrder = await Order.findById(order._id).populate('items.productId');
        return res.json({
          success: true,
          message: 'Payment already processed for this order',
          order: alreadyPaidOrder
        });
      }
    } else {
      updatedOrder = await Order.findByIdAndUpdate(
        order._id,
        updateData,
        { new: true }
      ).populate('items.productId');
    }

    res.json({ 
      success: true, 
      message: 'Payment status updated successfully', 
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update payment status' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    await User.findByIdAndUpdate(order.userId, { $pull: { orders: id } });
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
};

export const getUpcomingDeliveries = async (req, res) => {
  try {
    const today = new Date();
    const upcomingDeliveries = await Order.find({
      status: 'shipped',
      createdAt: {
        $gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        $lte: today
      }
    })
      .populate('userId', 'name email phone')
      .populate('items.productId')
      .sort({ createdAt: 1 });

    const enrichedDeliveries = upcomingDeliveries.map(order => {
      const estimatedDelivery = new Date(order.createdAt);
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
      const daysUntilDelivery = Math.ceil((estimatedDelivery - today) / (1000 * 60 * 60 * 24));
      return {
        ...order.toObject(),
        estimatedDelivery,
        daysUntilDelivery,
        isUrgent: daysUntilDelivery <= 1
      };
    });

    res.json({ success: true, count: enrichedDeliveries.length, upcomingDeliveries: enrichedDeliveries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch upcoming deliveries' });
  }
};

export const deleteMultipleOrders = async (req, res) => {
  try {
    const { orderIds } = req.body;
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order IDs' });
    }
    await Order.deleteMany({ _id: { $in: orderIds } });
    res.json({ success: true, message: 'Orders deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete orders' });
  }
};

export const downloadOrderPDF = async (req, res) => {
  try {
    const { id } = req.params;
    let order;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id).populate('items.productId').populate('userId', 'name email phone address');
    }
    if (!order) {
      order = await Order.findOne({ orderId: id }).populate('items.productId').populate('userId', 'name email phone address');
    }
    
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.userId._id.toString() !== req.userId && !req.isAdmin) return res.status(403).json({ success: false, message: 'Unauthorized' });

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="order-${order.orderId}.pdf"`);
    doc.pipe(res);

    doc.fontSize(24).font('Helvetica-Bold').text('💎 DiamondJewels', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica').text('Premium Jewelry Store', { align: 'center' });
    doc.fontSize(9).text('# 5-50, 3rd Cross PTC Building, I.T. Estate, New Delhi - 135800', { align: 'center' });
    doc.moveDown(0.5);

    doc.fontSize(14).font('Helvetica-Bold').text('ORDER INVOICE');
    doc.moveDown(0.3);

    doc.fontSize(10).font('Helvetica');
    doc.text(`Order ID: ${order.orderId}`, 40, doc.y);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 40, doc.y);
    doc.text(`Status: ${order.status.toUpperCase()}`, 40, doc.y);
    doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 40, doc.y);
    doc.moveDown(0.5);

    doc.fontSize(11).font('Helvetica-Bold').text('CUSTOMER INFORMATION');
    doc.fontSize(9).font('Helvetica');
    doc.text(`Name: ${order.userId.name}`);
    doc.text(`Email: ${order.userId.email}`);
    doc.text(`Phone: ${order.userId.phone}`);
    doc.moveDown(0.5);

    doc.fontSize(11).font('Helvetica-Bold').text('SHIPPING ADDRESS');
    doc.fontSize(9).font('Helvetica');
    doc.text(`${order.shippingAddress.name}`);
    doc.text(`${order.shippingAddress.address}`);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.pincode}`);
    doc.moveDown(0.5);

    doc.fontSize(11).font('Helvetica-Bold').text('ORDER ITEMS');
    doc.moveDown(0.2);

    const tableTop = doc.y;
    const col1X = 50;
    const col3X = 350;
    const col4X = 450;

    doc.fontSize(9).font('Helvetica-Bold');
    doc.text('Product', col1X, tableTop);
    doc.text('Quantity', col3X, tableTop);
    doc.text('Price', col4X, tableTop);
    doc.moveTo(40, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    doc.fontSize(9).font('Helvetica');
    let yPosition = tableTop + 25;
    order.items.forEach(item => {
      doc.text(item.name.substring(0, 40), col1X, yPosition);
      doc.text(String(item.quantity), col3X, yPosition);
      doc.text(`₹${item.price.toLocaleString('en-IN')}`, col4X, yPosition);
      yPosition += 20;
    });

    doc.moveTo(40, yPosition).lineTo(550, yPosition).stroke();
    yPosition += 10;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text(`Subtotal: ₹${order.totalPrice.toLocaleString('en-IN')}`, col4X - 100, yPosition);
    yPosition += 20;
    doc.text(`GST (3%): ₹${(order.gst || 0).toLocaleString('en-IN')}`, col4X - 100, yPosition);
    yPosition += 20;
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`FINAL TOTAL: ₹${order.finalTotal.toLocaleString('en-IN')}`, col4X - 100, yPosition);

    doc.end();
  } catch (error) {
    console.error('Download PDF error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate PDF' });
  }
};
