import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: 'N/A' },
  country: { type: String, required: true },
  institution: { type: String, required: true },
  participantType: { type: String, required: true },
  mode: { type: String, default: 'Offline (In-person)' },
  paperId: { type: String, default: 'N/A (Attendee Only)' },
  paperTitle: { type: String, default: '' },
  accompanyingPersons: { type: Number, default: 0 },
  dietaryRequirement: { type: String, default: 'Standard' },
  notes: { type: String, default: '' },
  amountPaid: { type: String, default: 'INR 6,500' },
  status: { type: String, default: 'Confirmed' },
  registeredAt: { type: String, default: () => new Date().toISOString() }
}, {
  timestamps: false,
  versionKey: false
});

export const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);
export default Registration;
