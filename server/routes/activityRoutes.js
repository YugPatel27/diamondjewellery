import express from 'express';
import {
  getActivityLogs,
  getAllActivityLogs,
  createActivityLog,
  deleteActivityLog,
  deleteMultipleActivityLogs
} from '../controllers/activityController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// User activity logs
router.get('/', getActivityLogs);
router.post('/', createActivityLog);
router.delete('/:id', deleteActivityLog);

// Admin only
router.get('/admin/all', adminOnly, getAllActivityLogs);
router.post('/admin/delete-multiple', adminOnly, deleteMultipleActivityLogs);

export default router;
