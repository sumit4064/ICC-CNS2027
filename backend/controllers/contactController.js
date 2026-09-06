import { Message } from '../models/index.js';

export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
    }

    const contactMsg = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      receivedAt: new Date().toISOString()
    };

    await Message.create(contactMsg);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent to the ICC-CNS organizing team. We will respond shortly.'
    });
  } catch (error) {
    console.error('Error submitting contact message:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ receivedAt: -1 }).lean();
    return res.json({ success: true, data: messages || [] });
  } catch (error) {
    console.error('Error fetching contact messages:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch contact messages.' });
  }
};

