import express from 'express';
const router = express.Router();
import {
  getAllJobs,
  getAllJobsAdmin,
  getJobById,
  searchJobs,
  createJob,
  updateJob,
  deleteJob
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

// Public routes
router.get('/', getAllJobs);
router.get('/search', searchJobs);
router.get('/:id', getJobById);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllJobsAdmin);

// Protected routes (employer or admin for create, update, delete)
router.post('/', protect, authorize('employer', 'admin'), createJob);

// Admin only route for job creation
router.post('/admin/create', protect, authorize('admin'), createJob);
router.put('/:id', protect, authorize('employer', 'admin'), updateJob);
router.delete('/:id', protect, authorize('employer', 'admin'), deleteJob);

export default router;
