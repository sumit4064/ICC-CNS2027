import { Submission, Counter } from '../models/index.js';
import { uploadObject, deleteObject, getPresignedDownloadUrl } from '../services/b2StorageService.js';

/**
 * Generate next sequential unique paper ID in format ICC-CNS-2027-001, ICC-CNS-2027-002, etc.
 * Uses atomic MongoDB Counter model with _id: 'paperSequence'.
 */
export const generateSequentialPaperId = async () => {
  const counterDoc = await Counter.findOneAndUpdate(
    { _id: 'paperSequence' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `ICC-CNS-2027-${String(counterDoc.seq).padStart(3, '0')}`;
};

export const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submittedAt: -1 }).lean();
    return res.json({ success: true, data: submissions || [] });
  } catch (error) {
    console.error('Error in getSubmissions:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch submissions.' });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const { query } = req.params; // Can be paper ID or author email
    const cleanQuery = (query || '').trim();

    if (!cleanQuery) {
      return res.status(400).json({ success: false, message: 'Submission ID or email is required.' });
    }

    const escapedQuery = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const match = await Submission.findOne({
      $or: [
        { id: { $regex: new RegExp(`^${escapedQuery}$`, 'i') } },
        { primaryAuthorEmail: { $regex: new RegExp(`^${escapedQuery}$`, 'i') } }
      ]
    }).lean();

    if (!match) {
      return res.status(404).json({ success: false, message: 'No manuscript found for the provided ID or email.' });
    }

    return res.json({ success: true, data: match });
  } catch (error) {
    console.error('Error in getSubmissionById:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve manuscript.' });
  }
};

/**
 * GET /api/submissions/:id/download (Admin Only)
 * Securely generates a short-lived presigned GET URL (5 minutes) for B2-backed manuscripts.
 * For legacy records without fileStorageKey, returns the local filePath fallback.
 */
export const getSubmissionDownloadUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = (id || '').trim();

    if (!cleanId) {
      return res.status(400).json({ success: false, message: 'Submission ID is required.' });
    }

    const escapedId = cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const submission = await Submission.findOne({
      $or: [
        { id: { $regex: new RegExp(`^${escapedId}$`, 'i') } },
        ...(cleanId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: cleanId }] : [])
      ]
    }).lean();

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission record not found.' });
    }

    // 1. Backblaze B2-backed manuscript
    if (submission.fileStorageKey) {
      const downloadUrl = await getPresignedDownloadUrl({
        key: submission.fileStorageKey,
        expiresIn: 300 // 5 minutes validity
      });

      return res.json({
        success: true,
        downloadUrl,
        expiresIn: 300,
        fileName: submission.fileName || 'manuscript.pdf',
        fileStorageKey: submission.fileStorageKey,
        isCloudStorage: true
      });
    }

    // 2. Legacy local file fallback (backward compatibility)
    if (submission.filePath) {
      return res.json({
        success: true,
        downloadUrl: submission.filePath,
        fileName: submission.fileName || 'manuscript.pdf',
        isCloudStorage: false
      });
    }

    return res.status(404).json({
      success: false,
      message: 'No file attachment associated with this submission.'
    });
  } catch (error) {
    console.error('Error generating submission download URL:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate secure download URL.'
    });
  }
};


export const createSubmission = async (req, res) => {
  let uploadedStorageKey = null;

  try {
    const { title, track, authors, primaryAuthorEmail, institution, country, phone, abstract, keywords } = req.body;

    if (!title || !authors || !primaryAuthorEmail || !institution || !abstract) {
      return res.status(400).json({
        success: false,
        message: 'All fields (Paper Title, Authors, Email, Institution, Abstract) are required.'
      });
    }

    // Atomically allocate the next sequential Paper ID from MongoDB Counter
    const counterDoc = await Counter.findOneAndUpdate(
      { _id: 'paperSequence' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (!counterDoc || typeof counterDoc.seq !== 'number') {
      return res.status(500).json({
        success: false,
        message: 'Failed to allocate a valid sequential Paper ID.'
      });
    }

    const paperId = `ICC-CNS-2027-${String(counterDoc.seq).padStart(3, '0')}`;

    let fileName = 'manuscript.pdf';
    let filePath = '/uploads/papers/sample_paper.pdf';
    let fileStorageKey = null;

    if (req.file) {
      fileName = req.file.originalname;
      const safeName = (req.file.originalname || 'manuscript.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
      fileStorageKey = `papers/${paperId}/${safeName}`;
      filePath = fileStorageKey;

      // Upload buffer directly to Backblaze B2 cloud storage
      try {
        await uploadObject({
          key: fileStorageKey,
          buffer: req.file.buffer,
          contentType: req.file.mimetype || 'application/pdf',
          metadata: {
            paperId,
            primaryAuthorEmail: primaryAuthorEmail.trim().toLowerCase()
          }
        });
        uploadedStorageKey = fileStorageKey;
        console.log(`[Submission] Successfully uploaded manuscript to B2: ${fileStorageKey}`);
      } catch (uploadErr) {
        console.error(`[Submission] B2 storage upload failed for paper ${paperId}:`, uploadErr.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to store manuscript file in cloud storage. Please try again.'
        });
      }
    }

    const newSubmissionData = {
      id: paperId,
      title: title.trim(),
      track: track || 'Cognitive Computing & AI',
      authors: authors.trim(),
      primaryAuthorEmail: primaryAuthorEmail.trim().toLowerCase(),
      phone: phone || '',
      institution: institution.trim(),
      country: country || 'India',
      abstract: abstract.trim(),
      keywords: keywords || 'AI, Networking, Cognitive Systems',
      fileName,
      filePath,
      fileStorageKey,
      status: 'Under Review',
      isLocked: true,
      submittedAt: new Date().toISOString(),
      history: [
        {
          action: 'Submitted',
          timestamp: new Date().toISOString(),
          user: primaryAuthorEmail.trim().toLowerCase(),
          notes: 'Initial double-blind manuscript submission.'
        }
      ]
    };

    let newSubmission;
    try {
      newSubmission = await Submission.create(newSubmissionData);
      console.log(`[Submission] Recorded submission metadata in MongoDB for paper ${paperId}`);
    } catch (dbErr) {
      console.error(`[Submission] MongoDB save failed for paper ${paperId}:`, dbErr.message);

      // Rollback newly uploaded B2 object if database persistence failed
      if (uploadedStorageKey) {
        try {
          console.log(`[Submission] Rolling back B2 object: ${uploadedStorageKey}`);
          await deleteObject({ key: uploadedStorageKey });
          console.log(`[Submission] B2 rollback successful for: ${uploadedStorageKey}`);
        } catch (rollbackErr) {
          console.error(`[Submission] Failed to rollback B2 object ${uploadedStorageKey}:`, rollbackErr.message);
        }
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error while recording manuscript submission.'
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Paper submitted successfully! Keep your Paper ID safe for status tracking.',
      data: newSubmission
    });
  } catch (err) {
    console.error('Error during paper submission creation:', err.message);

    // Rollback if B2 upload occurred before unexpected error
    if (uploadedStorageKey) {
      try {
        await deleteObject({ key: uploadedStorageKey });
      } catch (rollbackErr) {}
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error while processing manuscript submission.'
    });
  }
};

export const updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes, rejectionReason } = req.body;

    const currentPaper = await Submission.findOne({
      $or: [
        { id },
        ...(id && id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
      ]
    });

    if (!currentPaper) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

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
    if (!Array.isArray(currentPaper.history)) {
      currentPaper.history = [];
    }
    currentPaper.history.push({
      action: status || 'Status Updated',
      timestamp: new Date().toISOString(),
      user: req.user?.email || 'hodcse@vignan.ac.in',
      notes: reviewNotes || rejectionReason || ''
    });

    await currentPaper.save();

    return res.json({
      success: true,
      message: status === 'Accepted'
        ? 'Manuscript accepted successfully. The decision is now permanently locked.'
        : status === 'Rejected'
        ? 'Manuscript rejected. The decision is now permanently locked.'
        : 'Paper status updated.',
      data: currentPaper
    });
  } catch (error) {
    console.error('Error updating submission status:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update submission status.' });
  }
};


