import express from 'express';
import {
  getDates,
  createDate,
  updateDate,
  deleteDate
} from '../controllers/dateController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDates);
router.post('/', requireAdmin, createDate);
router.put('/:id', requireAdmin, updateDate);
router.delete('/:id', requireAdmin, deleteDate);

export default router;
