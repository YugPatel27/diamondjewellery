import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
  confirmOrder,
  addTrackingNumber,
  deleteOrder,
  updatePaymentStatus
} from '../controllers/orderController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
const orderCreateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 12,
  message: 'Too many checkout attempts. Please wait a few minutes and try again.',
});
const paymentUpdateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: 'Too many payment attempts. Please wait a moment and try again.',
});
const adminMutationLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: 'Too many administrative changes. Please slow down.',
});

router.use(authenticate);

router.post('/', orderCreateLimiter, createOrder);
router.get('/admin/all', adminOnly, getAllOrders);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/payment-status', paymentUpdateLimiter, updatePaymentStatus);
router.put('/:id/status', adminOnly, updateOrderStatus);
router.put('/:id/cancel', adminOnly, adminMutationLimiter, cancelOrder);
router.put('/:id/confirm', adminOnly, adminMutationLimiter, confirmOrder);
router.put('/:id/tracking', adminOnly, adminMutationLimiter, addTrackingNumber);
router.delete('/:id', adminOnly, adminMutationLimiter, deleteOrder);

export default router;
