import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  UploadCloud,
  BookOpen,
  Clock,
  Info,
  Megaphone
} from 'lucide-react';

const defaultDates = [
  {
    id: 'd-1791799975748',
    title: 'Opening Date for Paper Submission',
    date: '2026-11-01',
    displayDate: '01 NOV 2026',
    description: 'Official submission portal opens for full research manuscripts across all tracks.',
    highlight: false
  },
  {
    id: 'd-1791800196517',
    title: 'Closing Date for Paper Submission',
    date: '2027-03-31',
    displayDate: '31 MARCH 2027',
    description: 'Strict deadline for full manuscript upload and initial peer-review dispatch.',
    highlight: true
  },
  {
    id: 'd-1791800316793',
    title: 'Notification of acceptance or rejection',
    date: '2027-04-10',
    displayDate: '10 APRIL 2027',
    description: 'Double-blind peer-review evaluations and acceptance decisions dispatched to authors.',
    highlight: false
  },
  {
    id: 'd-1791800373318',
    title: 'Registration Close',
    date: '2027-05-15',
    displayDate: '15 MAY 2027',
    description: 'Final registration deadline for authors and attendees.',
    highlight: false
  },
  {
    id: 'd-1791800412985',
    title: 'Final paper submission',
    date: '2027-05-18',
    displayDate: '18 MAY 2027',
    description: 'All registered authors are requested to submit the final camera-ready version of their papers through the conference submission portal within the prescribed deadline.',
    highlight: false
  },
  {
    id: 'd5',
    title: 'Conference',
    date: '2027-06-10',
    displayDate: '10-12 JUNE 2027',
    description: 'Inaugural ceremony, Keynote Speeches, Technical Paper Presentations & Valedictory.',
    highlight: false
  }
];

const getDeadlineLabel = (item) => {
  const title = (item.title || '').trim();
  const lower = title.toLowerCase();

  if (lower.includes('opening') && lower.includes('submission')) {
    return 'Submission Opening:';
  }
  if (lower.includes('closing') && lower.includes('submission')) {
    return 'Submission Due:';
  }
  if (lower.includes('acceptance') || lower.includes('rejection') || lower.includes('notification')) {
    return 'Acceptance Notice:';
  }
  if (lower.includes('registration') && lower.includes('close')) {
    return 'Registration Close:';
  }
  if (lower.includes('final paper') || lower.includes('camera ready')) {
    return 'Camera Ready:';
  }
  if (lower === 'conference' || lower.includes('conference')) {
    return 'Conference Dates:';
  }
  return title.endsWith(':') ? title : `${title}:`;
};

export const Submission = () => {
  const [dates, setDates] = useState(defaultDates);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await api.getDates();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setDates(res.data);
        }
      } catch (err) {
        console.error('Failed to load dates for submission page:', err);
      }
    };
    fetchDates();
  }, []);

  const sortedDates = [...dates].sort((a, b) => {
    if (a.date && b.date) {
      return a.date.localeCompare(b.date);
    }
    return 0;
  });

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

              {/* Key Deadlines Panel */}
              <div className="glass-panel" style={{ padding: '1.8rem', background: 'var(--surface-white)' }}>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} color="var(--primary-cyan)" /> Key Deadlines
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                  {sortedDates.map((item) => {
                    const label = getDeadlineLabel(item);
                    const isCyan = item.highlight || (item.title && item.title.toLowerCase().includes('closing')) || label.includes('Submission Due');
                    return (
                      <div
                        key={item.id || item._id || label}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          gap: '0.75rem'
                        }}
                        title={item.description || item.title}
                      >
                        <span style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>{label}</span>
                        <span
                          style={{
                            color: isCyan ? 'var(--primary-cyan)' : 'var(--primary-navy)',
                            fontWeight: isCyan ? 700 : 600,
                            whiteSpace: 'nowrap',
                            textAlign: 'right'
                          }}
                        >
                          {item.displayDate || item.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Submission;
