import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  category: { type: String, default: 'Campus' },
  image: { type: String, required: true },
  imageStorageKey: { type: String, default: null },
  description: { type: String, default: '' }
}, {
  timestamps: false,
  versionKey: false
});

export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
export default Gallery;
