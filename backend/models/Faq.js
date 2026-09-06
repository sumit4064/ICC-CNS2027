import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, {
  timestamps: false,
  versionKey: false
});

export const Faq = mongoose.models.Faq || mongoose.model('Faq', faqSchema);
export default Faq;
