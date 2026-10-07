import React from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  BookOpen,
  Calendar,
  CheckCircle2,
  Award,
  ArrowRight,
  Library,
  FileText
} from 'lucide-react';

export const PastConferences = () => {
  const conferences = [
    {
      id: 'icnsoc-2025',
      name: 'ICNSoC 2025',
      year: '2025',
      fullName: 'International Conference on Networking, Systems and Communications',
      description:
        'All accepted and presented peer-reviewed research papers from ICNSoC 2025 have been published and are permanently accessible in the IEEE Xplore Digital Library.',
      ieeeUrl: 'https://ieeexplore.ieee.org/xpl/conhome/11344070/proceeding',
      indexedIn: 'IEEE Xplore / Scopus',
      badgeColor: 'badge-cyan'
    },
    {
      id: 'icccns-2026',
      name: 'ICC-CNS 2026',
      year: '2026',
      fullName: 'First International Conference on Cognitive Computing and Networking Systems',
      description:
        'All accepted and presented peer-reviewed research papers from the inaugural ICC-CNS 2026 edition have been published and are permanently accessible in the IEEE Xplore Digital Library.',
      ieeeUrl: 'https://ieeexplore.ieee.org/xpl/conhome/11605975/proceeding',
      indexedIn: 'IEEE Xplore / Scopus',
      badgeColor: 'badge-emerald'
    }
  ];

  return (
    <div className="past-conferences-page">
      {/* Page Header */}
      <section className="page-header-section">
        <div className="content-container">
          <span className="page-header-badge">Proceedings & Archive</span>
          <h1 className="page-header-title">Past Conferences</h1>
          <p className="page-header-subtitle">
            Past Two Conferences published in the IEEE Xplore Digital Library:
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="page-body-section">
        <div className="content-container" style={{ maxWidth: '1080px' }}>
          {/* Highlight Section Header */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '2.5rem'
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--surface-white)',
                border: '1.5px solid var(--border-cyan)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '1rem'
              }}
            >
              <Library size={18} color="var(--primary-cyan)" />
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--primary-navy)'
                }}
              >
                IEEE Xplore Digital Library Archive
              </span>
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)',
                color: 'var(--primary-navy)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '0.6rem'
              }}
            >
              Past Two Conferences published in the IEEE Xplore Digital Library:
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.98rem',
                maxWidth: '680px',
                margin: '0 auto',
                lineHeight: 1.6
              }}
            >
              Explore published proceedings, technical papers, and citations from our prior editions.
            </p>
          </div>

          {/* Conference Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
              gap: '2rem',
              marginBottom: '3.5rem'
            }}
          >
            {conferences.map((conf) => (
              <div
                key={conf.id}
                className="glass-panel"
                style={{
                  padding: '2.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-xl)',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Badges Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className={`badge ${conf.badgeColor}`}>
                        <Calendar size={13} />
                        <span>Edition {conf.year}</span>
                      </span>
                      <span className="badge badge-teal">
                        <CheckCircle2 size={13} color="var(--primary-cyan)" />
                        <span>Published</span>
                      </span>
                    </div>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        background: 'rgba(0, 168, 214, 0.08)',
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-xs)'
                      }}
                    >
                      IEEE Xplore
                    </span>
                  </div>

                  {/* Conference Heading */}
                  <h3
                    style={{
                      fontSize: '1.65rem',
                      fontWeight: 800,
                      color: 'var(--primary-navy)',
                      letterSpacing: '-0.02em',
                      marginBottom: '0.4rem'
                    }}
                  >
                    {conf.name}
                  </h3>

                  <div
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--primary-cyan)',
                      fontWeight: 600,
                      marginBottom: '1rem'
                    }}
                  >
                    {conf.fullName}
                  </div>

                  <p
                    style={{
                      fontSize: '0.94rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.65',
                      marginBottom: '1.5rem'
                    }}
                  >
                    {conf.description}
                  </p>

                  {/* Metadata Items */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      padding: '1rem 1.25rem',
                      background: 'var(--surface-light)',
                      border: '1px solid var(--border-cyan)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1.75rem',
                      fontSize: '0.88rem'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem'
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--text-muted)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Library size={15} color="var(--primary-cyan)" />
                        Publisher:
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>
                        IEEE Xplore Digital Library
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem'
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--text-muted)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <FileText size={15} color="var(--primary-cyan)" />
                        Format:
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>
                        Conference Proceedings
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem'
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--text-muted)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Award size={15} color="var(--primary-cyan)" />
                        Indexing:
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>
                        {conf.indexedIn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Clickable IEEE Xplore Action Button */}
                <a
                  href={conf.ieeeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-glow"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    textDecoration: 'none',
                    width: 'fit-content'
                  }}
                >
                  <span>View on IEEE Xplore →</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>

          {/* Looking Ahead: ICCCNS-2027 Section */}
          <div
            className="glass-panel"
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              background:
                'radial-gradient(circle at 50% 50%, rgba(0, 163, 199, 0.12) 0%, rgba(200, 241, 250, 0.45) 75%)',
              border: '1.5px solid var(--border-cyan)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <span className="page-header-badge" style={{ marginBottom: '1rem' }}>
              Continuing The Legacy
            </span>
            <h3
              style={{
                fontSize: 'clamp(1.35rem, 2.5vw, 1.8rem)',
                fontWeight: 800,
                color: 'var(--primary-navy)',
                marginBottom: '0.75rem'
              }}
            >
              Join Us at ICCCNS-2027
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.96rem',
                maxWidth: '640px',
                margin: '0 auto 1.8rem',
                lineHeight: 1.65
              }}
            >
              Building on the scholarly success of ICNSoC 2025 and ICC-CNS 2026, the 2nd International Conference on Cognitive Computing and Networking Systems (ICCCNS 2027) will be held at VFSTR, Vadlamudi, AP, India from 10–12 June 2027.
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <Link to="/submission" className="btn-primary-glow">
                <span>Submit Your Paper</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn-secondary-glass">
                <span>About Conference</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PastConferences;
