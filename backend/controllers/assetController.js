/**
 * @file assetController.js
 * @description Secure public asset delivery controller for B2-backed images.
 * Generates short-lived presigned GET URLs (10 minutes) for approved public asset prefixes:
 * - speakers/
 * - committee/
 * - gallery/
 *
 * Strictly blocks:
 * - papers/ (manuscripts remain private and admin-only)
 * - path traversal (../, ..\\, etc.)
 * - arbitrary bucket paths
 */

import { getPresignedDownloadUrl, isB2Configured } from '../services/b2StorageService.js';
import { serverCache } from '../utils/cache.js';

const ALLOWED_PREFIXES = ['speakers/', 'committee/', 'gallery/'];

/**
 * Validates and sanitizes a requested B2 object key.
 *
 * @param {string} rawKey - The raw object key requested by the client
 * @returns {{ valid: boolean, key?: string, error?: string }}
 */
export const validateAndSanitizeKey = (rawKey) => {
  if (!rawKey || typeof rawKey !== 'string') {
    return { valid: false, error: 'Asset key is required.' };
  }

  let key = rawKey.trim();

  // Decode URL component if encoded
  try {
    key = decodeURIComponent(key);
  } catch (e) {
    return { valid: false, error: 'Malformed asset key encoding.' };
  }

  // Strip leading slashes
  key = key.replace(/^\/+/, '');

  // 1. Strict rejection of directory traversal and illegal characters
  if (
    key.includes('..') ||
    key.includes('\\') ||
    key.includes('\0') ||
    key.includes('//')
  ) {
    return {
      valid: false,
      error: 'Access denied: Directory traversal sequences are strictly forbidden.'
    };
  }

  // 2. Strict rejection of private papers and manuscripts
  if (key.startsWith('papers/') || key.includes('/papers/')) {
    return {
      valid: false,
      error: 'Access denied: Manuscript papers are private and cannot be retrieved via public asset endpoints.'
    };
  }

  // 3. Strict prefix allowlist (speakers/, committee/, gallery/)
  const hasAllowedPrefix = ALLOWED_PREFIXES.some((prefix) => key.startsWith(prefix));
  if (!hasAllowedPrefix) {
    return {
      valid: false,
      error: 'Access denied: Key does not belong to an approved public asset collection (speakers/, committee/, gallery/).'
    };
  }

  // 4. Safe character validation
  if (!/^[a-zA-Z0-9/._@%+-]+$/.test(key)) {
    return {
      valid: false,
      error: 'Access denied: Invalid characters in asset key.'
    };
  }

  return { valid: true, key };
};

/**
 * GET /api/assets/image?key=... OR GET /api/assets/*
 * Public unauthenticated asset delivery endpoint for Backblaze B2 images.
 */
export const getPublicAsset = async (req, res) => {
  try {
    if (!isB2Configured()) {
      return res.status(503).json({
        success: false,
        message: 'Cloud storage service is currently unavailable.'
      });
    }

    // Extract key from query parameter or route parameter
    let rawKey = req.query.key;
    if (!rawKey) {
      const wildcardPath = req.params[0] || req.params.key;
      if (wildcardPath) {
        rawKey = wildcardPath;
      } else {
        rawKey = req.originalUrl
          .replace(/^\/api\/assets\/?/, '')
          .replace(/^\/api\/media\/?/, '')
          .split('?')[0];
      }
    }

    const { valid, key, error } = validateAndSanitizeKey(rawKey);
    if (!valid) {
      return res.status(400).json({ success: false, message: error });
    }

    const cacheKey = `b2:presigned:${key}`;
    let presignedUrl = serverCache.get(cacheKey);

    if (!presignedUrl) {
      // Generate 10-minute short-lived presigned GET URL (600 seconds)
      presignedUrl = await getPresignedDownloadUrl({
        key,
        expiresIn: 600 // 10 minutes
      });
      // Cache URL in memory for 300 seconds (5 minutes)
      serverCache.set(cacheKey, presignedUrl, 300);
    }

    // If client requested JSON response
    if (req.query.json === 'true' || req.query.format === 'json') {
      res.setHeader('Cache-Control', 'public, max-age=300');
      return res.json({
        success: true,
        url: presignedUrl,
        expiresIn: 600,
        key
      });
    }

    // Default: Redirect browser to presigned URL (302 Found)
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.redirect(302, presignedUrl);
  } catch (err) {
    console.error('Error in getPublicAsset:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate asset delivery URL.'
    });
  }
};
