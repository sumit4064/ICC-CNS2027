import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  designation: { type: String, default: 'Keynote Speaker' },
  institution: { type: String, required: true },
  country: { type: String, default: 'International' },
  track: { type: String, default: 'Cognitive Computing' },
  topic: { type: String, default: '' },
  bio: { type: String, default: '' },
  image: { type: String, default: null },
  imageStorageKey: { type: String, default: null },
  type: { type: String, default: 'Keynote' }
}, {
  timestamps: false,
  versionKey: false
});

export const Speaker = mongoose.models.Speaker || mongoose.model('Speaker', speakerSchema);
export default Speaker;
