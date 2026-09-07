import { Committee } from '../models/index.js';
import { uploadObject, deleteObject } from '../services/b2StorageService.js';
import { serverCache } from '../utils/cache.js';

// GET /api/committee (Public & Admin)
export const getCommittee = async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true' || req.query.all === 'true';
    const cacheKey = includeInactive ? 'committee:all' : 'committee:active';

    const cached = serverCache.get(cacheKey);
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
      return res.json({
        success: true,
        count: cached.length,
        data: cached
      });
    }

    const filter = includeInactive ? {} : { isActive: { $ne: false } };

    const members = await Committee.find(filter)
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    const data = members || [];
    serverCache.set(cacheKey, data, 60);

    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error('Error in getCommittee:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch committee members.' });
  }
};

// GET /api/committee/:id
export const getCommitteeMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `committee:member:${id}`;

    const cached = serverCache.get(cacheKey);
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
      return res.json({ success: true, data: cached });
    }

    const member = await Committee.findOne({ $or: [{ id }, { _id: id }] }).lean();

    if (!member) {
      return res.status(404).json({ success: false, message: 'Committee member not found.' });
    }

    serverCache.set(cacheKey, member, 60);
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
    res.json({ success: true, data: member });
  } catch (error) {
    console.error('Error in getCommitteeMemberById:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch member details.' });
  }
};

// POST /api/committee (Admin)
export const createCommitteeMember = async (req, res) => {
  try {
    const count = await Committee.countDocuments();
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
      imageStorageKey: req.body.imageStorageKey || null,
      displayOrder: req.body.displayOrder ? Number(req.body.displayOrder) : count + 1,
      isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true
    };

    const created = await Committee.create(newMember);

    serverCache.delPrefix('committee');

    res.status(201).json({
      success: true,
      message: 'Committee member created successfully.',
      data: created
    });
  } catch (error) {
    console.error('Error in createCommitteeMember:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Failed to create member.' });
  }
};

// PUT /api/committee/:id (Admin)
export const updateCommitteeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Committee.findOne({ $or: [{ id }, { _id: id }] });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Committee member not found.' });
    }

    const updateData = {
      ...req.body,
      id: existing.id,
      _id: existing._id || existing.id,
      displayOrder: req.body.displayOrder !== undefined ? Number(req.body.displayOrder) : existing.displayOrder,
      isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : existing.isActive
    };

    const updated = await Committee.findOneAndUpdate(
      { $or: [{ id }, { _id: id }] },
      { $set: updateData },
      { returnDocument: 'after', new: true }
    ).lean();

    serverCache.delPrefix('committee');

    res.json({
      success: true,
      message: 'Committee member updated successfully.',
      data: updated
    });
  } catch (error) {
    console.error('Error in updateCommitteeMember:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Failed to update member.' });
  }
};

// DELETE /api/committee/:id (Admin)
export const deleteCommitteeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Committee.findOne({ $or: [{ id }, { _id: id }] });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Committee member not found.' });
    }

    const oldImageStorageKey = member.imageStorageKey;

    await Committee.findOneAndDelete({ $or: [{ id }, { _id: id }] });

    // Clean up B2 object if member was backed by B2 storage
    if (oldImageStorageKey) {
      try {
        await deleteObject({ key: oldImageStorageKey });
        console.log(`[Committee] Deleted B2 object on member deletion: ${oldImageStorageKey}`);
      } catch (delErr) {
        console.warn(`[Committee] Failed to delete B2 object ${oldImageStorageKey}:`, delErr.message);
      }
    }

    serverCache.delPrefix('committee');

    res.json({
      success: true,
      message: 'Committee member deleted successfully.',
      data: member
    });
  } catch (error) {
    console.error('Error in deleteCommitteeMember:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete member.' });
  }
};

// POST /api/committee/:id/image (Admin)
export const uploadMemberImage = async (req, res) => {
  let uploadedStorageKey = null;

  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const { id } = req.params;
    const member = await Committee.findOne({ $or: [{ id }, { _id: id }] });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Committee member not found.' });
    }

    const memberId = member.id || member._id;
    const oldImageStorageKey = member.imageStorageKey;

    const safeName = (req.file.originalname || 'member_photo.webp').replace(/[^a-zA-Z0-9._-]/g, '_');
    const imageStorageKey = `committee/${memberId}/${safeName}`;
    const imageUrl = imageStorageKey;

    // 1. Upload new image buffer directly to Backblaze B2
    try {
      await uploadObject({
        key: imageStorageKey,
        buffer: req.file.buffer,
        contentType: req.file.mimetype || 'image/jpeg',
        metadata: {
          memberId: String(memberId),
          memberName: member.name || ''
        }
      });
      uploadedStorageKey = imageStorageKey;
      console.log(`[Committee] Successfully uploaded photograph to B2: ${imageStorageKey}`);
    } catch (uploadErr) {
      console.error(`[Committee] B2 upload failed for member ${memberId}:`, uploadErr.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload committee member photograph to cloud storage.'
      });
    }

    // 2. Persist updated fields in MongoDB
    let updated;
    try {
      updated = await Committee.findOneAndUpdate(
        { $or: [{ id }, { _id: id }] },
        {
          $set: {
            imageUrl,
            imagePublicId: safeName,
            imageStorageKey
          }
        },
        { returnDocument: 'after', new: true }
      ).lean();
    } catch (dbErr) {
      console.error(`[Committee] MongoDB update failed for member ${memberId}:`, dbErr.message);

      // Rollback newly uploaded B2 object if database persistence failed
      if (uploadedStorageKey) {
        try {
          console.log(`[Committee] Rolling back B2 object: ${uploadedStorageKey}`);
          await deleteObject({ key: uploadedStorageKey });
          console.log(`[Committee] B2 rollback successful for: ${uploadedStorageKey}`);
        } catch (rollbackErr) {
          console.error(`[Committee] Failed to rollback B2 object ${uploadedStorageKey}:`, rollbackErr.message);
        }
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error while updating committee member record.'
      });
    }

    // 3. Clean up replaced B2 object only AFTER successful MongoDB update
    if (oldImageStorageKey && oldImageStorageKey !== imageStorageKey) {
      try {
        console.log(`[Committee] Cleaning up replaced B2 object: ${oldImageStorageKey}`);
        await deleteObject({ key: oldImageStorageKey });
      } catch (delOldErr) {
        console.warn(`[Committee] Failed to delete replaced B2 object ${oldImageStorageKey}:`, delOldErr.message);
      }
    }

    serverCache.delPrefix('committee');

    res.json({
      success: true,
      message: 'Photograph uploaded successfully.',
      imageUrl,
      imageStorageKey,
      data: updated
    });
  } catch (error) {
    console.error('Error in uploadMemberImage:', error.message);

    if (uploadedStorageKey) {
      try {
        await deleteObject({ key: uploadedStorageKey });
      } catch (e) {}
    }

    res.status(500).json({ success: false, message: error.message || 'Failed to upload photo.' });
  }
};

// DELETE /api/committee/:id/image (Admin)
export const deleteMemberImage = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Committee.findOne({ $or: [{ id }, { _id: id }] });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Committee member not found.' });
    }

    const oldImageStorageKey = member.imageStorageKey;

    const updated = await Committee.findOneAndUpdate(
      { $or: [{ id }, { _id: id }] },
      {
        $set: {
          imageUrl: null,
          imagePublicId: null,
          imageStorageKey: null
        }
      },
      { returnDocument: 'after', new: true }
    ).lean();

    // Clean up B2 object if member had a B2-backed photo
    if (oldImageStorageKey) {
      try {
        await deleteObject({ key: oldImageStorageKey });
        console.log(`[Committee] Deleted B2 object: ${oldImageStorageKey}`);
      } catch (delErr) {
        console.warn(`[Committee] Failed to delete B2 object ${oldImageStorageKey}:`, delErr.message);
      }
    }

    serverCache.delPrefix('committee');

    res.json({
      success: true,
      message: 'Member photograph removed successfully.',
      data: updated
    });
  } catch (error) {
    console.error('Error in deleteMemberImage:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Failed to remove photo.' });
  }
};

// PUT /api/committee (Bulk Update / Sync)
export const updateCommittee = async (req, res) => {
  try {
    const incoming = Array.isArray(req.body.committee)
      ? req.body.committee
      : Array.isArray(req.body)
      ? req.body
      : null;

    if (!incoming) {
      return res.status(400).json({ success: false, message: 'Committee payload must be an array of members.' });
    }

    // Safe bulk upsert without destructive drop
    const bulkOps = incoming.map((m, idx) => {
      const memberId = m.id || m._id || `cm-${idx + 1}`;
      return {
        updateOne: {
          filter: { $or: [{ id: memberId }, { _id: memberId }] },
          update: {
            $set: {
              id: memberId,
              _id: memberId,
              name: m.name || 'Untitled Member',
              role: m.role || '',
              institution: m.institution || m.org || "Vignan's Group",
              org: m.institution || m.org || "Vignan's Group",
              designation: m.designation || m.role || '',
              department: m.department || '',
              category: m.category || 'Organizing Committee',
              country: m.country || 'India',
              bio: m.bio || '',
              email: m.email || '',
              imageUrl: m.imageUrl || m.image || null,
              imagePublicId: m.imagePublicId || null,
              imageStorageKey: m.imageStorageKey || null,
              displayOrder: typeof m.displayOrder === 'number' ? m.displayOrder : idx + 1,
              isActive: m.isActive !== undefined ? Boolean(m.isActive) : true
            }
          },
          upsert: true
        }
      };
    });

    if (bulkOps.length > 0) {
      await Committee.bulkWrite(bulkOps);
    }

    serverCache.delPrefix('committee');

    const allMembers = await Committee.find().sort({ displayOrder: 1, name: 1 }).lean();
    res.json({ success: true, message: 'Committee list updated successfully.', data: allMembers });
  } catch (error) {
    console.error('Error in updateCommittee:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Failed to update committee.' });
  }
};


