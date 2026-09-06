import mongoose from 'mongoose';

const registrationCategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  type: { type: String, required: true },
  inr: { type: String, required: true },
  usd: { type: String, required: true },
  desc: { type: String, default: '' }
}, {
  timestamps: false,
  versionKey: false
});

export const RegistrationCategory = mongoose.models.RegistrationCategory || mongoose.model('RegistrationCategory', registrationCategorySchema);
export default RegistrationCategory;
