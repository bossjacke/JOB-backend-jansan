import express from 'express';
const router = express.Router();
import {
  applyJob,
  getUserApplications,
  getApplicationStatus,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
  getAllApplications,
  updateApplicationStatusAdmin,
  deleteApplicationAdmin
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

// User routes
router.post('/', protect, applyJob);
router.get('/my', protect, getUserApplications);
router.get('/:id', protect, getApplicationStatus);
router.delete('/:id', protect, deleteApplication);

// Employer routes
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllApplications);
router.put('/admin/:id/status', protect, authorize('admin'), updateApplicationStatusAdmin);
router.delete('/admin/:id', protect, authorize('admin'), deleteApplicationAdmin);

export default router;
