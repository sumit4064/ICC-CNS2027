import multer from 'multer';
import path from 'path';

// Shared in-memory storage engine for direct cloud streaming
const memoryStorage = multer.memoryStorage();

// Manuscript File Filter (.pdf, .doc, .docx)
const paperFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF, DOC, and DOCX files are allowed.'), false);
  }
};

// Paper submission upload middleware (25 MB max in memory)
export const uploadPaper = multer({
  storage: memoryStorage,
  fileFilter: paperFilter,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB limit
});

// Image filter (.png, .jpg, .jpeg, .webp, .svg)
const imageFilter = (req, file, cb) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext) || (file.mimetype && file.mimetype.startsWith('image/'))) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image format. Only PNG, JPG, JPEG, and WebP images are allowed.'), false);
  }
};

// Gallery image upload middleware (10 MB max in memory)
export const uploadGallery = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// Committee member upload middleware (10 MB max in memory)
export const uploadCommittee = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// Speaker portrait image filter (.png, .jpg, .jpeg, .webp)
const speakerFilter = (req, file, cb) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedExtensions.includes(ext) && (allowedMimes.includes(file.mimetype) || (file.mimetype && file.mimetype.startsWith('image/')))) {
    cb(null, true);
  } else {
    cb(new Error('Please upload a JPG, PNG, or WEBP image under 5 MB.'), false);
  }
};

// Keynote speaker upload middleware (5 MB max in memory)
export const uploadSpeaker = multer({
  storage: memoryStorage,
  fileFilter: speakerFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});



