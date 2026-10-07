import React from 'react';
import {
  UploadCloud,
  BookOpen,
  Clock,
  Info,
  Megaphone
} from 'lucide-react';

export const Submission = () => {
  return (
    <div className="submission-page">
      <section className="page-header-section">
        <div className="content-container">
          <span className="page-header-badge">Call for Papers 2027</span>
          <h1 className="page-header-title">Paper Submission</h1>
          <p className="page-header-subtitle">
            Submit your original research work to ICCCNS 2027.
          </p>
        </div>
      </section>

      <section className="page-body-section">
        <div className="content-container" style={{ maxWidth: '1080px' }}>
          {/* Submit Manuscript Action */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <button
              className="btn-card-action btn-primary-glow"
              style={{
                padding: '0.75rem 1.8rem',
                fontSize: '1rem',
                background: 'var(--primary-cyan)',
                color: '#FFF',
                borderColor: 'var(--primary-cyan)'
              }}
            >
              <UploadCloud size={18} />
              <span>Submit Manuscript</span>
            </button>
          </div>

          <div className="submission-layout-grid">
            {/* Left: Submission Information Box */}
            <div className="form-wrapper">
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-navy)', marginBottom: '1.5rem', fontWeight: 700 }}>
                Submission Information
              </h3>

              {/* Microsoft CMT Service Info Box */}
              <div style={{
                background: 'rgba(0, 168, 214, 0.08)',
                border: '1px solid rgba(0, 168, 214, 0.28)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem 1.4rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}>
                <Info size={22} color="var(--primary-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  The Microsoft CMT service was used for managing the peer-reviewing process for this conference. This service was provided for free by Microsoft and they bore all expenses, including costs for Azure cloud services as well as for software development and support.
                </p>
              </div>

              {/* Prominent Alert: Paper submission link will be available soon */}
              <div style={{
                marginTop: '1.25rem',
                padding: '1.1rem 1.4rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.06)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'relative'
              }}>
                <Megaphone size={20} color="#EF4444" style={{ position: 'absolute', left: '1.4rem', flexShrink: 0 }} />
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  color: 'var(--primary-navy)',
                  paddingLeft: '1.5rem',
                  paddingRight: '1.5rem'
                }}>
                  Paper submission link will be available soon.
                </span>
              </div>
            </div>

            {/* Right: Author Guidelines & Deadlines */}
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
                    <span>Length: Full research papers should be 6 pages, including figures, tables, and references. An additional charge of ₹1,000 per page will be applicable for each page exceeding the prescribed 6-page limit.</span>
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
                    <span style={{ color: 'var(--primary-cyan)', fontWeight: 700 }}>31 MAR 2027</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Acceptance Notice:</span>
                    <span style={{ color: 'var(--primary-navy)', fontWeight: 600 }}>10 APR 2027</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Camera Ready:</span>
                    <span style={{ color: 'var(--primary-navy)', fontWeight: 600 }}>15 MAY 2027</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
