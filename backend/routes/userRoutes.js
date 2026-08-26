import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from '../validators/userValidator.js';

const router = express.Router();

router.post('/', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, validate(updateProfileSchema), updateUserProfile);

export default router;