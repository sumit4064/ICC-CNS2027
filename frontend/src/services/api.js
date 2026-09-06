const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    ...options.headers
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers
    });
  } catch (err) {
    throw new Error('Could not connect to backend server. Make sure the backend is running on port 5000.');
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 502 || response.status === 504 || response.status === 500) {
      if (data.message) {
        throw new Error(data.message);
      }
      throw new Error('Backend server is not responding (port 5000 offline or proxy error).');
    }
    throw new Error(data.message || 'An error occurred with the request.');
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  getMe: (token) =>
    request('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }),

  // Conference
  getConference: () => request('/conference'),
  updateConference: (data, token) =>
    request('/conference', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    }),

  // Dates
  getDates: () => request('/dates'),
  createDate: (data, token) =>
    request('/dates', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    }),
  updateDate: (id, data, token) =>
    request(`/dates/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    }),
  deleteDate: (id, token) =>
    request(`/dates/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),

  // Speakers
  getSpeakers: () => request('/speakers'),
  getSpeakerById: (id) => request(`/speakers/${id}`),
  createSpeaker: (data, token) =>
    request('/speakers', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data instanceof FormData ? data : JSON.stringify(data)
    }),
  updateSpeaker: (id, data, token) =>
    request(`/speakers/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: data instanceof FormData ? data : JSON.stringify(data)
    }),
  deleteSpeaker: (id, token) =>
    request(`/speakers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),
  uploadSpeakerImage: (id, formData, token) =>
    request(`/speakers/${id}/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    }),
  deleteSpeakerImage: (id, token) =>
    request(`/speakers/${id}/image`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),

  // Tracks
  getTracks: () => request('/tracks'),
  createTrack: (data, token) =>
    request('/tracks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    }),
  updateTrack: (id, data, token) =>
    request(`/tracks/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    }),
  deleteTrack: (id, token) =>
    request(`/tracks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),

  // Registrations
  getRegistrationCategories: () => request('/registrations/categories'),
  submitRegistration: (data) =>
    request('/registrations', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  getRegistrations: (token) =>
    request('/registrations', {
      headers: { Authorization: `Bearer ${token}` }
    }),
  updateRegistration: (id, data, token) =>
    request(`/registrations/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    }),

  // Submissions
  submitPaper: (formData) =>
    request('/submissions', {
      method: 'POST',
      body: formData
    }),
  getSubmissions: (token) =>
    request('/submissions', {
      headers: { Authorization: `Bearer ${token}` }
    }),
  trackPaper: (query) => request(`/submissions/track/${encodeURIComponent(query)}`),
  getSubmissionDownloadUrl: (id, token) =>
    request(`/submissions/${encodeURIComponent(id)}/download`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  updateSubmission: (id, data, token) =>
    request(`/submissions/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    }),

  // Committee
  getCommittee: (params = '') => request(`/committee${params ? '?' + params : ''}`),
  getCommitteeById: (id) => request(`/committee/${id}`),
  createCommitteeMember: (data, token) =>
    request('/committee', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    }),
  updateCommitteeMember: (id, data, token) =>
    request(`/committee/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    }),
  deleteCommitteeMember: (id, token) =>
    request(`/committee/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),
  uploadCommitteeImage: (id, formData, token) =>
    request(`/committee/${id}/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    }),
  deleteCommitteeImage: (id, token) =>
    request(`/committee/${id}/image`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),
  updateCommittee: (data, token) =>
    request('/committee', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    }),

  // Gallery
  getGallery: () => request('/gallery'),
  addGalleryItem: (formData, token) =>
    request('/gallery', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    }),
  deleteGalleryItem: (id, token) =>
    request(`/gallery/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),

  // Contact
  sendMessage: (data) =>
    request('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  getMessages: (token) =>
    request('/contact', {
      headers: { Authorization: `Bearer ${token}` }
    })
};
