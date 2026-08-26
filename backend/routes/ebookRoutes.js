import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createEbookSchema, updateEbookSchema } from '../validators/ebookValidator.js';
import {
  getEbooks,
  getEbookById,
  createEbook,
  updateEbook,
  deleteEbook
} from '../controllers/ebookController.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getEbooks)
  .post(protect, validate(createEbookSchema), createEbook);

router
  .route('/:id')
  .get(protect, getEbookById)
  .put(protect, asyncHandler(async (req, res) => {
    console.log('PUT /api/ebooks/:id body:', JSON.stringify(req.body, null, 2));
    return validate(updateEbookSchema)(req, res, () => updateEbook(req, res));
  }))
  .delete(protect, deleteEbook);

export default router;