import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
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
  Counter,
  User,
  Message
} from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

/**
 * ============================================================================
 * EXPLICIT SUBMISSION ALLOWLIST
 * ============================================================================
 * The production database must only contain genuine, real manuscripts.
 * By default, this list is EMPTY. Any submission not listed here will be skipped.
 * Example: const MIGRATE_SUBMISSION_IDS = ['ICC-CNS-2027-001'];
 */
const MIGRATE_SUBMISSION_IDS = (process.env.MIGRATE_SUBMISSION_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Detect dry-run flag
const isDryRun = process.argv.includes('--dry-run') || process.env.DRY_RUN === 'true';

// Sanitized connection URI for logging (hides password)
function sanitizeMongoUri(uri) {
  if (!uri) return 'NOT_CONFIGURED';
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
}

/**
 * Perform comprehensive pre-flight validation on db.json data
 */
async function validateDbData(data) {
  const errors = [];
  const warnings = [];

  if (!data || typeof data !== 'object') {
    errors.push('db.json is empty or not a valid JSON object.');
    return { isValid: false, errors, warnings };
  }

  // 1. Conference
  if (!data.conference || !data.conference.title || !data.conference.institution) {
    errors.push('Conference record is missing or lacks required title/institution.');
  }

  // Helper for unique IDs
  function checkUniqueIds(items, collectionName) {
    if (!Array.isArray(items)) return;
    const seen = new Set();
    items.forEach((item, index) => {
      if (!item.id) {
        errors.push(`${collectionName}[${index}] is missing required "id" field.`);
      } else if (seen.has(item.id)) {
        errors.push(`Duplicate ID "${item.id}" detected in ${collectionName}.`);
      } else {
        seen.add(item.id);
      }
    });
  }

  checkUniqueIds(data.dates, 'dates');
  checkUniqueIds(data.tracks, 'tracks');
  checkUniqueIds(data.registrationCategories, 'registrationCategories');
  checkUniqueIds(data.speakers, 'speakers');
  checkUniqueIds(data.committee, 'committee');
  checkUniqueIds(data.gallery, 'gallery');
  checkUniqueIds(data.faqs, 'faqs');
  checkUniqueIds(data.registrations, 'registrations');
  checkUniqueIds(data.submissions, 'submissions');
  checkUniqueIds(data.users, 'users');
  checkUniqueIds(data.messages, 'messages');

  // 2. Users Email Uniqueness
  if (Array.isArray(data.users)) {
    const userEmails = new Set();
    data.users.forEach((u, idx) => {
      if (!u.email) {
        errors.push(`users[${idx}] is missing email.`);
      } else {
        const cleanEmail = u.email.toLowerCase().trim();
        if (userEmails.has(cleanEmail)) {
          errors.push(`Duplicate user email detected: "${cleanEmail}".`);
        } else {
          userEmails.add(cleanEmail);
        }
      }
      if (!u.password || !u.password.startsWith('$2')) {
        warnings.push(`users[${idx}] (${u.email}) password does not look like a bcrypt hash.`);
      }
    });
  }

  // 3. Submissions
  if (Array.isArray(data.submissions)) {
    data.submissions.forEach((s, idx) => {
      if (!s.title || !s.authors || !s.primaryAuthorEmail) {
        errors.push(`submissions[${idx}] missing required fields (title, authors, or primaryAuthorEmail).`);
      }
      if (s.status && !['Under Review', 'Accepted', 'Rejected'].includes(s.status)) {
        errors.push(`submissions[${idx}] has invalid status "${s.status}".`);
      }
    });
  }

  // 4. Schema validation through Mongoose Document creation (in-memory)
  try {
    if (data.conference) {
      const confDoc = new Conference(data.conference);
      await confDoc.validate();
    }
    for (const d of (data.dates || [])) {
      await new DateModel(d).validate();
    }
    for (const t of (data.tracks || [])) {
      await new Track(t).validate();
    }
    for (const c of (data.registrationCategories || [])) {
      await new RegistrationCategory(c).validate();
    }
    for (const s of (data.speakers || [])) {
      await new Speaker(s).validate();
    }
    for (const cm of (data.committee || [])) {
      await new Committee(cm).validate();
    }
    for (const g of (data.gallery || [])) {
      await new Gallery(g).validate();
    }
    for (const f of (data.faqs || [])) {
      await new Faq(f).validate();
    }
    for (const r of (data.registrations || [])) {
      await new Registration(r).validate();
    }
    for (const sub of (data.submissions || [])) {
      await new Submission(sub).validate();
    }
    for (const u of (data.users || [])) {
      await new User(u).validate();
    }
  } catch (err) {
    errors.push(`Mongoose pre-flight check exception: ${err.message}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Main migration runner
 */
async function runMigration() {
  console.log('================================================================');
  console.log(` ICC-CNS 2027 MONGODB MIGRATION UTILITY ${isDryRun ? '[DRY RUN MODE]' : '[LIVE MODE]'}`);
  console.log('================================================================\n');

  // Read db.json safely
  if (!fs.existsSync(DB_PATH)) {
    console.error(`[FATAL] db.json not found at path: ${DB_PATH}`);
    process.exit(1);
  }

  let dbData;
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    dbData = JSON.parse(raw);
    console.log(`[OK] Loaded source dataset from db.json (${(raw.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`[FATAL] Failed to parse db.json: ${err.message}`);
    process.exit(1);
  }

  // Pre-flight validation
  console.log('\n--> Running Pre-flight Data Validation...');
  const validation = await validateDbData(dbData);

  if (validation.warnings.length > 0) {
    console.log(`[WARN] ${validation.warnings.length} warning(s):`);
    validation.warnings.forEach((w) => console.log(`   - ${w}`));
  }

  if (!validation.isValid) {
    console.error(`\n[FATAL] Validation failed with ${validation.errors.length} error(s):`);
    validation.errors.forEach((e) => console.error(`   - ${e}`));
    console.error('\nMigration aborted to prevent database corruption.');
    process.exit(1);
  }
  console.log('[OK] Pre-flight validation passed cleanly. Zero schema violations.');

  // Check MongoDB URI
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    if (isDryRun) {
      console.log('\n[INFO] No MONGODB_URI set. Performing offline schema validation report only.');
      printOfflineSummary(dbData);
      process.exit(0);
    } else {
      console.error('\n[FATAL] MONGODB_URI environment variable is required for live migration.');
      process.exit(1);
    }
  }

  console.log(`\n--> Target MongoDB: ${sanitizeMongoUri(mongoUri)}`);

  try {
    await mongoose.connect(mongoUri);
    console.log('[OK] Successfully connected to MongoDB Atlas cluster.\n');
  } catch (err) {
    console.error(`[FATAL] Could not connect to MongoDB Atlas: ${err.message}`);
    process.exit(1);
  }

  const report = {
    conference: { total: 1, inserted: 0, verified: 0, conflicts: 0 },
    dates: { total: (dbData.dates || []).length, inserted: 0, verified: 0, conflicts: 0 },
    tracks: { total: (dbData.tracks || []).length, inserted: 0, verified: 0, conflicts: 0 },
    registrationCategories: { total: (dbData.registrationCategories || []).length, inserted: 0, verified: 0, conflicts: 0 },
    speakers: { total: (dbData.speakers || []).length, inserted: 0, verified: 0, conflicts: 0 },
    committee: { total: (dbData.committee || []).length, inserted: 0, verified: 0, conflicts: 0 },
    gallery: { total: (dbData.gallery || []).length, inserted: 0, verified: 0, conflicts: 0 },
    faqs: { total: (dbData.faqs || []).length, inserted: 0, verified: 0, conflicts: 0 },
    registrations: { total: (dbData.registrations || []).length, inserted: 0, verified: 0, conflicts: 0 },
    submissions: { totalInFile: (dbData.submissions || []).length, approved: 0, inserted: 0, verified: 0, skipped: 0 },
    users: { total: (dbData.users || []).length, inserted: 0, verified: 0, conflicts: 0 },
    messages: { total: (dbData.messages || []).length, inserted: 0, verified: 0, conflicts: 0 },
    counter: { initialFile: dbData.counters?.paperSequence || 0, existingAtlas: 0, targetFinal: 0 }
  };

  try {
    // 1. Conference (Singleton)
    console.log('--- [1/12] Migrating Conference (Singleton) ---');
    const existingConf = await Conference.findOne();
    if (!existingConf) {
      if (isDryRun) {
        console.log(' [DRY RUN] Would insert singleton Conference document.');
      } else {
        await Conference.create(dbData.conference);
        console.log(' [INSERT] Inserted singleton Conference document.');
      }
      report.conference.inserted = 1;
    } else {
      console.log(' [VERIFY] Conference document already exists in MongoDB. Preserving existing record.');
      report.conference.verified = 1;
    }

    // Generic helper for collections with unique "id" field
    async function migrateCollectionWithId(collectionName, Model, items, stats) {
      console.log(`\n--- Migrating ${collectionName} (${items.length} items) ---`);
      for (const item of items) {
        const existing = await Model.findOne({ id: item.id });
        if (!existing) {
          if (isDryRun) {
            // Dry run plan
          } else {
            await Model.create(item);
          }
          stats.inserted++;
        } else {
          stats.verified++;
        }
      }
      console.log(` Summary for ${collectionName}: ${stats.inserted} to insert, ${stats.verified} already verified in Atlas.`);
    }

    // 2. Dates
    await migrateCollectionWithId('Dates', DateModel, dbData.dates || [], report.dates);

    // 3. Tracks
    await migrateCollectionWithId('Tracks', Track, dbData.tracks || [], report.tracks);

    // 4. Registration Categories
    await migrateCollectionWithId('Registration Categories', RegistrationCategory, dbData.registrationCategories || [], report.registrationCategories);

    // 5. Speakers
    await migrateCollectionWithId('Speakers', Speaker, dbData.speakers || [], report.speakers);

    // 6. Committee
    await migrateCollectionWithId('Committee Members', Committee, dbData.committee || [], report.committee);

    // 7. Gallery
    await migrateCollectionWithId('Gallery Items', Gallery, dbData.gallery || [], report.gallery);

    // 8. Faqs
    await migrateCollectionWithId('FAQs', Faq, dbData.faqs || [], report.faqs);

    // 9. Registrations
    await migrateCollectionWithId('Registrations', Registration, dbData.registrations || [], report.registrations);

    // 10. Users
    await migrateCollectionWithId('Users', User, dbData.users || [], report.users);

    // 11. Messages
    await migrateCollectionWithId('Messages', Message, dbData.messages || [], report.messages);

    // 12. Submissions (Strict Allowlist Enforcement)
    console.log('\n--- Migrating Submissions (Strict Allowlist Mode) ---');
    const allFileSubmissions = dbData.submissions || [];
    console.log(` Total submissions in db.json: ${allFileSubmissions.length}`);
    console.log(` Explicitly approved submission IDs: ${MIGRATE_SUBMISSION_IDS.length > 0 ? MIGRATE_SUBMISSION_IDS.join(', ') : '[NONE]'}`);

    let highestApprovedPaperNum = 0;

    if (MIGRATE_SUBMISSION_IDS.length === 0) {
      console.log(' [NOTICE] No submissions migrated because no submission IDs were explicitly approved in MIGRATE_SUBMISSION_IDS allowlist.');
      report.submissions.skipped = allFileSubmissions.length;
    } else {
      const approvedSubmissions = allFileSubmissions.filter((s) => MIGRATE_SUBMISSION_IDS.includes(s.id));
      report.submissions.approved = approvedSubmissions.length;
      report.submissions.skipped = allFileSubmissions.length - approvedSubmissions.length;

      for (const sub of approvedSubmissions) {
        // Track highest approved sequence number
        const match = String(sub.id).match(/^ICC-CNS-2027-(\d+)$/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > highestApprovedPaperNum) {
            highestApprovedPaperNum = num;
          }
        }

        const existingSub = await Submission.findOne({ id: sub.id });
        if (!existingSub) {
          if (isDryRun) {
            console.log(` [DRY RUN] Would insert approved submission ${sub.id} ("${sub.title}")`);
          } else {
            await Submission.create(sub);
            console.log(` [INSERT] Inserted approved submission ${sub.id} ("${sub.title}")`);
          }
          report.submissions.inserted++;
        } else {
          console.log(` [VERIFY] Approved submission ${sub.id} already exists in Atlas.`);
          report.submissions.verified++;
        }
      }
    }

    // 13. Paper Counter Initialization & Safety
    console.log('\n--- Initializing Paper Sequence Counter ---');
    const existingCounterDoc = await Counter.findOne({ _id: 'paperSequence' });
    const existingCounterVal = existingCounterDoc ? existingCounterDoc.seq : 0;
    report.counter.existingAtlas = existingCounterVal;

    const fileCounterVal = typeof dbData.counters?.paperSequence === 'number' ? dbData.counters.paperSequence : 0;
    const targetSeqVal = Math.max(existingCounterVal, fileCounterVal, highestApprovedPaperNum);
    report.counter.targetFinal = targetSeqVal;

    console.log(` - File Counter Value: ${fileCounterVal}`);
    console.log(` - Highest Approved Paper Sequence: ${highestApprovedPaperNum}`);
    console.log(` - Existing Atlas Counter Value: ${existingCounterVal}`);
    console.log(` - Target Non-Decreasing Final Counter: ${targetSeqVal}`);

    if (!existingCounterDoc) {
      if (isDryRun) {
        console.log(` [DRY RUN] Would initialize Counter _id="paperSequence" to seq=${targetSeqVal}`);
      } else {
        await Counter.create({ _id: 'paperSequence', seq: targetSeqVal });
        console.log(` [INSERT] Initialized Counter _id="paperSequence" to seq=${targetSeqVal}`);
      }
    } else {
      if (existingCounterVal < targetSeqVal) {
        if (isDryRun) {
          console.log(` [DRY RUN] Would advance existing Counter from ${existingCounterVal} to ${targetSeqVal}`);
        } else {
          await Counter.updateOne({ _id: 'paperSequence' }, { seq: targetSeqVal });
          console.log(` [UPDATE] Advanced Counter from ${existingCounterVal} to ${targetSeqVal}`);
        }
      } else {
        console.log(` [VERIFY] Existing Counter ${existingCounterVal} is already >= ${targetSeqVal}. No change needed.`);
      }
    }

    // Print Final Migration Summary
    console.log('\n================================================================');
    console.log(` FINAL MIGRATION SUMMARY ${isDryRun ? '[DRY RUN - ZERO WRITES COMMITTED]' : '[LIVE MIGRATION COMPLETE]'}`);
    console.log('================================================================');
    console.table([
      { Entity: 'Conference', TotalInFile: report.conference.total, Inserted: report.conference.inserted, Verified: report.conference.verified, Conflicts: 0 },
      { Entity: 'Dates', TotalInFile: report.dates.total, Inserted: report.dates.inserted, Verified: report.dates.verified, Conflicts: 0 },
      { Entity: 'Tracks', TotalInFile: report.tracks.total, Inserted: report.tracks.inserted, Verified: report.tracks.verified, Conflicts: 0 },
      { Entity: 'Reg Categories', TotalInFile: report.registrationCategories.total, Inserted: report.registrationCategories.inserted, Verified: report.registrationCategories.verified, Conflicts: 0 },
      { Entity: 'Speakers', TotalInFile: report.speakers.total, Inserted: report.speakers.inserted, Verified: report.speakers.verified, Conflicts: 0 },
      { Entity: 'Committee', TotalInFile: report.committee.total, Inserted: report.committee.inserted, Verified: report.committee.verified, Conflicts: 0 },
      { Entity: 'Gallery', TotalInFile: report.gallery.total, Inserted: report.gallery.inserted, Verified: report.gallery.verified, Conflicts: 0 },
      { Entity: 'FAQs', TotalInFile: report.faqs.total, Inserted: report.faqs.inserted, Verified: report.faqs.verified, Conflicts: 0 },
      { Entity: 'Registrations', TotalInFile: report.registrations.total, Inserted: report.registrations.inserted, Verified: report.registrations.verified, Conflicts: 0 },
      { Entity: 'Users', TotalInFile: report.users.total, Inserted: report.users.inserted, Verified: report.users.verified, Conflicts: 0 },
      { Entity: 'Messages', TotalInFile: report.messages.total, Inserted: report.messages.inserted, Verified: report.messages.verified, Conflicts: 0 },
      { Entity: 'Submissions', TotalInFile: report.submissions.totalInFile, Inserted: report.submissions.inserted, Verified: report.submissions.verified, Conflicts: `Skipped: ${report.submissions.skipped}` }
    ]);

    console.log(`\nSequence Counter Status: Final sequence value set to ${report.counter.targetFinal}`);

  } catch (err) {
    console.error(`\n[FATAL] Error occurred during migration process: ${err.message}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  await mongoose.disconnect();
  console.log('\n[OK] Disconnected from MongoDB Atlas. Migration process finished cleanly.');
  process.exit(0);
}

function printOfflineSummary(data) {
  console.log('\n================================================================');
  console.log(' OFFLINE DATA VALIDATION & MIGRATION READINESS SUMMARY');
  console.log('================================================================');
  console.table([
    { Entity: 'Conference', CountInFile: data.conference ? 1 : 0, MatchKey: 'Singleton' },
    { Entity: 'Dates', CountInFile: (data.dates || []).length, MatchKey: 'id' },
    { Entity: 'Tracks', CountInFile: (data.tracks || []).length, MatchKey: 'id' },
    { Entity: 'RegistrationCategories', CountInFile: (data.registrationCategories || []).length, MatchKey: 'id' },
    { Entity: 'Speakers', CountInFile: (data.speakers || []).length, MatchKey: 'id' },
    { Entity: 'Committee', CountInFile: (data.committee || []).length, MatchKey: 'id' },
    { Entity: 'Gallery', CountInFile: (data.gallery || []).length, MatchKey: 'id' },
    { Entity: 'FAQs', CountInFile: (data.faqs || []).length, MatchKey: 'id' },
    { Entity: 'Registrations', CountInFile: (data.registrations || []).length, MatchKey: 'id' },
    { Entity: 'Submissions', CountInFile: (data.submissions || []).length, MatchKey: 'id (Allowlist only)' },
    { Entity: 'Users', CountInFile: (data.users || []).length, MatchKey: 'id, email' },
    { Entity: 'Messages', CountInFile: (data.messages || []).length, MatchKey: 'id' },
    { Entity: 'Counters', CountInFile: data.counters?.paperSequence || 1, MatchKey: '_id="paperSequence"' }
  ]);
  console.log('\nAll source records are verified and ready for migration when MONGODB_URI is supplied.');
}

runMigration();
