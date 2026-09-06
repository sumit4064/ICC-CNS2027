import { Gallery } from '../models/index.js';
import { uploadObject, deleteObject } from '../services/b2StorageService.js';

export const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find().lean();
    res.json({ success: true, data: gallery || [] });
  } catch (error) {
    console.error('Error in getGallery:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch gallery items.' });
  }
};

export const addGalleryItem = async (req, res) => {
  let uploadedStorageKey = null;

  try {
    const { title, category, description } = req.body;
    const itemId = req.body.id || `g-${Date.now()}`;

    let imagePath = '/images/gallery-1.jpg';
    let imageStorageKey = null;

    if (req.file && req.file.buffer) {
      const safeName = (req.file.originalname || 'gallery_photo.webp').replace(/[^a-zA-Z0-9._-]/g, '_');
      imageStorageKey = `gallery/${itemId}/${safeName}`;
      imagePath = imageStorageKey;

      // 1. Upload buffer directly to Backblaze B2
      try {
        await uploadObject({
          key: imageStorageKey,
          buffer: req.file.buffer,
          contentType: req.file.mimetype || 'image/jpeg',
          metadata: {
            galleryId: String(itemId),
            title: (title || '').trim()
          }
        });
        uploadedStorageKey = imageStorageKey;
        console.log(`[Gallery] Successfully uploaded photograph to B2: ${imageStorageKey}`);
      } catch (uploadErr) {
        console.error(`[Gallery] B2 storage upload failed for item ${itemId}:`, uploadErr.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload gallery photograph to cloud storage.'
        });
      }
    } else if (req.body.image) {
      imagePath = req.body.image;
      imageStorageKey = req.body.imageStorageKey || null;
    }

    const newItem = {
      id: itemId,
      title: title || 'Conference Highlights',
      category: category || 'General',
      description: description || '',
      image: imagePath,
      imageStorageKey
    };

    let created;
    try {
      created = await Gallery.create(newItem);
    } catch (dbErr) {
      console.error(`[Gallery] MongoDB create failed for item ${itemId}:`, dbErr.message);

      // Rollback newly uploaded B2 object if database persistence failed
      if (uploadedStorageKey) {
        try {
          console.log(`[Gallery] Rolling back B2 object: ${uploadedStorageKey}`);
          await deleteObject({ key: uploadedStorageKey });
          console.log(`[Gallery] B2 rollback successful for: ${uploadedStorageKey}`);
        } catch (rollbackErr) {
          console.error(`[Gallery] Failed to rollback B2 object ${uploadedStorageKey}:`, rollbackErr.message);
        }
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error while saving gallery photograph record.'
      });
    }

    res.status(201).json({ success: true, message: 'Photo added to gallery.', data: created });
  } catch (error) {
    console.error('Error in addGalleryItem:', error.message);

    if (uploadedStorageKey) {
      try {
        await deleteObject({ key: uploadedStorageKey });
      } catch (e) {}
    }

    res.status(500).json({ success: false, message: 'Failed to add gallery item.' });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const itemToDelete = await Gallery.findOne({ id });

    if (!itemToDelete) {
      return res.status(404).json({ success: false, message: 'Gallery photo not found.' });
    }

    const oldImageStorageKey = itemToDelete.imageStorageKey;

    await Gallery.findOneAndDelete({ id });

    // Clean up B2 object if item was backed by B2 storage
    if (oldImageStorageKey) {
      try {
        await deleteObject({ key: oldImageStorageKey });
        console.log(`[Gallery] Deleted B2 object on item deletion: ${oldImageStorageKey}`);
      } catch (delErr) {
        console.warn(`[Gallery] Failed to delete B2 object ${oldImageStorageKey}:`, delErr.message);
      }
    }

    res.json({ success: true, message: 'Gallery item deleted.' });
  } catch (error) {
    console.error('Error in deleteGalleryItem:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete gallery item.' });
  }
};

