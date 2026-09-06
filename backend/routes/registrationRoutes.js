import express from 'express';
import {
  getRegistrations,
  createRegistration,
  updateRegistrationStatus
} from '../controllers/registrationController.js';
import { getDb } from '../config/db.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get configurable registration categories & pricing
router.get('/categories', (req, res) => {
  const db = getDb();
  res.json({ success: true, data: db.registrationCategories || [] });
});

router.get('/', requireAdmin, getRegistrations);
router.post('/', createRegistration);
router.put('/:id', requireAdmin, updateRegistrationStatus);

export default router;
