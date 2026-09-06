import { getDb, saveDb } from '../config/db.js';

export const submitContactMessage = (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
  }

  const db = getDb();
  const contactMsg = {
    id: `msg-${Date.now()}`,
    name,
    email,
    subject: subject || 'General Inquiry',
    message,
    receivedAt: new Date().toISOString()
  };

  db.messages = db.messages || [];
  db.messages.unshift(contactMsg);

  if (saveDb(db)) {
    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent to the ICC-CNS organizing team. We will respond shortly.'
    });
  } else {
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};

export const getContactMessages = (req, res) => {
  const db = getDb();
  res.json({ success: true, data: db.messages || [] });
};
