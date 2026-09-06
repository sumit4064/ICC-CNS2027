import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, required: true },
  receivedAt: { type: String, default: () => new Date().toISOString() }
}, {
  timestamps: false,
  versionKey: false
});

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;
