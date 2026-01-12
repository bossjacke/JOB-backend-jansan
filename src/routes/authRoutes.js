import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getCurrentUser, 
  updateProfile, 
  changePassword 
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { 
  validate, 
  userRegistrationSchema, 
  userLoginSchema 
} from '../middleware/validation.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', validate(userRegistrationSchema), registerUser);
router.post('/login', validate(userLoginSchema), loginUser);

// Protected routes (authentication required)
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

export default router;
