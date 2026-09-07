import { Conference, Speaker, Registration, Submission } from '../models/index.js';
import { serverCache } from '../utils/cache.js';

const CACHE_KEY = 'conference:details';

export const getConference = async (req, res) => {
  try {
    const cached = serverCache.get(CACHE_KEY);
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
      return res.json({ success: true, data: cached });
    }

    const confDoc = await Conference.findOne().lean();
    const conf = confDoc || {};

    const [speakerCount, regCount, paperCount] = await Promise.all([
      Speaker.countDocuments(),
      Registration.countDocuments(),
      Submission.countDocuments()
    ]);

    const data = {
      ...conf,
      dynamicStats: {
        speakers: `${speakerCount}+`,
        countries: '6+',
        registered: `${regCount}+`,
        papersSubmitted: `${paperCount}+`
      }
    };

    serverCache.set(CACHE_KEY, data, 60); // 60s TTL
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in getConference:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch conference details.' });
  }
};

export const updateConference = async (req, res) => {
  try {
    const updated = await Conference.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true }
    ).lean();

    serverCache.del(CACHE_KEY);

    res.json({ success: true, message: 'Conference details updated successfully.', data: updated });
  } catch (error) {
    console.error('Error in updateConference:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update conference details.' });
  }
};


