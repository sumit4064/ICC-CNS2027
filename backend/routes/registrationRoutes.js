import express from 'express';
import {
  getRegistrations,
  createRegistration,
  updateRegistrationStatus
} from '../controllers/registrationController.js';
import { RegistrationCategory } from '../models/index.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

import { serverCache } from '../utils/cache.js';

// Get configurable registration categories & pricing
router.get('/categories', async (req, res) => {
  try {
    const cached = serverCache.get('reg:categories');
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
      return res.json({ success: true, data: cached });
    }

    const categories = await RegistrationCategory.find().lean();
    const data = categories || [];
    serverCache.set('reg:categories', data, 60);

    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in /categories:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch registration categories.' });
  }
});

router.get('/', requireAdmin, getRegistrations);
router.post('/', createRegistration);
router.put('/:id', requireAdmin, updateRegistrationStatus);

export default router;

