import React from 'react';

export const CmtAcknowledgement = () => {
  return (
    <div className="cmt-acknowledgement-page" style={{ minHeight: '85vh', padding: '6.5rem 1.5rem 5rem' }}>
      <div className="content-container" style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Page Heading */}
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 4vw, 2.85rem)',
            fontWeight: 800,
            color: 'var(--primary-navy, #071D49)',
            textAlign: 'center',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}
        >
          CMT Acknowledgement
        </h1>

        {/* Exact Microsoft CMT Acknowledgement Paragraph */}
        <p
          style={{
            fontSize: 'clamp(1rem, 1.35vw, 1.12rem)',
            lineHeight: 1.75,
            color: 'var(--primary-navy, #0B2D6B)',
            textAlign: 'center',
            maxWidth: '840px',
            margin: '0 auto',
            fontWeight: 500
          }}
        >
          The Microsoft CMT service was used for managing the peer-reviewing process for this conference. This service was provided for free by Microsoft and they bore all expenses, including costs for Azure cloud services as well as for software development and support.
        </p>
      </div>
    </div>
  );
};

export default CmtAcknowledgement;
