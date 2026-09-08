import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  speakers: { type: String, default: '12+' },
  countries: { type: String, default: '8+' },
  registered: { type: String, default: '210+' },
  papersSubmitted: { type: String, default: '145+' }
}, { _id: false });

const publicationInfoSchema = new mongoose.Schema({
  status: { type: String, default: 'Announced by Organizers' },
  notice: { type: String, default: '' },
  publisher: { type: String, default: 'Conference Proceedings Series' },
  isbn: { type: String, default: 'To be announced' },
  isConfirmed: { type: Boolean, default: true }
}, { _id: false });

const contactSchema = new mongoose.Schema({
  email: { type: String, default: 'info@vignan.ac.in' },
  confEmail: { type: String, default: 'icccns2027@vignan.ac.in' },
  phone: { type: String, default: '+91-863-2344 700 / 701' },
  deptPhone: { type: String, default: '+91-863-2344 700 Ext: 201' },
  address: { type: String, default: '' },
  emergencyContact: { type: String, default: '+91-863-2344 700' }
}, { _id: false });

const conferenceSchema = new mongoose.Schema({
  year: { type: Number, default: 2027 },
  edition: { type: String, default: '3rd' },
  editionTag: { type: String, default: 'the 3rd ICC-CNS 2027' },
  shortName: { type: String, default: 'ICC-CNS 2027' },
  title: { type: String, required: true },
  subTitle: { type: String, default: '' },
  school: { type: String, default: '' },
  institution: { type: String, required: true },
  dates: { type: String, required: true },
  targetDate: { type: String, default: '2027-06-10T09:00:00.000Z' },
  mode: { type: String, default: 'Hybrid Mode' },
  modeDetail: { type: String, default: 'In-person & Online Virtual' },
  venueName: { type: String, default: '' },
  venueLocation: { type: String, default: '' },
  departmentEstablished: { type: String, default: '1997' },
  departmentPrograms: { type: String, default: '' },
  description: { type: String, default: '' },
  stats: { type: statsSchema, default: () => ({}) },
  publicationInfo: { type: publicationInfoSchema, default: () => ({}) },
  contact: { type: contactSchema, default: () => ({}) }
}, {
  timestamps: false,
  versionKey: false
});

export const Conference = mongoose.models.Conference || mongoose.model('Conference', conferenceSchema);
export default Conference;
