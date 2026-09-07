import mongoose from 'mongoose';

const historyItemSchema = new mongoose.Schema({
  action: { type: String, required: true },
  timestamp: { type: String, required: true },
  user: { type: String, required: true },
  notes: { type: String, default: '' }
}, { _id: false });

const submissionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  track: { type: String, default: 'Cognitive Computing & AI' },
  authors: { type: String, required: true },
  primaryAuthorEmail: { type: String, required: true, index: true },
  phone: { type: String, default: '' },
  institution: { type: String, required: true },
  country: { type: String, default: 'India' },
  abstract: { type: String, required: true },
  keywords: { type: String, default: 'AI, Networking, Cognitive Systems' },
  fileName: { type: String, default: 'manuscript.pdf' },
  filePath: { type: String, default: '/uploads/papers/sample_paper.pdf' },
  fileStorageKey: { type: String, default: null },
  status: {
    type: String,
    enum: ['Under Review', 'Accepted', 'Rejected'],
    default: 'Under Review'
  },
  isLocked: { type: Boolean, default: true },
  submittedAt: { type: String, default: () => new Date().toISOString() },
  decisionDate: { type: String },
  decidedBy: { type: String },
  decidedById: { type: String },
  reviewNotes: { type: String },
  rejectionReason: { type: String },
  history: [historyItemSchema]
}, {
  timestamps: false,
  versionKey: false
});

submissionSchema.index({ submittedAt: -1 });

export const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
export default Submission;

