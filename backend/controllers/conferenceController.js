import { getDb, saveDb } from '../config/db.js';

export const getConference = (req, res) => {
  const db = getDb();
  // calculate dynamic stats from arrays
  const speakerCount = (db.speakers || []).length;
  const regCount = (db.registrations || []).length;
  const paperCount = (db.submissions || []).length;

  const conf = {
    ...db.conference,
    dynamicStats: {
      speakers: `${speakerCount}+`,
      countries: "6+",
      registered: `${regCount}+`,
      papersSubmitted: `${paperCount}+`
    }
  };

  res.json({ success: true, data: conf });
};

export const updateConference = (req, res) => {
  const db = getDb();
  db.conference = {
    ...db.conference,
    ...req.body
  };

  if (saveDb(db)) {
    res.json({ success: true, message: 'Conference details updated successfully.', data: db.conference });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update conference details.' });
  }
};
