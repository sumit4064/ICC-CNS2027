import { getDb, saveDb } from '../config/db.js';

export const getTracks = (req, res) => {
  const db = getDb();
  res.json({ success: true, data: db.tracks || [] });
};

export const createTrack = (req, res) => {
  const db = getDb();
  const { number, code, name, color, accent, summary, topics } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Track name is required.' });
  }

  const newTrack = {
    id: `t-${Date.now()}`,
    number: number || `0${(db.tracks || []).length + 1}`,
    code: code || `TRACK-${(db.tracks || []).length + 1}`,
    name,
    color: color || '#FF6B35',
    accent: accent || 'orange',
    summary: summary || 'Cutting edge research areas and topics.',
    topics: Array.isArray(topics) ? topics : (topics ? topics.split('\n').filter(Boolean) : [])
  };

  db.tracks = db.tracks || [];
  db.tracks.push(newTrack);

  if (saveDb(db)) {
    res.status(201).json({ success: true, message: 'Track added successfully.', data: newTrack });
  } else {
    res.status(500).json({ success: false, message: 'Failed to add track.' });
  }
};

export const updateTrack = (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const index = (db.tracks || []).findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Track not found.' });
  }

  const updatedTopics = req.body.topics 
    ? (Array.isArray(req.body.topics) ? req.body.topics : req.body.topics.split('\n').filter(Boolean))
    : db.tracks[index].topics;

  db.tracks[index] = {
    ...db.tracks[index],
    ...req.body,
    topics: updatedTopics,
    id: db.tracks[index].id
  };

  if (saveDb(db)) {
    res.json({ success: true, message: 'Track updated successfully.', data: db.tracks[index] });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update track.' });
  }
};

export const deleteTrack = (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const initialLen = (db.tracks || []).length;
  db.tracks = (db.tracks || []).filter((t) => t.id !== id);

  if (db.tracks.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Track not found.' });
  }

  if (saveDb(db)) {
    res.json({ success: true, message: 'Track deleted successfully.' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to delete track.' });
  }
};
