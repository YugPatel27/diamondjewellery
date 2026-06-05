import express from 'express';
import {
  createAppointment,
  getBookedSlotsByDate,
  getAppointments,
  getAllAppointments,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointmentController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Rate limit public appointment creation to prevent spam
const appointmentLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many appointment requests. Please try again later.',
});

router.post('/', appointmentLimiter, createAppointment);
router.get('/slots', getBookedSlotsByDate);
router.get('/', authenticate, getAppointments);
router.get('/admin/all', authenticate, adminOnly, getAllAppointments);
router.put('/:id', authenticate, adminOnly, updateAppointment);
router.delete('/:id', authenticate, adminOnly, deleteAppointment);

export default router;
