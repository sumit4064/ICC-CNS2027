import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDatabase } from './config/db.js';

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
import assetRoutes from './routes/assetRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Environment-controlled CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server health checks)
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS policy'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use('/api/assets', assetRoutes);
app.use('/api/media', assetRoutes);
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
    conference: 'ICC-CNS 2027',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

async function startServer() {
  try {
    // Validate critical security environment variables before starting
    if (!process.env.JWT_SECRET || !process.env.JWT_SECRET.trim()) {
      throw new Error('JWT_SECRET environment variable is missing or empty.');
    }

    await connectDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`=========================================`);
      console.log(` ICC-CNS 2027 API Server running on port ${PORT}`);
      console.log(` Health: http://localhost:${PORT}/api/health`);
      console.log(`=========================================`);
    });
  } catch (err) {
    console.error('FATAL: Server startup aborted.', err.message);
    process.exit(1);
  }
}

startServer();

