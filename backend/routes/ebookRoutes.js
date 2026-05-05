import express from 'express';
import {
  getEbooks,
  getEbookById,
  createEbook,
  updateEbook,
  deleteEbook
} from '../controllers/ebookController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getEbooks).post(protect, createEbook);
router.route('/:id').get(protect, getEbookById).put(protect, updateEbook).delete(protect, deleteEbook);

export default router;
