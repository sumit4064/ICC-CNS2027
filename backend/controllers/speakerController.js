import { Speaker } from '../models/index.js';
import { uploadObject, deleteObject } from '../services/b2StorageService.js';
import { serverCache } from '../utils/cache.js';

const CACHE_KEY_ALL = 'speakers:all';

export const getSpeakers = async (req, res) => {
  try {
    const cached = serverCache.get(CACHE_KEY_ALL);
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
      return res.json({ success: true, data: cached });
    }

    const speakers = await Speaker.find().lean();
    const data = speakers || [];
    serverCache.set(CACHE_KEY_ALL, data, 60);

    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in getSpeakers:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch speakers.' });
  }
};

export const getSpeakerById = async (req, res) => {
  try {
    const cacheKey = `speaker:${req.params.id}`;
    const cached = serverCache.get(cacheKey);
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
      return res.json({ success: true, data: cached });
    }

    const speaker = await Speaker.findOne({ id: req.params.id }).lean();
    if (!speaker) {
      return res.status(404).json({ success: false, message: 'Speaker not found.' });
    }

    serverCache.set(cacheKey, speaker, 60);
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
    res.json({ success: true, data: speaker });
  } catch (error) {
    console.error('Error in getSpeakerById:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch speaker.' });
  }
};

export const createSpeaker = async (req, res) => {
  try {
    const { name, designation, institution, country, track, topic, bio, image, imageStorageKey, type } = req.body;

    if (!name || !institution) {
      return res.status(400).json({ success: false, message: 'Speaker name and institution are required.' });
    }

    const newSpeaker = {
      id: `sp-${Date.now()}`,
      name,
      designation: designation || 'Keynote Speaker',
      institution,
      country: country || 'International',
      track: track || 'Cognitive Computing',
      topic: topic || 'Advances in Cognitive Networking',
      bio: bio || 'Distinguished academic and industry expert contributing key insights to ICC-CNS.',
      image: image || null,
      imageStorageKey: imageStorageKey || null,
      type: type || 'Keynote'
    };

    const created = await Speaker.create(newSpeaker);

    // Invalidate cache
    serverCache.delPrefix('speaker');
    serverCache.del('conference:details');

    res.status(201).json({ success: true, message: 'Speaker added successfully.', data: created });
  } catch (error) {
    console.error('Error in createSpeaker:', error.message);
    res.status(500).json({ success: false, message: 'Failed to add speaker.' });
  }
};

export const updateSpeaker = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Speaker.findOne({ id });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Speaker not found.' });
    }

    const updated = await Speaker.findOneAndUpdate(
      { id },
      { $set: { ...req.body, id } },
      { returnDocument: 'after', new: true }
    ).lean();

    // Invalidate cache
    serverCache.delPrefix('speaker');

    res.json({ success: true, message: 'Speaker updated successfully.', data: updated });
  } catch (error) {
    console.error('Error in updateSpeaker:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update speaker.' });
  }
};

export const uploadSpeakerImage = async (req, res) => {
  let uploadedStorageKey = null;

  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a JPG, PNG, or WEBP image under 5 MB.'
      });
    }

    const { id } = req.params;
    const speaker = await Speaker.findOne({ id });

    if (!speaker) {
      return res.status(404).json({ success: false, message: 'Speaker not found.' });
    }

    // Preserve previous B2 storage key for post-commit deletion
    const oldImageStorageKey = speaker.imageStorageKey;

    const safeName = (req.file.originalname || 'photo.webp').replace(/[^a-zA-Z0-9._-]/g, '_');
    const imageStorageKey = `speakers/${speaker.id}/${safeName}`;
    const imageUrl = imageStorageKey;

    // 1. Upload new image buffer directly to Backblaze B2 cloud storage
    try {
      await uploadObject({
        key: imageStorageKey,
        buffer: req.file.buffer,
        contentType: req.file.mimetype || 'image/jpeg',
        metadata: {
          speakerId: String(speaker.id),
          speakerName: speaker.name || ''
        }
      });
      uploadedStorageKey = imageStorageKey;
      console.log(`[Speaker] Successfully uploaded photograph to B2: ${imageStorageKey}`);
    } catch (uploadErr) {
      console.error(`[Speaker] B2 storage upload failed for speaker ${speaker.id}:`, uploadErr.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload speaker photograph to cloud storage.'
      });
    }

    // 2. Persist updated fields in MongoDB
    let updated;
    try {
      updated = await Speaker.findOneAndUpdate(
        { id },
        {
          $set: {
            image: imageUrl,
            imageStorageKey: imageStorageKey
          }
        },
        { returnDocument: 'after', new: true }
      ).lean();
    } catch (dbErr) {
      console.error(`[Speaker] MongoDB update failed for speaker ${speaker.id}:`, dbErr.message);

      // Rollback newly uploaded B2 object if database persistence failed
      if (uploadedStorageKey) {
        try {
          console.log(`[Speaker] Rolling back B2 object: ${uploadedStorageKey}`);
          await deleteObject({ key: uploadedStorageKey });
          console.log(`[Speaker] B2 rollback successful for: ${uploadedStorageKey}`);
        } catch (rollbackErr) {
          console.error(`[Speaker] Failed to rollback B2 object ${uploadedStorageKey}:`, rollbackErr.message);
        }
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error while updating speaker record.'
      });
    }

    // 3. Clean up replaced B2 object only AFTER successful MongoDB update
    if (oldImageStorageKey && oldImageStorageKey !== imageStorageKey) {
      try {
        console.log(`[Speaker] Cleaning up replaced B2 object: ${oldImageStorageKey}`);
        await deleteObject({ key: oldImageStorageKey });
      } catch (delOldErr) {
        console.warn(`[Speaker] Failed to delete replaced B2 object ${oldImageStorageKey}:`, delOldErr.message);
      }
    }

    serverCache.delPrefix('speaker');

    return res.json({
      success: true,
      message: 'Speaker photograph uploaded successfully.',
      imageUrl,
      imageStorageKey,
      data: updated
    });
  } catch (error) {
    console.error('Error in uploadSpeakerImage:', error.message);

    // Rollback if unexpected failure occurred after upload
    if (uploadedStorageKey) {
      try {
        await deleteObject({ key: uploadedStorageKey });
      } catch (e) {}
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload speaker photograph.'
    });
  }
};

export const deleteSpeakerImage = async (req, res) => {
  try {
    const { id } = req.params;
    const speaker = await Speaker.findOne({ id });

    if (!speaker) {
      return res.status(404).json({ success: false, message: 'Speaker not found.' });
    }

    const oldImageStorageKey = speaker.imageStorageKey;

    const updated = await Speaker.findOneAndUpdate(
      { id },
      { $set: { image: null, imageStorageKey: null } },
      { returnDocument: 'after', new: true }
    ).lean();

    // Clean up B2 object if speaker was backed by B2 storage
    if (oldImageStorageKey) {
      try {
        await deleteObject({ key: oldImageStorageKey });
        console.log(`[Speaker] Deleted B2 object: ${oldImageStorageKey}`);
      } catch (delErr) {
        console.warn(`[Speaker] Failed to delete B2 object ${oldImageStorageKey}:`, delErr.message);
      }
    }

    serverCache.delPrefix('speaker');

    return res.json({
      success: true,
      message: 'Speaker photograph removed successfully.',
      data: updated
    });
  } catch (error) {
    console.error('Error in deleteSpeakerImage:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete speaker image.'
    });
  }
};

export const deleteSpeaker = async (req, res) => {
  try {
    const { id } = req.params;
    const speakerToDelete = await Speaker.findOne({ id });

    if (!speakerToDelete) {
      return res.status(404).json({ success: false, message: 'Speaker not found.' });
    }

    const oldImageStorageKey = speakerToDelete.imageStorageKey;

    await Speaker.findOneAndDelete({ id });

    // Clean up B2 object if speaker had a B2 object
    if (oldImageStorageKey) {
      try {
        await deleteObject({ key: oldImageStorageKey });
        console.log(`[Speaker] Deleted B2 object on speaker deletion: ${oldImageStorageKey}`);
      } catch (delErr) {
        console.warn(`[Speaker] Failed to delete B2 object ${oldImageStorageKey}:`, delErr.message);
      }
    }

    serverCache.delPrefix('speaker');
    serverCache.del('conference:details');

    return res.json({ success: true, message: 'Speaker deleted successfully.' });
  } catch (error) {
    console.error('Error in deleteSpeaker:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete speaker.' });
  }
};


