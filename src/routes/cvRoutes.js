import express from 'express';
const router = express.Router();
import {
  uploadCV,
  getUserCV,
  getAllCVs,
  deleteCV,
  downloadCV,
  viewCV,
  deleteCVAdmin
} from '../controllers/cvController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

router.post('/', protect, upload.single('cv'), uploadCV);
router.get('/my', protect, getUserCV);
router.get('/', protect, authorize('admin'), getAllCVs);
router.delete('/:id', protect, deleteCV);
router.get('/:id/download', protect, downloadCV);
router.get('/:id/view', protect, viewCV);

// Admin routes
router.delete('/admin/:id', protect, authorize('admin'), deleteCVAdmin);

export default router;
