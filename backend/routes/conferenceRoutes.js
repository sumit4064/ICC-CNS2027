import express from 'express';
import { getConference, updateConference } from '../controllers/conferenceController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getConference);
router.put('/', requireAdmin, updateConference);

export default router;
