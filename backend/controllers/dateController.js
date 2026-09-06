import { getDb, saveDb } from '../config/db.js';

export const getDates = (req, res) => {
  const db = getDb();
  res.json({ success: true, data: db.dates || [] });
};

export const createDate = (req, res) => {
  const db = getDb();
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

  db.dates = db.dates || [];
  db.dates.push(newDate);

  if (saveDb(db)) {
    res.status(201).json({ success: true, message: 'Date added successfully.', data: newDate });
  } else {
    res.status(500).json({ success: false, message: 'Failed to add date.' });
  }
};

export const updateDate = (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const index = (db.dates || []).findIndex((d) => d.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Date not found.' });
  }

  db.dates[index] = {
    ...db.dates[index],
    ...req.body,
    id: db.dates[index].id
  };

  if (saveDb(db)) {
    res.json({ success: true, message: 'Date updated successfully.', data: db.dates[index] });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update date.' });
  }
};

export const deleteDate = (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const initialLen = (db.dates || []).length;
  db.dates = (db.dates || []).filter((d) => d.id !== id);

  if (db.dates.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Date not found.' });
  }

  if (saveDb(db)) {
    res.json({ success: true, message: 'Date deleted successfully.' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to delete date.' });
  }
};
