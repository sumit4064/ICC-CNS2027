import { getDb, saveDb } from '../config/db.js';

// Promise queue to serialize concurrent submission creations and prevent race conditions
let submissionQueue = Promise.resolve();

/**
 * Generate next sequential unique paper ID in format ICC-CNS-2027-001, ICC-CNS-2027-002, etc.
 * Thread-safe / mutex-protected through synchronous DB operations inside serialized queue.
 * Permanent sequence counter stored in db.counters.paperSequence so numbers are never reused.
 */
export const generateSequentialPaperId = (db) => {
  if (!db.counters) {
    db.counters = {};
  }

  // Find max sequence number recorded in counter or existing ICC-CNS-2027-XXX papers
  let currentSeq = typeof db.counters.paperSequence === 'number' ? db.counters.paperSequence : 0;

  if (Array.isArray(db.submissions)) {
    db.submissions.forEach((s) => {
      if (s && s.id) {
        const match = String(s.id).match(/^ICC-CNS-2027-(\d+)$/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > currentSeq) {
            currentSeq = num;
          }
        }
      }
    });
  }

  let nextSeq = currentSeq + 1;
  let candidateId = `ICC-CNS-2027-${String(nextSeq).padStart(3, '0')}`;

  // Ensure unique constraint across all existing papers
  const existingIds = new Set(
    (db.submissions || []).map((s) => (s.id ? String(s.id).toUpperCase() : ''))
  );

  while (existingIds.has(candidateId.toUpperCase())) {
    nextSeq++;
    candidateId = `ICC-CNS-2027-${String(nextSeq).padStart(3, '0')}`;
  }

  db.counters.paperSequence = nextSeq;
  return candidateId;
};

export const getSubmissions = (req, res) => {
  const db = getDb();
  res.json({ success: true, data: db.submissions || [] });
};

export const getSubmissionById = (req, res) => {
  const db = getDb();
  const { query } = req.params; // Can be paper ID or author email
  const cleanQuery = (query || '').trim().toLowerCase();
  
  const match = (db.submissions || []).find(
    (s) =>
      (s.id && s.id.toLowerCase() === cleanQuery) ||
      (s.primaryAuthorEmail && s.primaryAuthorEmail.toLowerCase() === cleanQuery)
  );

  if (!match) {
    return res.status(404).json({ success: false, message: 'No manuscript found for the provided ID or email.' });
  }

  res.json({ success: true, data: match });
};

export const createSubmission = (req, res) => {
  const { title, track, authors, primaryAuthorEmail, institution, country, phone, abstract, keywords } = req.body;

  if (!title || !authors || !primaryAuthorEmail || !institution || !abstract) {
    return res.status(400).json({
      success: false,
      message: 'All fields (Paper Title, Authors, Email, Institution, Abstract) are required.'
    });
  }

  let fileName = 'manuscript.pdf';
  let filePath = '/uploads/papers/sample_paper.pdf';

  if (req.file) {
    fileName = req.file.originalname;
    filePath = `/uploads/papers/${req.file.filename}`;
  }

  // Queue to handle concurrent incoming requests sequentially
  submissionQueue = submissionQueue
    .then(async () => {
      try {
        const db = getDb();
        const paperId = generateSequentialPaperId(db);

        if (!paperId) {
          return res.status(500).json({
            success: false,
            message: 'Failed to generate a valid sequential Paper ID.'
          });
        }

        const newSubmission = {
          id: paperId,
          title,
          track: track || 'Cognitive Computing & AI',
          authors,
          primaryAuthorEmail,
          phone: phone || '',
          institution,
          country: country || 'India',
          abstract,
          keywords: keywords || 'AI, Networking, Cognitive Systems',
          fileName,
          filePath,
          status: 'Under Review',
          isLocked: true,
          submittedAt: new Date().toISOString(),
          history: [
            {
              action: 'Submitted',
              timestamp: new Date().toISOString(),
              user: primaryAuthorEmail,
              notes: 'Initial double-blind manuscript submission.'
            }
          ]
        };

        db.submissions = db.submissions || [];
        db.submissions.unshift(newSubmission);

        if (saveDb(db)) {
          return res.status(201).json({
            success: true,
            message: 'Paper submitted successfully! Keep your Paper ID safe for status tracking.',
            data: newSubmission
          });
        } else {
          return res.status(500).json({ success: false, message: 'Failed to record paper submission to database.' });
        }
      } catch (err) {
        console.error('Error during paper submission creation:', err);
        return res.status(500).json({ success: false, message: 'Internal server error while processing manuscript submission.' });
      }
    })
    .catch((err) => {
      console.error('Submission queue critical error:', err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Server error processing submission request.' });
      }
    });
};

export const updateSubmissionStatus = (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { status, reviewNotes, rejectionReason } = req.body;

  const index = (db.submissions || []).findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Submission not found.' });
  }

  const currentPaper = db.submissions[index];

  // ENFORCE BACKEND LOCK: If current status is Accepted or Rejected, it can NEVER be changed!
  if (currentPaper.status === 'Accepted' || currentPaper.status === 'Rejected') {
    return res.status(400).json({
      success: false,
      isLocked: true,
      currentStatus: currentPaper.status,
      message: `This manuscript already has a final decision (${currentPaper.status}) and cannot be modified.`
    });
  }

  if (status) {
    // Validate valid target status
    if (!['Under Review', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid manuscript status. Allowed statuses are: Under Review, Accepted, Rejected.'
      });
    }

    currentPaper.status = status;

    // If decision is final (Accepted or Rejected), stamp audit information & lock permanently
    if (status === 'Accepted' || status === 'Rejected') {
      currentPaper.isLocked = true;
      currentPaper.decisionDate = new Date().toISOString();
      currentPaper.decidedBy = req.user?.name || req.user?.email || 'Conference Administrator';
      currentPaper.decidedById = req.user?.id || 'usr-admin';
    }
  }

  if (reviewNotes !== undefined) {
    currentPaper.reviewNotes = reviewNotes;
  }

  if (rejectionReason !== undefined) {
    currentPaper.rejectionReason = rejectionReason;
  }

  // Record in audit history
  currentPaper.history = currentPaper.history || [];
  currentPaper.history.push({
    action: status || 'Status Updated',
    timestamp: new Date().toISOString(),
    user: req.user?.email || 'hodcse@vignan.ac.in',
    notes: reviewNotes || rejectionReason || ''
  });

  db.submissions[index] = currentPaper;

  if (saveDb(db)) {
    res.json({
      success: true,
      message: status === 'Accepted'
        ? 'Manuscript accepted successfully. The decision is now permanently locked.'
        : status === 'Rejected'
        ? 'Manuscript rejected. The decision is now permanently locked.'
        : 'Paper status updated.',
      data: db.submissions[index]
    });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update submission status.' });
  }
};

