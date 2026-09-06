import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const papersDir = path.join(__dirname, '..', 'uploads', 'papers');
const galleryDir = path.join(__dirname, '..', 'uploads', 'gallery');
const committeeDir = path.join(__dirname, '..', 'uploads', 'committee');
const speakersDir = path.join(__dirname, '..', 'uploads', 'speakers');

[papersDir, galleryDir, committeeDir, speakersDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const paperStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, papersDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${cleanName}`);
  }
});

const paperFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF, DOC, and DOCX files are allowed.'), false);
  }
};

export const uploadPaper = multer({
  storage: paperStorage,
  fileFilter: paperFilter,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB limit
});

const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, galleryDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `gallery-${Date.now()}-${cleanName}`);
  }
});

export const uploadGallery = multer({
  storage: galleryStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

const committeeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, committeeDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `member-${Date.now()}-${cleanName}`);
  }
});

const imageFilter = (req, file, cb) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image format. Only PNG, JPG, JPEG, and WebP images are allowed.'), false);
  }
};

export const uploadCommittee = multer({
  storage: committeeStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

const speakerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, speakersDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `speaker-${Date.now()}-${cleanName}`);
  }
});

const speakerFilter = (req, file, cb) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedExtensions.includes(ext) && (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('image/'))) {
    cb(null, true);
  } else {
    cb(new Error('Please upload a JPG, PNG, or WEBP image under 5 MB.'), false);
  }
};

export const uploadSpeaker = multer({
  storage: speakerStorage,
  fileFilter: speakerFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});


