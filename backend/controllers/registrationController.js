import { Registration } from '../models/index.js';

export const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ registeredAt: -1 }).lean();
    res.json({ success: true, data: registrations || [] });
  } catch (error) {
    console.error('Error in getRegistrations:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch registrations.' });
  }
};

export const createRegistration = async (req, res) => {
  try {
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
    const regId = `REG-2027-${randomSuffix}`;

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

    const created = await Registration.create(newReg);
    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully!',
      data: created
    });
  } catch (error) {
    console.error('Error in createRegistration:', error.message);
    res.status(500).json({ success: false, message: 'Failed to process registration.' });
  }
};

export const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const existing = await Registration.findOne({ id });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Registration record not found.' });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;

    const updated = await Registration.findOneAndUpdate(
      { id },
      { $set: updateFields },
      { new: true }
    ).lean();

    res.json({ success: true, message: 'Registration status updated.', data: updated });
  } catch (error) {
    console.error('Error in updateRegistrationStatus:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update registration status.' });
  }
};

