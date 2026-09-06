import express from 'express';
import { getGallery, addGalleryItem, deleteGalleryItem } from '../controllers/galleryController.js';
import { uploadGallery } from '../middleware/uploadMiddleware.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getGallery);
router.post('/', requireAdmin, uploadGallery.single('image'), addGalleryItem);
router.delete('/:id', requireAdmin, deleteGalleryItem);

export default router;
