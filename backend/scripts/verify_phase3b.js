import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

import {
  Conference,
  DateModel,
  Track,
  RegistrationCategory,
  Speaker,
  Committee,
  Gallery,
  Faq,
  Registration,
  Submission,
  User,
  Message,
  Counter
} from '../models/index.js';

async function runValidation() {
  console.log('==================================================');
  console.log(' PHASE 3B VERIFICATION & READ-ONLY API TEST SUITE');
  console.log('==================================================');

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('FAIL: MONGODB_URI is not defined in backend/.env');
    process.exit(1);
  }

  // 1. Check DB Connection
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[1/5] MongoDB Atlas Connection: SUCCESS');
  } catch (err) {
    console.error('[1/5] MongoDB Atlas Connection: FAILED', err.message);
    process.exit(1);
  }

  // 2. Pre-test collection count inspection
  console.log('\n[2/5] Inspecting Baseline Atlas Document Counts:');
  const baselineCounts = {
    conferences: await Conference.countDocuments(),
    dates: await DateModel.countDocuments(),
    tracks: await Track.countDocuments(),
    registrationCategories: await RegistrationCategory.countDocuments(),
    speakers: await Speaker.countDocuments(),
    committee: await Committee.countDocuments(),
    gallery: await Gallery.countDocuments(),
    faqs: await Faq.countDocuments(),
    registrations: await Registration.countDocuments(),
    submissions: await Submission.countDocuments(),
    users: await User.countDocuments(),
    messages: await Message.countDocuments()
  };

  const counterDoc = await Counter.findById('paperSequence').lean();
  const baselineCounter = counterDoc ? counterDoc.seq : null;

  for (const [col, count] of Object.entries(baselineCounts)) {
    console.log(`  - ${col.padEnd(24)}: ${count}`);
  }
  console.log(`  - ${'Counter (paperSequence)'.padEnd(24)}: ${baselineCounter}`);

  // Expected counts verification
  const expected = {
    conferences: 1,
    dates: 6,
    tracks: 3,
    registrationCategories: 5,
    speakers: 6,
    committee: 145,
    gallery: 6,
    faqs: 6,
    registrations: 1,
    submissions: 0,
    users: 2,
    messages: 0,
    counter: 1
  };

  let countMismatch = false;
  for (const [key, val] of Object.entries(expected)) {
    if (key === 'counter') {
      if (baselineCounter !== val) {
        console.error(`  MISMATCH: counter paperSequence is ${baselineCounter}, expected ${val}`);
        countMismatch = true;
      }
    } else {
      if (baselineCounts[key] !== val) {
        console.error(`  MISMATCH: ${key} count is ${baselineCounts[key]}, expected ${val}`);
        countMismatch = true;
      }
    }
  }

  if (countMismatch) {
    console.error('\nERROR: Baseline counts do not match expected Atlas migration numbers.');
  } else {
    console.log('\nAll baseline counts MATCH Phase 2C migrated values perfectly.');
  }

  // 3. Test API endpoints against running server or direct controller/route invocation
  console.log('\n[3/5] Starting In-Process API Test via supertest / direct fetch:');
  
  // Dynamic import of server app
  // To test without port conflicts, we can import app
  const express = (await import('express')).default;
  const cors = (await import('cors')).default;
  
  const authRoutes = (await import('../routes/authRoutes.js')).default;
  const conferenceRoutes = (await import('../routes/conferenceRoutes.js')).default;
  const speakerRoutes = (await import('../routes/speakerRoutes.js')).default;
  const trackRoutes = (await import('../routes/trackRoutes.js')).default;
  const dateRoutes = (await import('../routes/dateRoutes.js')).default;
  const registrationRoutes = (await import('../routes/registrationRoutes.js')).default;
  const submissionRoutes = (await import('../routes/submissionRoutes.js')).default;
  const committeeRoutes = (await import('../routes/committeeRoutes.js')).default;
  const galleryRoutes = (await import('../routes/galleryRoutes.js')).default;
  const contactRoutes = (await import('../routes/contactRoutes.js')).default;

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/conference', conferenceRoutes);
  app.use('/api/speakers', speakerRoutes);
  app.use('/api/tracks', trackRoutes);
  app.use('/api/dates', dateRoutes);
  app.use('/api/registrations', registrationRoutes);
  app.use('/api/submissions', submissionRoutes);
  app.use('/api/committee', committeeRoutes);
  app.use('/api/gallery', galleryRoutes);
  app.use('/api/contact', contactRoutes);

  // Start temporary listener
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`  Test HTTP server active on ${baseUrl}`);

  const testResults = [];

  async function testGet(endpoint, token = null) {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${baseUrl}${endpoint}`, { headers });
    const json = await res.json();
    const passed = res.ok && json.success !== false;
    testResults.push({ endpoint, status: res.status, ok: passed });
    return { status: res.status, ok: passed, json };
  }

  // Test 1: GET /api/conference
  const confRes = await testGet('/api/conference');
  console.log(`  GET /api/conference -> Status ${confRes.status} | DynamicStats:`, JSON.stringify(confRes.json?.data?.dynamicStats));

  // Test 2: GET /api/dates
  const datesRes = await testGet('/api/dates');
  console.log(`  GET /api/dates -> Status ${datesRes.status} | Count: ${datesRes.json?.data?.length}`);

  // Test 3: GET /api/tracks
  const tracksRes = await testGet('/api/tracks');
  console.log(`  GET /api/tracks -> Status ${tracksRes.status} | Count: ${tracksRes.json?.data?.length}`);

  // Test 4: GET /api/speakers
  const speakersRes = await testGet('/api/speakers');
  console.log(`  GET /api/speakers -> Status ${speakersRes.status} | Count: ${speakersRes.json?.data?.length}`);

  // Test 5: GET /api/committee
  const commRes = await testGet('/api/committee');
  console.log(`  GET /api/committee -> Status ${commRes.status} | Count: ${commRes.json?.count || commRes.json?.data?.length}`);

  // Test 6: GET /api/gallery
  const gallRes = await testGet('/api/gallery');
  console.log(`  GET /api/gallery -> Status ${gallRes.status} | Count: ${gallRes.json?.data?.length}`);

  // Test 7: GET /api/registrations/categories
  const catRes = await testGet('/api/registrations/categories');
  console.log(`  GET /api/registrations/categories -> Status ${catRes.status} | Count: ${catRes.json?.data?.length}`);

  // Test 8: POST /api/auth/login (Admin)
  console.log('\n[4/5] Testing Authentication:');
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'hodcse@vignan.ac.in', password: 'VFSTR@2027' })
  });
  const loginJson = await loginRes.json();
  const token = loginJson.token;
  console.log(`  POST /api/auth/login -> Status ${loginRes.status} | Success: ${loginJson.success} | Role: ${loginJson.user?.role}`);

  if (!token) {
    console.error('FAIL: Could not obtain admin JWT token from login.');
  }

  // Test 9: GET /api/auth/me
  const meRes = await testGet('/api/auth/me', token);
  console.log(`  GET /api/auth/me -> Status ${meRes.status} | User: ${meRes.json?.user?.email} (${meRes.json?.user?.role})`);

  // Test 10: GET /api/registrations (Admin)
  const regsRes = await testGet('/api/registrations', token);
  console.log(`  GET /api/registrations -> Status ${regsRes.status} | Count: ${regsRes.json?.data?.length}`);

  // Test 11: GET /api/submissions (Admin)
  const subsRes = await testGet('/api/submissions', token);
  console.log(`  GET /api/submissions -> Status ${subsRes.status} | Count: ${subsRes.json?.data?.length}`);

  // Test 12: GET /api/contact (Admin)
  const contactRes = await testGet('/api/contact', token);
  console.log(`  GET /api/contact -> Status ${contactRes.status} | Count: ${contactRes.json?.data?.length}`);

  // Close test server
  server.close();

  // 4. Post-test verification of Atlas collection counts
  console.log('\n[5/5] Verifying Atlas Document Counts Post-Testing (Must be Identical):');
  const postCounts = {
    conferences: await Conference.countDocuments(),
    dates: await DateModel.countDocuments(),
    tracks: await Track.countDocuments(),
    registrationCategories: await RegistrationCategory.countDocuments(),
    speakers: await Speaker.countDocuments(),
    committee: await Committee.countDocuments(),
    gallery: await Gallery.countDocuments(),
    faqs: await Faq.countDocuments(),
    registrations: await Registration.countDocuments(),
    submissions: await Submission.countDocuments(),
    users: await User.countDocuments(),
    messages: await Message.countDocuments()
  };
  const postCounter = (await Counter.findById('paperSequence').lean())?.seq;

  let allUnchanged = true;
  for (const [col, count] of Object.entries(postCounts)) {
    const isUnchanged = count === baselineCounts[col];
    console.log(`  - ${col.padEnd(24)}: ${count} (Unchanged: ${isUnchanged})`);
    if (!isUnchanged) allUnchanged = false;
  }
  const counterUnchanged = postCounter === baselineCounter;
  console.log(`  - ${'Counter (paperSequence)'.padEnd(24)}: ${postCounter} (Unchanged: ${counterUnchanged})`);
  if (!counterUnchanged) allUnchanged = false;

  await mongoose.disconnect();

  console.log('\n==================================================');
  if (allUnchanged && testResults.every(t => t.ok) && token) {
    console.log(' ALL PHASE 3B VERIFICATIONS PASSED SUCCESSFULLY!');
    console.log(' MongoDB Atlas runtime wiring is verified & healthy.');
    console.log('==================================================');
    process.exit(0);
  } else {
    console.error(' VALIDATION COMPLETED WITH ISSUES.');
    console.log('==================================================');
    process.exit(1);
  }
}

runValidation().catch((err) => {
  console.error('Fatal Verification Error:', err);
  process.exit(1);
});
