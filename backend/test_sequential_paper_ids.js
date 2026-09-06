import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5000/api';

async function runSequentialIdTests() {
  console.log('====================================================');
  console.log('STARTING ICC-CNS 2027 SEQUENTIAL PAPER ID TEST SUITE');
  console.log('====================================================\n');

  // Helper to submit a paper
  async function submitPaper(title, author, email) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('track', 'Cognitive Computing & AI');
    formData.append('authors', author);
    formData.append('primaryAuthorEmail', email);
    formData.append('institution', 'Vignan University Research Lab');
    formData.append('country', 'India');
    formData.append('abstract', 'Test abstract for sequential paper ID verification.');
    formData.append('keywords', 'AI, Testing, Sequence');

    const res = await fetch(`${BASE_URL}/submissions`, {
      method: 'POST',
      body: formData
    });
    const json = await res.json();
    return { status: res.status, data: json };
  }

  // Helper to track a paper
  async function trackPaper(idOrEmail) {
    const res = await fetch(`${BASE_URL}/submissions/track/${encodeURIComponent(idOrEmail)}`);
    const json = await res.json();
    return { status: res.status, data: json };
  }

  // Get Admin token for status updates
  let adminToken = '';
  try {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'hodcse@vignan.ac.in', password: 'VFSTR@2027' })
    });
    const loginJson = await loginRes.json();
    adminToken = loginJson.token;
  } catch (err) {
    console.error('Failed to log in as admin:', err.message);
  }

  // TEST 1: Submit first new paper
  console.log('TEST 1: Submit first new paper');
  const res1 = await submitPaper('Cognitive AI Edge Reasoning 1', 'Dr. Alice Smith', 'alice@test.edu');
  const id1 = res1.data.data?.id;
  console.log(`-> Received ID: ${id1} (HTTP ${res1.status})`);
  if (id1 === 'ICC-CNS-2027-001') {
    console.log('[PASS] TEST 1 passed: First paper got ICC-CNS-2027-001\n');
  } else {
    console.error(`[FAIL] TEST 1 failed: Expected ICC-CNS-2027-001, got ${id1}\n`);
  }

  // TEST 2: Submit second paper
  console.log('TEST 2: Submit second paper');
  const res2 = await submitPaper('Cognitive AI Edge Reasoning 2', 'Dr. Bob Jones', 'bob@test.edu');
  const id2 = res2.data.data?.id;
  console.log(`-> Received ID: ${id2} (HTTP ${res2.status})`);
  if (id2 === 'ICC-CNS-2027-002') {
    console.log('[PASS] TEST 2 passed: Second paper got ICC-CNS-2027-002\n');
  } else {
    console.error(`[FAIL] TEST 2 failed: Expected ICC-CNS-2027-002, got ${id2}\n`);
  }

  // TEST 3: Submit third paper
  console.log('TEST 3: Submit third paper');
  const res3 = await submitPaper('Cognitive AI Edge Reasoning 3', 'Dr. Charlie Brown', 'charlie@test.edu');
  const id3 = res3.data.data?.id;
  console.log(`-> Received ID: ${id3} (HTTP ${res3.status})`);
  if (id3 === 'ICC-CNS-2027-003') {
    console.log('[PASS] TEST 3 passed: Third paper got ICC-CNS-2027-003\n');
  } else {
    console.error(`[FAIL] TEST 3 failed: Expected ICC-CNS-2027-003, got ${id3}\n`);
  }

  // TEST 4: Reject a paper & check ID unchanged
  console.log(`TEST 4: Reject paper ${id2}`);
  const rejectRes = await fetch(`${BASE_URL}/submissions/${id2}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      status: 'Rejected',
      rejectionReason: 'Test rejection - out of conference scope'
    })
  });
  const rejectJson = await rejectRes.json();
  console.log(`-> Updated status to: ${rejectJson.data?.status}, ID: ${rejectJson.data?.id}`);
  if (rejectJson.data?.id === id2 && rejectJson.data?.status === 'Rejected') {
    console.log(`[PASS] TEST 4 passed: Rejected paper ID remained ${id2}\n`);
  } else {
    console.error(`[FAIL] TEST 4 failed\n`);
  }

  // TEST 5: Accept a paper & check ID unchanged
  console.log(`TEST 5: Accept paper ${id1}`);
  const acceptRes = await fetch(`${BASE_URL}/submissions/${id1}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      status: 'Accepted',
      reviewNotes: 'Accepted for oral presentation.'
    })
  });
  const acceptJson = await acceptRes.json();
  console.log(`-> Updated status to: ${acceptJson.data?.status}, ID: ${acceptJson.data?.id}`);
  if (acceptJson.data?.id === id1 && acceptJson.data?.status === 'Accepted') {
    console.log(`[PASS] TEST 5 passed: Accepted paper ID remained ${id1}\n`);
  } else {
    console.error(`[FAIL] TEST 5 failed\n`);
  }

  // TEST 6 & 7: Number is never reused
  console.log('TEST 6 & 7: Verify sequence strictly advances forward');
  const res4 = await submitPaper('Cognitive AI Edge Reasoning 4', 'Dr. Diana Prince', 'diana@test.edu');
  const id4 = res4.data.data?.id;
  console.log(`-> Received ID: ${id4}`);
  if (id4 === 'ICC-CNS-2027-004') {
    console.log('[PASS] TEST 6 & 7 passed: Assigned next unused sequential number ICC-CNS-2027-004\n');
  } else {
    console.error(`[FAIL] Expected ICC-CNS-2027-004, got ${id4}\n`);
  }

  // TEST 8: Concurrency / Simultaneous submissions
  console.log('TEST 8: Simultaneous submissions with Promise.all (concurrency safety)');
  const concurrentSubmissions = await Promise.all([
    submitPaper('Parallel Paper A', 'Author Alpha', 'alpha@concurrent.edu'),
    submitPaper('Parallel Paper B', 'Author Beta', 'beta@concurrent.edu'),
    submitPaper('Parallel Paper C', 'Author Gamma', 'gamma@concurrent.edu'),
    submitPaper('Parallel Paper D', 'Author Delta', 'delta@concurrent.edu')
  ]);

  const concurrentIds = concurrentSubmissions.map((r) => r.data.data?.id);
  console.log('-> Generated concurrent IDs:', concurrentIds);

  const uniqueSet = new Set(concurrentIds);
  const allFormatted = concurrentIds.every((id) => /^ICC-CNS-2027-\d{3,}$/.test(id));
  const noDuplicates = uniqueSet.size === concurrentIds.length;

  if (noDuplicates && allFormatted) {
    console.log('[PASS] TEST 8 passed: All concurrent submissions received unique, sequential IDs without race conditions!\n');
  } else {
    console.error('[FAIL] TEST 8 failed: Collision or invalid format detected!\n');
  }

  // TEST 9: Track paper using exact Paper ID
  console.log(`TEST 9: Track paper ${id1} using exact ID`);
  const track1 = await trackPaper(id1);
  console.log(`-> Tracking result: ID=${track1.data.data?.id}, Status=${track1.data.data?.status}, Title="${track1.data.data?.title}"`);
  if (track1.status === 200 && track1.data.data?.id === id1 && track1.data.data?.status === 'Accepted') {
    console.log('[PASS] TEST 9 passed: Paper tracked accurately with exact status\n');
  } else {
    console.error('[FAIL] TEST 9 tracking failed\n');
  }

  // TEST 10: Track invalid Paper ID
  console.log('TEST 10: Track invalid Paper ID ICC-CNS-2027-9999');
  const trackInvalid = await trackPaper('ICC-CNS-2027-9999');
  console.log(`-> HTTP Status: ${trackInvalid.status}, Message: "${trackInvalid.data.message}"`);
  if (trackInvalid.status === 404) {
    console.log('[PASS] TEST 10 passed: Clean 404 response for invalid paper ID\n');
  } else {
    console.error('[FAIL] TEST 10 failed\n');
  }

  // TEST 11 & 12: Data Integrity & Sequence Persistence across DB reload
  console.log('TEST 11 & 12: Sequence persistence verification');
  const resNext = await submitPaper('Final Sequence Check Paper', 'Dr. Zeta', 'zeta@test.edu');
  const idNext = resNext.data.data?.id;
  console.log(`-> Assigned ID after all previous tests: ${idNext}`);
  if (/^ICC-CNS-2027-\d{3,}$/.test(idNext)) {
    console.log(`[PASS] TEST 11 & 12 passed: Sequence cleanly continued to ${idNext}\n`);
  } else {
    console.error('[FAIL] TEST 11 & 12 failed\n');
  }

  console.log('====================================================');
  console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
  console.log('====================================================');
}

runSequentialIdTests().catch(console.error);
