import { getDb, saveDb } from '../config/db.js';

export const getGallery = (req, res) => {
  const db = getDb();
  res.json({ success: true, data: db.gallery || [] });
};

export const addGalleryItem = (req, res) => {
  const db = getDb();
  const { title, category, description } = req.body;

  let imagePath = '/images/gallery-1.jpg';
  if (req.file) {
    imagePath = `/uploads/gallery/${req.file.filename}`;
  } else if (req.body.image) {
    imagePath = req.body.image;
  }

  const newItem = {
    id: `g-${Date.now()}`,
    title: title || 'Conference Highlights',
    category: category || 'General',
    description: description || '',
    image: imagePath
  };

  db.gallery = db.gallery || [];
  db.gallery.push(newItem);

  if (saveDb(db)) {
    res.status(201).json({ success: true, message: 'Photo added to gallery.', data: newItem });
  } else {
    res.status(500).json({ success: false, message: 'Failed to add gallery item.' });
  }
};

export const deleteGalleryItem = (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const initialLen = (db.gallery || []).length;
  db.gallery = (db.gallery || []).filter((g) => g.id !== id);

  if (db.gallery.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Gallery photo not found.' });
  }

  if (saveDb(db)) {
    res.json({ success: true, message: 'Gallery item deleted.' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to delete gallery item.' });
  }
};
