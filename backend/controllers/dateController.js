import { DateModel } from '../models/index.js';
import { serverCache } from '../utils/cache.js';

const CACHE_KEY = 'dates:all';

export const getDates = async (req, res) => {
  try {
    const cached = serverCache.get(CACHE_KEY);
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
      return res.json({ success: true, data: cached });
    }

    const dates = await DateModel.find().lean();
    const data = dates || [];
    serverCache.set(CACHE_KEY, data, 60);

    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in getDates:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch dates.' });
  }
};

export const createDate = async (req, res) => {
  try {
    const { title, date, displayDate, description, highlight, status } = req.body;

    if (!title || !date) {
      return res.status(400).json({ success: false, message: 'Title and Date are required.' });
    }

    const newDate = {
      id: `d-${Date.now()}`,
      title,
      date,
      displayDate: displayDate || date,
      description: description || '',
      highlight: !!highlight,
      status: status || 'Upcoming'
    };

    const created = await DateModel.create(newDate);

    serverCache.del(CACHE_KEY);

    res.status(201).json({ success: true, message: 'Date added successfully.', data: created });
  } catch (error) {
    console.error('Error in createDate:', error.message);
    res.status(500).json({ success: false, message: 'Failed to add date.' });
  }
};

export const updateDate = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await DateModel.findOne({ id });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Date not found.' });
    }

    const updated = await DateModel.findOneAndUpdate(
      { id },
      { $set: { ...req.body, id } },
      { new: true }
    ).lean();

    serverCache.del(CACHE_KEY);

    res.json({ success: true, message: 'Date updated successfully.', data: updated });
  } catch (error) {
    console.error('Error in updateDate:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update date.' });
  }
};

export const deleteDate = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DateModel.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Date not found.' });
    }

    serverCache.del(CACHE_KEY);

    res.json({ success: true, message: 'Date deleted successfully.' });
  } catch (error) {
    console.error('Error in deleteDate:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete date.' });
  }
};

