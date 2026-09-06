import { getDb, saveDb } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to normalize committee data from legacy nested groups or flat array
export const getNormalizedCommittee = (db) => {
  if (!db.committee) return [];

  // Check if already flat list of member objects
  if (Array.isArray(db.committee) && db.committee.length > 0 && db.committee[0].name) {
    return db.committee.map((m, idx) => ({
      id: m.id || m._id || `cm-${idx + 1}`,
      _id: m._id || m.id || `cm-${idx + 1}`,
      name: m.name || '',
      role: m.role || '',
      institution: m.institution || m.org || '',
      org: m.org || m.institution || '',
      designation: m.designation || m.role || '',
      department: m.department || '',
      category: m.category || 'Organizing Committee',
      country: m.country || 'India',
      bio: m.bio || '',
      email: m.email || '',
      imageUrl: m.imageUrl || m.image || null,
      imagePublicId: m.imagePublicId || null,
      displayOrder: typeof m.displayOrder === 'number' ? m.displayOrder : idx + 1,
      isActive: m.isActive !== undefined ? m.isActive : true
    }));
  }

  // If stored in legacy grouped format: [ { category: "...", members: [ ... ] } ]
  const flattened = [];
  let counter = 1;

  if (Array.isArray(db.committee)) {
    db.committee.forEach((group, gIdx) => {
      const categoryName = group.category || 'Organizing Committee';
      if (Array.isArray(group.members)) {
        group.members.forEach((mem, mIdx) => {
          flattened.push({
            id: `cm-${counter}`,
            _id: `cm-${counter}`,
            name: mem.name || '',
            role: mem.role || '',
            institution: mem.org || mem.institution || '',
            org: mem.org || mem.institution || '',
            designation: mem.designation || mem.role || '',
            department: mem.department || '',
            category: categoryName,
            country: mem.country || 'India',
            bio: mem.bio || '',
            email: mem.email || '',
            imageUrl: mem.imageUrl || mem.image || null,
            imagePublicId: mem.imagePublicId || null,
            displayOrder: counter,
            isActive: mem.isActive !== undefined ? mem.isActive : true
          });
          counter++;
        });
      }
    });
  }

  return flattened;
};

// GET /api/committee (Public & Admin)
export const getCommittee = (req, res) => {
  try {
    const db = getDb();
    const members = getNormalizedCommittee(db);

    // If query includes all=true or admin context, return all; else default to active
    const includeInactive = req.query.includeInactive === 'true' || req.query.all === 'true';
    const result = includeInactive ? members : members.filter(m => m.isActive !== false);

    // Sort by displayOrder ascending, then name
    result.sort((a, b) => {
      const orderA = typeof a.displayOrder === 'number' ? a.displayOrder : 9999;
      const orderB = typeof b.displayOrder === 'number' ? b.displayOrder : 9999;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });

    res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    console.error('Error in getCommittee:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch committee members.' });
  }
};

// GET /api/committee/:id
export const getCommitteeMemberById = (req, res) => {
  try {
    const db = getDb();
    const members = getNormalizedCommittee(db);
    const member = members.find(m => m.id === req.params.id || m._id === req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Committee member not found.' });
    }

    res.json({ success: true, data: member });
  } catch (error) {
    console.error('Error in getCommitteeMemberById:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch member details.' });
  }
};

// POST /api/committee (Admin)
export const createCommitteeMember = (req, res) => {
  try {
    const db = getDb();
    const members = getNormalizedCommittee(db);

    const newId = `cm-${Date.now()}`;
    const newMember = {
      id: newId,
      _id: newId,
      name: req.body.name || 'Untitled Member',
      role: req.body.role || '',
      institution: req.body.institution || req.body.org || "Vignan's University",
      org: req.body.institution || req.body.org || "Vignan's University",
      designation: req.body.designation || req.body.role || '',
      department: req.body.department || '',
      category: req.body.category || 'Organizing Committee',
      country: req.body.country || 'India',
      bio: req.body.bio || '',
      email: req.body.email || '',
      imageUrl: req.body.imageUrl || null,
      imagePublicId: req.body.imagePublicId || null,
      displayOrder: req.body.displayOrder ? Number(req.body.displayOrder) : members.length + 1,
      isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true
    };

    members.push(newMember);
    db.committee = members;

    if (saveDb(db)) {
      res.status(201).json({
        success: true,
        message: 'Committee member created successfully.',
        data: newMember
      });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save new committee member.' });
    }
  } catch (error) {
    console.error('Error in createCommitteeMember:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create member.' });
  }
};

// PUT /api/committee/:id (Admin)
export const updateCommitteeMember = (req, res) => {
  try {
    const db = getDb();
    const members = getNormalizedCommittee(db);
    const index = members.findIndex(m => m.id === req.params.id || m._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Committee member not found.' });
    }

    const updated = {
      ...members[index],
      ...req.body,
      id: members[index].id,
      _id: members[index]._id,
      displayOrder: req.body.displayOrder !== undefined ? Number(req.body.displayOrder) : members[index].displayOrder,
      isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : members[index].isActive
    };

    members[index] = updated;
    db.committee = members;

    if (saveDb(db)) {
      res.json({
        success: true,
        message: 'Committee member updated successfully.',
        data: updated
      });
    } else {
      res.status(500).json({ success: false, message: 'Failed to update member.' });
    }
  } catch (error) {
    console.error('Error in updateCommitteeMember:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update member.' });
  }
};

// DELETE /api/committee/:id (Admin)
export const deleteCommitteeMember = (req, res) => {
  try {
    const db = getDb();
    const members = getNormalizedCommittee(db);
    const index = members.findIndex(m => m.id === req.params.id || m._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Committee member not found.' });
    }

    const deleted = members[index];

    // Clean up uploaded image file if present in uploads/committee/
    if (deleted.imageUrl && deleted.imageUrl.startsWith('/uploads/committee/')) {
      const filePath = path.join(__dirname, '..', deleted.imageUrl);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.warn('Could not delete image file:', err.message);
      }
    }

    members.splice(index, 1);
    db.committee = members;

    if (saveDb(db)) {
      res.json({
        success: true,
        message: 'Committee member deleted successfully.',
        data: deleted
      });
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete member.' });
    }
  } catch (error) {
    console.error('Error in deleteCommitteeMember:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete member.' });
  }
};

// POST /api/committee/:id/image (Admin)
export const uploadMemberImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const db = getDb();
    const members = getNormalizedCommittee(db);
    const index = members.findIndex(m => m.id === req.params.id || m._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Committee member not found.' });
    }

    const oldImage = members[index].imageUrl;
    // Clean up previous image if it was local in uploads/committee/
    if (oldImage && oldImage.startsWith('/uploads/committee/')) {
      const oldFilePath = path.join(__dirname, '..', oldImage);
      try {
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (err) {
        console.warn('Could not delete old image file:', err.message);
      }
    }

    const imageUrl = `/uploads/committee/${req.file.filename}`;
    members[index].imageUrl = imageUrl;
    members[index].imagePublicId = req.file.filename;
    db.committee = members;

    if (saveDb(db)) {
      res.json({
        success: true,
        message: 'Photograph uploaded successfully.',
        imageUrl,
        data: members[index]
      });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save uploaded photograph reference.' });
    }
  } catch (error) {
    console.error('Error in uploadMemberImage:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to upload photo.' });
  }
};

// DELETE /api/committee/:id/image (Admin)
export const deleteMemberImage = (req, res) => {
  try {
    const db = getDb();
    const members = getNormalizedCommittee(db);
    const index = members.findIndex(m => m.id === req.params.id || m._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Committee member not found.' });
    }

    const currentImage = members[index].imageUrl;
    if (currentImage && currentImage.startsWith('/uploads/committee/')) {
      const filePath = path.join(__dirname, '..', currentImage);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.warn('Could not delete image file:', err.message);
      }
    }

    members[index].imageUrl = null;
    members[index].imagePublicId = null;
    db.committee = members;

    if (saveDb(db)) {
      res.json({
        success: true,
        message: 'Member photograph removed successfully.',
        data: members[index]
      });
    } else {
      res.status(500).json({ success: false, message: 'Failed to update member photo reference.' });
    }
  } catch (error) {
    console.error('Error in deleteMemberImage:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to remove photo.' });
  }
};

// PUT /api/committee (Bulk Update / Legacy update)
export const updateCommittee = (req, res) => {
  try {
    const db = getDb();
    if (Array.isArray(req.body.committee)) {
      db.committee = req.body.committee;
    } else if (Array.isArray(req.body)) {
      db.committee = req.body;
    }

    if (saveDb(db)) {
      res.json({ success: true, message: 'Committee list updated successfully.', data: db.committee });
    } else {
      res.status(500).json({ success: false, message: 'Failed to update committee.' });
    }
  } catch (error) {
    console.error('Error in updateCommittee:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update committee.' });
  }
};

