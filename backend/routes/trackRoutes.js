import express from 'express';
import {
  getTracks,
  createTrack,
  updateTrack,
  deleteTrack
} from '../controllers/trackController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTracks);
router.post('/', requireAdmin, createTrack);
router.put('/:id', requireAdmin, updateTrack);
router.delete('/:id', requireAdmin, deleteTrack);

export default router;
