import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  number: { type: String, default: '01' },
  code: { type: String, default: 'TRACK-01' },
  name: { type: String, required: true },
  color: { type: String, default: '#FF6B35' },
  accent: { type: String, default: 'orange' },
  summary: { type: String, default: '' },
  topics: [{ type: String }]
}, {
  timestamps: false,
  versionKey: false
});

export const Track = mongoose.models.Track || mongoose.model('Track', trackSchema);
export default Track;
