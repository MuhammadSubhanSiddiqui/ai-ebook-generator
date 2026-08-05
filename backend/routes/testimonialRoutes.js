import express from 'express';
import {
  getTestimonials,
  createTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createTestimonialSchema } from '../validators/testimonialValidator.js';

const router = express.Router();

router.route('/').get(getTestimonials).post(protect, validate(createTestimonialSchema), createTestimonial);
router.route('/:id').delete(protect, deleteTestimonial);

export default router;