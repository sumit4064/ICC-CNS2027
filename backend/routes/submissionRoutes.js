import express from 'express';
import {
  getSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmissionStatus
} from '../controllers/submissionController.js';
import { uploadPaper } from '../middleware/uploadMiddleware.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAdmin, getSubmissions);
router.get('/track/:query', getSubmissionById);
router.get('/:query', requireAdmin, getSubmissionById);
router.post('/', uploadPaper.single('file'), createSubmission);
router.put('/:id', requireAdmin, updateSubmissionStatus);

export default router;
