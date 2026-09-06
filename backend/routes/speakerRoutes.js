import express from 'express';
import {
  getSpeakers,
  getSpeakerById,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
  uploadSpeakerImage,
  deleteSpeakerImage
} from '../controllers/speakerController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { uploadSpeaker } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getSpeakers);
router.get('/:id', getSpeakerById);
router.post('/', requireAdmin, createSpeaker);
router.put('/:id', requireAdmin, updateSpeaker);
router.delete('/:id', requireAdmin, deleteSpeaker);
router.post('/:id/image', requireAdmin, uploadSpeaker.single('photo'), uploadSpeakerImage);
router.delete('/:id/image', requireAdmin, deleteSpeakerImage);

export default router;
