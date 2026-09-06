import { Track } from '../models/index.js';

export const getTracks = async (req, res) => {
  try {
    const tracks = await Track.find().lean();
    res.json({ success: true, data: tracks || [] });
  } catch (error) {
    console.error('Error in getTracks:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch tracks.' });
  }
};

export const createTrack = async (req, res) => {
  try {
    const { number, code, name, color, accent, summary, topics } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Track name is required.' });
    }

    const count = await Track.countDocuments();
    const newTrack = {
      id: `t-${Date.now()}`,
      number: number || `0${count + 1}`,
      code: code || `TRACK-${count + 1}`,
      name,
      color: color || '#FF6B35',
      accent: accent || 'orange',
      summary: summary || 'Cutting edge research areas and topics.',
      topics: Array.isArray(topics) ? topics : (topics ? topics.split('\n').filter(Boolean) : [])
    };

    const created = await Track.create(newTrack);
    res.status(201).json({ success: true, message: 'Track added successfully.', data: created });
  } catch (error) {
    console.error('Error in createTrack:', error.message);
    res.status(500).json({ success: false, message: 'Failed to add track.' });
  }
};

export const updateTrack = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Track.findOne({ id });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Track not found.' });
    }

    const updatedTopics = req.body.topics 
      ? (Array.isArray(req.body.topics) ? req.body.topics : req.body.topics.split('\n').filter(Boolean))
      : existing.topics;

    const updated = await Track.findOneAndUpdate(
      { id },
      {
        $set: {
          ...req.body,
          topics: updatedTopics,
          id
        }
      },
      { new: true }
    ).lean();

    res.json({ success: true, message: 'Track updated successfully.', data: updated });
  } catch (error) {
    console.error('Error in updateTrack:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update track.' });
  }
};

export const deleteTrack = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Track.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Track not found.' });
    }

    res.json({ success: true, message: 'Track deleted successfully.' });
  } catch (error) {
    console.error('Error in deleteTrack:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete track.' });
  }
};

