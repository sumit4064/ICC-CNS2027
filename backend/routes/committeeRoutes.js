import express from 'express';
import {
  getCommittee,
  getCommitteeMemberById,
  createCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
  uploadMemberImage,
  deleteMemberImage,
  updateCommittee
} from '../controllers/committeeController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { uploadCommittee } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getCommittee);
router.get('/:id', getCommitteeMemberById);
router.post('/', requireAdmin, createCommitteeMember);
router.put('/:id', requireAdmin, updateCommitteeMember);
router.delete('/:id', requireAdmin, deleteCommitteeMember);
router.post('/:id/image', requireAdmin, uploadCommittee.single('photo'), uploadMemberImage);
router.delete('/:id/image', requireAdmin, deleteMemberImage);
router.put('/', requireAdmin, updateCommittee);

export default router;

