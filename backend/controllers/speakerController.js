import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb, saveDb } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getSpeakers = (req, res) => {
  const db = getDb();
  res.json({ success: true, data: db.speakers || [] });
};

export const getSpeakerById = (req, res) => {
  const db = getDb();
  const speaker = (db.speakers || []).find((s) => s.id === req.params.id);
  if (!speaker) {
    return res.status(404).json({ success: false, message: 'Speaker not found.' });
  }
  res.json({ success: true, data: speaker });
};

export const createSpeaker = (req, res) => {
  const db = getDb();
  const { name, designation, institution, country, track, topic, bio, image, type } = req.body;

  if (!name || !institution) {
    return res.status(400).json({ success: false, message: 'Speaker name and institution are required.' });
  }

  const newSpeaker = {
    id: `sp-${Date.now()}`,
    name,
    designation: designation || 'Keynote Speaker',
    institution,
    country: country || 'International',
    track: track || 'Cognitive Computing',
    topic: topic || 'Advances in Cognitive Networking',
    bio: bio || 'Distinguished academic and industry expert contributing key insights to ICC-CNS.',
    image: image || null,
    type: type || 'Keynote'
  };

  db.speakers = db.speakers || [];
  db.speakers.push(newSpeaker);

  if (saveDb(db)) {
    res.status(201).json({ success: true, message: 'Speaker added successfully.', data: newSpeaker });
  } else {
    res.status(500).json({ success: false, message: 'Failed to add speaker.' });
  }
};

export const updateSpeaker = (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const index = (db.speakers || []).findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Speaker not found.' });
  }

  db.speakers[index] = {
    ...db.speakers[index],
    ...req.body,
    id: db.speakers[index].id
  };

  if (saveDb(db)) {
    res.json({ success: true, message: 'Speaker updated successfully.', data: db.speakers[index] });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update speaker.' });
  }
};

export const uploadSpeakerImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a JPG, PNG, or WEBP image under 5 MB.' });
    }

    const db = getDb();
    const index = (db.speakers || []).findIndex((s) => s.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Speaker not found.' });
    }

    const oldImage = db.speakers[index].image;
    // Clean up previous image if it was local in uploads/speakers/
    if (oldImage && oldImage.startsWith('/uploads/speakers/')) {
      const oldFilePath = path.join(__dirname, '..', oldImage);
      try {
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (err) {
        console.warn('Could not delete old speaker image file:', err.message);
      }
    }

    const imageUrl = `/uploads/speakers/${req.file.filename}`;
    db.speakers[index].image = imageUrl;

    if (saveDb(db)) {
      res.json({
        success: true,
        message: 'Speaker photograph uploaded successfully.',
        imageUrl,
        data: db.speakers[index]
      });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save speaker image reference.' });
    }
  } catch (error) {
    console.error('Error in uploadSpeakerImage:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to upload speaker photograph.' });
  }
};

export const deleteSpeakerImage = (req, res) => {
  try {
    const db = getDb();
    const index = (db.speakers || []).findIndex((s) => s.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Speaker not found.' });
    }

    const currentImage = db.speakers[index].image;
    if (currentImage && currentImage.startsWith('/uploads/speakers/')) {
      const filePath = path.join(__dirname, '..', currentImage);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.warn('Could not delete speaker image file:', err.message);
      }
    }

    db.speakers[index].image = null;

    if (saveDb(db)) {
      res.json({
        success: true,
        message: 'Speaker photograph removed successfully.',
        data: db.speakers[index]
      });
    } else {
      res.status(500).json({ success: false, message: 'Failed to remove speaker image reference.' });
    }
  } catch (error) {
    console.error('Error in deleteSpeakerImage:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete speaker image.' });
  }
};

export const deleteSpeaker = (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const initialLen = (db.speakers || []).length;
  const speakerToDelete = (db.speakers || []).find((s) => s.id === id);

  if (!speakerToDelete) {
    return res.status(404).json({ success: false, message: 'Speaker not found.' });
  }

  // Clean up uploaded image if in /uploads/speakers/
  if (speakerToDelete.image && speakerToDelete.image.startsWith('/uploads/speakers/')) {
    const filePath = path.join(__dirname, '..', speakerToDelete.image);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.warn('Could not delete speaker image file:', err.message);
    }
  }

  db.speakers = (db.speakers || []).filter((s) => s.id !== id);

  if (saveDb(db)) {
    res.json({ success: true, message: 'Speaker deleted successfully.' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to delete speaker.' });
  }
};

