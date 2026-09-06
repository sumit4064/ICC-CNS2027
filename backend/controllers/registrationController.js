import { getDb, saveDb } from '../config/db.js';

export const getRegistrations = (req, res) => {
  const db = getDb();
  res.json({ success: true, data: db.registrations || [] });
};

export const createRegistration = (req, res) => {
  const db = getDb();
  const {
    fullName,
    email,
    phone,
    country,
    institution,
    participantType,
    mode,
    paperId,
    paperTitle,
    accompanyingPersons,
    dietaryRequirement,
    notes
  } = req.body;

  if (!fullName || !email || !country || !institution || !participantType) {
    return res.status(400).json({
      success: false,
      message: 'Please complete all required fields (Full Name, Email, Country, Institution, Participant Type).'
    });
  }

  // Generate unique registration ID
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const regId = `REG-2026-${randomSuffix}`;

  // Calculate pricing tier
  let estimatedAmount = 'INR 5,000';
  if (country.toLowerCase() !== 'india') {
    estimatedAmount = participantType.includes('Student') ? 'USD 150' : 'USD 250';
  } else {
    if (participantType.includes('Student')) estimatedAmount = 'INR 4,000';
    else if (participantType.includes('Faculty') || participantType.includes('Scholar')) estimatedAmount = 'INR 6,500';
    else if (participantType.includes('Industry')) estimatedAmount = 'INR 9,000';
    else estimatedAmount = 'INR 3,000';
  }

  const newReg = {
    id: regId,
    fullName,
    email,
    phone: phone || 'N/A',
    country,
    institution,
    participantType,
    mode: mode || 'Offline (In-person)',
    paperId: paperId || 'N/A (Attendee Only)',
    paperTitle: paperTitle || '',
    accompanyingPersons: accompanyingPersons || 0,
    dietaryRequirement: dietaryRequirement || 'Standard',
    notes: notes || '',
    amountPaid: estimatedAmount,
    status: 'Confirmed',
    registeredAt: new Date().toISOString()
  };

  db.registrations = db.registrations || [];
  db.registrations.unshift(newReg);

  if (saveDb(db)) {
    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully!',
      data: newReg
    });
  } else {
    res.status(500).json({ success: false, message: 'Failed to process registration.' });
  }
};

export const updateRegistrationStatus = (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { status, notes } = req.body;

  const index = (db.registrations || []).findIndex((r) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Registration record not found.' });
  }

  if (status) db.registrations[index].status = status;
  if (notes !== undefined) db.registrations[index].notes = notes;

  if (saveDb(db)) {
    res.json({ success: true, message: 'Registration status updated.', data: db.registrations[index] });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update registration status.' });
  }
};
