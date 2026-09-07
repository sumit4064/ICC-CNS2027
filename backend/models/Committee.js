import mongoose from 'mongoose';

const committeeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  _id: { type: String },
  name: { type: String, required: true },
  role: { type: String, default: '' },
  institution: { type: String, default: "Vignan's Group" },
  org: { type: String, default: "Vignan's Group" },
  designation: { type: String, default: '' },
  department: { type: String, default: '' },
  category: { type: String, default: 'Organizing Committee' },
  country: { type: String, default: 'India' },
  bio: { type: String, default: '' },
  email: { type: String, default: '' },
  imageUrl: { type: String, default: null },
  imagePublicId: { type: String, default: null },
  imageStorageKey: { type: String, default: null },
  displayOrder: { type: Number, default: 99 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: false,
  versionKey: false,
  _id: false
});

committeeSchema.index({ isActive: 1, displayOrder: 1, name: 1 });
committeeSchema.index({ category: 1, displayOrder: 1 });

export const Committee = mongoose.models.Committee || mongoose.model('Committee', committeeSchema);
export default Committee;
