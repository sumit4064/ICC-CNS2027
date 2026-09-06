/**
 * @file imageUrl.js
 * @description Helper utility to safely resolve image URLs.
 * - Leaves absolute URLs (http://, https://) unchanged.
 * - Leaves legacy local paths (/images/..., /uploads/..., /logos/..., /speakers/...) unchanged.
 * - Automatically routes B2 cloud storage keys (speakers/..., committee/..., gallery/...) to `/api/assets/<key>`.
 *
 * @param {string|null|undefined} imagePath
 * @returns {string|null}
 */
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

export const resolveImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;

  const trimmed = imagePath.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // Backblaze B2 storage keys
  if (
    trimmed.startsWith('speakers/') ||
    trimmed.startsWith('committee/') ||
    trimmed.startsWith('gallery/')
  ) {
    return `${API_BASE}/assets/${trimmed}`;
  }

  return `/${trimmed}`;
};

export default resolveImageUrl;
