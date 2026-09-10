import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Search,
  BookOpen,
  ArrowRight,
  Clock,
  Download,
  Lock
} from 'lucide-react';

export const Submission = () => {
  const [searchParams] = useSearchParams();
  const initialTrack = searchParams.get('track') || 'Cognitive Computing & AI';
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('submit'); // 'submit' or 'track'

  // Submission Form State
  const [formData, setFormData] = useState({
    title: '',
    track: initialTrack,
    authors: '',
    primaryAuthorEmail: '',
    phone: '',
    institution: '',
    country: 'India',
    abstract: '',
    keywords: ''
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState(null);

  // Paper Tracker State
  const [searchQuery, setSearchQuery] = useState('');
  const [trackedPaper, setTrackedPaper] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmitPaper = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.authors || !formData.primaryAuthorEmail || !formData.institution || !formData.abstract) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    if (!file) {
      showToast('Please upload your manuscript PDF or DOCX file.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('track', formData.track);
      data.append('authors', formData.authors);
      data.append('primaryAuthorEmail', formData.primaryAuthorEmail);
      data.append('phone', formData.phone || '');
      data.append('institution', formData.institution);
      data.append('country', formData.country || 'India');
      data.append('abstract', formData.abstract);
      data.append('keywords', formData.keywords);
      data.append('file', file);

      const res = await api.submitPaper(data);
      if (res.success) {
        setSubmissionReceipt(res.data);
        showToast('Paper manuscript submitted successfully!');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to submit paper', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackPaper = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setTrackingLoading(true);
    setTrackError('');
    setTrackedPaper(null);

    try {
      const res = await api.trackPaper(searchQuery.trim());
      if (res.success) {
        setTrackedPaper(res.data);
      }
    } catch (err) {
      setTrackError(err.message || 'No manuscript found with that ID or email.');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="submission-page">
      <section className="page-header-section">
        <div className="content-container">
          <span className="page-header-badge">Call for Papers 2027</span>
          <h1 className="page-header-title">Paper Submission Portal</h1>
          <p className="page-header-subtitle">
            Submit original, unpublished research papers for peer-review at ICCCNS-2027 hosted by Vignan University (VFSTR).
          </p>
        </div>
      </section>

      <section className="page-body-section">
        <div className="content-container" style={{ maxWidth: '1080px' }}>
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('submit')}
              className={`btn-card-action ${activeTab === 'submit' ? 'btn-primary-glow' : ''}`}
              style={{
                padding: '0.75rem 1.8rem',
                fontSize: '1rem',
                background: activeTab === 'submit' ? 'var(--primary-cyan)' : 'var(--surface-white)',
                color: activeTab === 'submit' ? '#FFF' : 'var(--primary-navy)',
                borderColor: activeTab === 'submit' ? 'var(--primary-cyan)' : 'var(--border-subtle)'
              }}
            >
              <UploadCloud size={18} />
              <span>Submit Manuscript</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`btn-card-action ${activeTab === 'track' ? 'btn-primary-glow' : ''}`}
              style={{
                padding: '0.75rem 1.8rem',
                fontSize: '1rem',
                background: activeTab === 'track' ? 'var(--primary-cyan)' : 'var(--surface-white)',
                color: activeTab === 'track' ? '#FFF' : 'var(--primary-navy)',
                borderColor: activeTab === 'track' ? 'var(--primary-cyan)' : 'var(--border-subtle)'
              }}
            >
              <Search size={18} />
              <span>Track Paper Status</span>
            </button>
          </div>

          {/* TAB 1: SUBMIT MANUSCRIPT */}
          {activeTab === 'submit' && (
            <>
              {submissionReceipt ? (
                /* Submission Confirmation Receipt */
                <div className="form-wrapper" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: 'var(--accent-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <CheckCircle2 size={36} />
                  </div>

                  <span className="badge badge-emerald" style={{ marginBottom: '0.8rem' }}>
                    Submission Received
                  </span>
                  <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
                    Thank You for Submitting to ICCCNS-2027!
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto 1.8rem' }}>
                    Your paper has entered the double-blind peer review process. Please note your unique Paper ID.
                  </p>

                  <div style={{
                    background: 'var(--background-light)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    maxWidth: '600px',
                    margin: '0 auto 2rem',
                    textAlign: 'left',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Paper ID:</span>
                      <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-cyan)', fontWeight: 800, fontSize: '1.2rem' }}>
                        {submissionReceipt.id}
                      </span>
                    </div>
                    <div style={{ marginBottom: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Paper Title:</span>
                      <div style={{ color: 'var(--primary-navy)', fontWeight: 600, fontSize: '1.05rem' }}>{submissionReceipt.title}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Track:</span>
                        <div style={{ color: 'var(--primary-cyan)' }}>{submissionReceipt.track}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                        <div style={{ color: '#10B981', fontWeight: 700 }}>{submissionReceipt.status}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button
                      onClick={() => {
                        setSubmissionReceipt(null);
                        setFile(null);
                        setFormData({
                          title: '',
                          track: 'Cognitive Computing & AI',
                          authors: '',
                          primaryAuthorEmail: '',
                          phone: '',
                          institution: '',
                          country: 'India',
                          abstract: '',
                          keywords: ''
                        });
                      }}
                      className="btn-secondary-glass"
                    >
                      Submit Another Manuscript
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery(submissionReceipt.id);
                        setActiveTab('track');
                        setTrackedPaper(submissionReceipt);
                      }}
                      className="btn-primary-glow"
                    >
                      <span>Check Live Status</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Submission Form */
                <div className="submission-layout-grid">
                  {/* Left: Upload Form */}
                  <div className="form-wrapper">
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)', marginBottom: '1.5rem' }}>
                      Manuscript Submission Details
                    </h3>

                    <form onSubmit={handleSubmitPaper}>
                      <div className="form-group">
                        <label className="form-label">
                          Paper Title <span className="required-star">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          required
                          placeholder="e.g. Cognitive AI Architectures in 6G Heterogeneous Networks"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>

                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">
                            Primary Track <span className="required-star">*</span>
                          </label>
                          <select
                            name="track"
                            value={formData.track}
                            onChange={handleInputChange}
                            className="form-select"
                          >
                            <option value="Cognitive Computing & AI">Track 01: Cognitive Computing & AI</option>
                            <option value="Intelligent Networking & Next-Gen Systems">Track 02: Intelligent Networking & Next-Gen Systems</option>
                            <option value="Data Science, Blockchain & Computational Systems">Track 03: Data Science, Blockchain & Computational Systems</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            Author(s) List <span className="required-star">*</span>
                          </label>
                          <input
                            type="text"
                            name="authors"
                            required
                            placeholder="e.g. Dr. John Doe, Alice Smith"
                            value={formData.authors}
                            onChange={handleInputChange}
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">
                            Corresponding Email <span className="required-star">*</span>
                          </label>
                          <input
                            type="email"
                            name="primaryAuthorEmail"
                            required
                            placeholder="author@university.edu"
                            value={formData.primaryAuthorEmail}
                            onChange={handleInputChange}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            Institution / Organization <span className="required-star">*</span>
                          </label>
                          <input
                            type="text"
                            name="institution"
                            required
                            placeholder="e.g. Department of CSE, University..."
                            value={formData.institution}
                            onChange={handleInputChange}
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Abstract Summary (150–250 words) <span className="required-star">*</span>
                        </label>
                        <textarea
                          name="abstract"
                          required
                          placeholder="Briefly state the research problem, methodology, key findings, and contributions..."
                          value={formData.abstract}
                          onChange={handleInputChange}
                          className="form-textarea"
                          rows={4}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Keywords (Comma separated)</label>
                        <input
                          type="text"
                          name="keywords"
                          placeholder="e.g. Cognitive AI, 6G Networks, Deep Neural Networks, Edge Intelligence"
                          value={formData.keywords}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>

                      {/* File Upload Dropzone */}
                      <div className="form-group">
                        <label className="form-label">
                          Upload Manuscript (PDF / DOCX) <span className="required-star">*</span>
                        </label>
                        <label className="file-dropzone">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                          />
                          <div className="dropzone-icon">
                            <UploadCloud size={28} />
                          </div>
                          <div className="dropzone-title">
                            {file ? file.name : 'Click or Drag & Drop Manuscript File Here'}
                          </div>
                          <div className="dropzone-subtitle">
                            Accepts PDF, DOC, DOCX up to 25 MB
                          </div>
                          {file && (
                            <div className="selected-file-badge">
                              <FileText size={16} />
                              <span>{(file.size / (1024 * 1024)).toFixed(2)} MB Selected</span>
                            </div>
                          )}
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary-glow"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                      >
                        {submitting ? 'Uploading Manuscript...' : 'Submit Manuscript for Review'}
                        <ArrowRight size={18} />
                      </button>
                    </form>
                  </div>

                  {/* Right: Author Guidelines */}
                  <div>
                    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                      <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BookOpen size={18} color="var(--primary-cyan)" /> Author Guidelines
                      </h4>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        <li style={{ display: 'flex', gap: '0.5rem' }}>
                          <span style={{ color: 'var(--primary-cyan)' }}>1.</span>
                          <span>Manuscripts must be strictly original and not submitted elsewhere concurrently.</span>
                        </li>
                        <li style={{ display: 'flex', gap: '0.5rem' }}>
                          <span style={{ color: 'var(--primary-cyan)' }}>2.</span>
                          <span>Length: Standard full research papers should be 6 to 8 pages (including figures & references).</span>
                        </li>
                        <li style={{ display: 'flex', gap: '0.5rem' }}>
                          <span style={{ color: 'var(--primary-cyan)' }}>3.</span>
                          <span>Double-blind review: Please ensure author names and affiliations are omitted from initial review copies.</span>
                        </li>
                        <li style={{ display: 'flex', gap: '0.5rem' }}>
                          <span style={{ color: 'var(--primary-cyan)' }}>4.</span>
                          <span>Plagiarism threshold must be under 15% (Turnitin/iThenticate).</span>
                        </li>
                      </ul>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.8rem', background: 'var(--surface-white)' }}>
                      <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-navy)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={18} color="var(--primary-cyan)" /> Key Deadlines
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Submission Due:</span>
                          <span style={{ color: 'var(--primary-cyan)', fontWeight: 700 }}>10 APR 2027</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Acceptance Notice:</span>
                          <span style={{ color: 'var(--primary-navy)', fontWeight: 600 }}>30 APR 2027</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Camera Ready:</span>
                          <span style={{ color: 'var(--primary-navy)', fontWeight: 600 }}>15 MAY 2027</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 2: TRACK PAPER STATUS */}
          {activeTab === 'track' && (
            <div className="form-wrapper" style={{ maxWidth: '750px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-navy)', marginBottom: '0.6rem', textAlign: 'center' }}>
                Track Manuscript Review Status
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', textAlign: 'center', marginBottom: '2rem' }}>
                Enter your Paper ID (e.g. ICCCNS-2027-001) or Primary Author Email Address.
              </p>

              <form onSubmit={handleTrackPaper} className="status-search-box">
                <input
                  type="text"
                  placeholder="Enter Paper ID (e.g. ICCCNS-2027-001) or author email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button type="submit" disabled={trackingLoading} className="btn-primary-glow">
                  {trackingLoading ? 'Searching...' : 'Check Status'}
                </button>
              </form>

              {trackError && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem 1.2rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #EF4444',
                  color: '#B91C1C',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}>
                  <AlertCircle size={18} />
                  <span>{trackError}</span>
                </div>
              )}

              {trackedPaper && (
                <div className="status-result-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-cyan)' }}>
                        {trackedPaper.id}
                      </span>
                      {trackedPaper.isLocked && (
                        <span className="badge" style={{ fontSize: '0.72rem', background: 'rgba(11, 45, 107, 0.08)', color: 'var(--primary-navy)' }}>
                          <Lock size={12} style={{ marginRight: '4px' }} /> Locked
                        </span>
                      )}
                    </div>
                    <span className={`status-tag ${
                      trackedPaper.status === 'Accepted' ? 'accepted' : trackedPaper.status === 'Rejected' ? 'rejected' : 'review'
                    }`}>
                      {trackedPaper.status === 'Accepted' ? '✓ Accepted' : trackedPaper.status === 'Rejected' ? '✕ Rejected' : '⏳ Under Review'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', marginBottom: '0.6rem' }}>
                    {trackedPaper.title}
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem', fontSize: '0.88rem', margin: '1.2rem 0', color: 'var(--text-secondary)' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Authors: </span>
                      {trackedPaper.authors}
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Track: </span>
                      {trackedPaper.track}
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Institution: </span>
                      {trackedPaper.institution}
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Submitted: </span>
                      {new Date(trackedPaper.submittedAt).toLocaleDateString()}
                    </div>
                    {trackedPaper.decisionDate && (
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Decision Date: </span>
                        {new Date(trackedPaper.decisionDate).toLocaleDateString()}
                      </div>
                    )}
                    {trackedPaper.fileName && (
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Manuscript File: </span>
                        <span style={{ color: 'var(--accent-cyan)' }}>{trackedPaper.fileName}</span>
                      </div>
                    )}
                  </div>

                  {trackedPaper.status === 'Accepted' && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      fontSize: '0.9rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: 700, marginBottom: '0.4rem' }}>
                        <CheckCircle2 size={18} />
                        <span>Congratulations! Manuscript Accepted for Presentation & Publication.</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.86rem', lineHeight: '1.5' }}>
                        {trackedPaper.reviewNotes || 'Your manuscript has met the peer-review standards for ICCCNS-2027. Please prepare the final camera-ready manuscript according to the IEEE format.'}
                      </p>
                    </div>
                  )}

                  {trackedPaper.status === 'Rejected' && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      fontSize: '0.9rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', fontWeight: 700, marginBottom: '0.4rem' }}>
                        <AlertCircle size={18} />
                        <span>Manuscript Review Decision: Rejected</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.86rem', lineHeight: '1.5' }}>
                        {trackedPaper.rejectionReason || trackedPaper.reviewNotes || 'Thank you for your submission. After careful evaluation, your paper was not recommended for presentation at ICCCNS-2027.'}
                      </p>
                    </div>
                  )}

                  {trackedPaper.status === 'Under Review' && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(0, 180, 216, 0.1)',
                      border: '1px solid rgba(0, 180, 216, 0.3)',
                      fontSize: '0.9rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.4rem' }}>
                        <Clock size={18} />
                        <span>Manuscript Under Active Peer Review</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: '1.5' }}>
                        Your manuscript is currently being evaluated by the Technical Program Committee reviewers. You will be notified once the decision is released.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
