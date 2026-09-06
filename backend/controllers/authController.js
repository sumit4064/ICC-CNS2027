import bcrypt from 'bcryptjs';
import { getDb, saveDb } from '../config/db.js';
import { generateToken } from '../middleware/authMiddleware.js';

export const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const db = getDb();
  const user = (db.users || []).find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
  }

  const token = generateToken(user);
  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

export const getMe = (req, res) => {
  const db = getDb();
  const user = (db.users || []).find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
