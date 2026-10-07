import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cloud,
  FileCheck2,
  ShieldCheck,
  Clock,
  ArrowRight,
  Calendar,
  Sparkles,
  Server,
  Award,
  Layers
} from 'lucide-react';

export const CmtAcknowledgement = () => {
  return (
    <div className="cmt-acknowledgement-page">
      {/* Page Header */}
      <section className="page-header-section">
        <div className="content-container">
          <span className="page-header-badge">Review & Editorial Platform</span>
          <h1 className="page-header-title">CMT Acknowledgement</h1>
          <p className="page-header-subtitle">
            Official acknowledgement of Microsoft Conference Management Toolkit (CMT) for ICCCNS-2027 peer-review operations.
          </p>
        </div>
      </section>

      {/* Page Content */}
      <section className="page-body-section">
        <div className="content-container" style={{ maxWidth: '960px' }}>
          {/* Main Acknowledgement Card */}
          <div
            className="glass-panel"
            style={{
              padding: '2.5rem',
              marginBottom: '2.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Platform Identification Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.75rem',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                {/* Official Microsoft 4-square SVG brand symbol */}
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-light)',
                    border: '1px solid var(--border-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022" rx="1" />
                    <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00" rx="1" />
                    <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF" rx="1" />
                    <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" rx="1" />
                  </svg>
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: '1.35rem',
                      color: 'var(--primary-navy)',
                      fontWeight: 700,
                      margin: 0
                    }}
                  >
                    Microsoft CMT
                  </h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Conference Management Toolkit
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-cyan">Sponsored Service</span>
                <span className="badge badge-teal">Cloud Powered</span>
              </div>
            </div>

            {/* Exact Acknowledgement Statement */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(0, 168, 214, 0.08) 0%, rgba(200, 241, 250, 0.35) 100%)',
                border: '1.5px solid rgba(0, 168, 214, 0.28)',
                borderRadius: 'var(--radius-md)',
                padding: '1.85rem 2.2rem',
                position: 'relative'
              }}
            >
              <p
                style={{
                  fontSize: '1.06rem',
                  lineHeight: '1.85',
                  color: 'var(--primary-navy)',
                  fontWeight: 500,
                  margin: 0
                }}
              >
                The Microsoft CMT service was used for managing the peer-reviewing process for this conference. This service was provided for free by Microsoft and they bore all expenses, including costs for Azure cloud services as well as for software development and support.
              </p>
            </div>
          </div>

          {/* Professional Visual Section: Key Pillars of Microsoft CMT Service */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--primary-cyan)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                Service Infrastructure & Capabilities
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))',
                gap: '1.4rem'
              }}
            >
              {/* Feature 1: Azure Cloud Services */}
              <div
                className="glass-panel"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(0, 168, 214, 0.12)',
                    border: '1px solid rgba(0, 168, 214, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-cyan)'
                  }}
                >
                  <Cloud size={24} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '1.15rem',
                      color: 'var(--primary-navy)',
                      fontWeight: 700,
                      marginBottom: '0.45rem'
                    }}
                  >
                    Azure Cloud Services
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.6',
                      margin: 0
                    }}
                  >
                    Enterprise cloud infrastructure and secure storage hosted on Microsoft Azure to ensure high reliability and data protection.
                  </p>
                </div>
              </div>

              {/* Feature 2: Peer Review Process */}
              <div
                className="glass-panel"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(11, 79, 156, 0.1)',
                    border: '1px solid rgba(11, 79, 156, 0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-navy-light)'
                  }}
                >
                  <FileCheck2 size={24} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '1.15rem',
                      color: 'var(--primary-navy)',
                      fontWeight: 700,
                      marginBottom: '0.45rem'
                    }}
                  >
                    Peer-Review Management
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.6',
                      margin: 0
                    }}
                  >
                    Comprehensive double-blind evaluation workflows, reviewer conflict management, scoring matrices, and author rebuttals.
                  </p>
                </div>
              </div>

              {/* Feature 3: Software Development & Support */}
              <div
                className="glass-panel"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(5, 150, 105, 0.1)',
                    border: '1px solid rgba(5, 150, 105, 0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-emerald)'
                  }}
                >
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '1.15rem',
                      color: 'var(--primary-navy)',
                      fontWeight: 700,
                      marginBottom: '0.45rem'
                    }}
                  >
                    Software & Support
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.6',
                      margin: 0
                    }}
                  >
                    Continuous platform maintenance, feature development, automated notification services, and technical support.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Highlighted Message Card: Polished & Intentional */}
          <div
            className="glass-panel"
            style={{
              padding: '2.5rem 2rem',
              textAlign: 'center',
              background:
                'radial-gradient(circle at 50% 50%, rgba(0, 163, 199, 0.14) 0%, rgba(200, 241, 250, 0.45) 75%)',
              border: '1.5px solid var(--border-cyan)',
              borderRadius: 'var(--radius-lg)',
              position: 'relative'
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.38rem 1rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(0, 163, 199, 0.12)',
                border: '1px solid var(--primary-cyan)',
                color: 'var(--primary-navy)',
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1rem'
              }}
            >
              <Clock size={15} color="var(--primary-cyan)" />
              <span>Portal Status</span>
            </div>

            <h3
              style={{
                fontSize: 'clamp(1.4rem, 2.4vw, 1.85rem)',
                fontWeight: 800,
                color: 'var(--primary-navy)',
                marginBottom: '0.75rem',
                letterSpacing: '-0.02em'
              }}
            >
              This page will be available soon.
            </h3>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.96rem',
                maxWidth: '600px',
                margin: '0 auto 1.75rem',
                lineHeight: 1.65
              }}
            >
              The ICCCNS-2027 paper submission and reviewer portal on Microsoft CMT is currently being configured and will open in accordance with the conference submission cycle.
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
                <span>Author Guidelines</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/dates" className="btn-secondary-glass">
                <Calendar size={16} />
                <span>Important Dates</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CmtAcknowledgement;
