import express from 'express';
import {
  getRegistrations,
  createRegistration,
  updateRegistrationStatus
} from '../controllers/registrationController.js';
import { RegistrationCategory } from '../models/index.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get configurable registration categories & pricing
router.get('/categories', async (req, res) => {
  try {
    const categories = await RegistrationCategory.find().lean();
    res.json({ success: true, data: categories || [] });
  } catch (error) {
    console.error('Error in /categories:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch registration categories.' });
  }
});

router.get('/', requireAdmin, getRegistrations);
router.post('/', createRegistration);
router.put('/:id', requireAdmin, updateRegistrationStatus);

export default router;

