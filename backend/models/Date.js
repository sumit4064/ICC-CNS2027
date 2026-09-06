import mongoose from 'mongoose';

const dateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  displayDate: { type: String, required: true },
  description: { type: String, default: '' },
  highlight: { type: Boolean, default: false },
  status: { type: String, default: 'Upcoming' }
}, {
  timestamps: false,
  versionKey: false
});

export const DateModel = mongoose.models.Date || mongoose.model('Date', dateSchema);
export default DateModel;
