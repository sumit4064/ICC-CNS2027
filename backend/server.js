import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getDb } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import conferenceRoutes from './routes/conferenceRoutes.js';
import speakerRoutes from './routes/speakerRoutes.js';
import trackRoutes from './routes/trackRoutes.js';
import dateRoutes from './routes/dateRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import committeeRoutes from './routes/committeeRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB seed
getDb();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/conference', conferenceRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/dates', dateRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/committee', committeeRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    conference: 'ICC-CNS 2026',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` ICC-CNS 2026 API Server running on port ${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
