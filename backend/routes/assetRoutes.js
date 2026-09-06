/**
 * @file assetRoutes.js
 * @description Public asset routing for secure Backblaze B2 image delivery.
 */

import express from 'express';
import { getPublicAsset } from '../controllers/assetController.js';

const router = express.Router();

// 1. GET /api/assets/image?key=speakers/sp-101/photo.webp
router.get('/image', getPublicAsset);

// 2. GET /api/assets/* (e.g. /api/assets/speakers/sp-101/photo.webp)
router.get('/*', getPublicAsset);

export default router;
