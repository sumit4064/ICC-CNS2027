import React from 'react';
import { X, MapPin, Building, BookOpen, Award } from 'lucide-react';
import { resolveImageUrl } from '../utils/imageUrl';

const getInitials = (name) => {
  if (!name) return 'SP';
  const clean = name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const SpeakerModal = ({ speaker, onClose }) => {
  if (!speaker) return null;
  const imageUrl = resolveImageUrl(speaker.image);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            flexShrink: 0,
            border: '2px solid var(--accent-orange)',
            background: '#001F24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={speaker.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              style={{
                width: '100%',
                height: '100%',
                display: speaker.image ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '0.2rem',
                background: 'radial-gradient(circle, rgba(0, 180, 216, 0.2) 0%, #001F24 80%)'
              }}
            >
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-orange)' }}>
                {getInitials(speaker.name)}
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#00E5FF', letterSpacing: '0.08em' }}>
                SPEAKER
              </span>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <span className="badge badge-orange" style={{ marginBottom: '0.4rem' }}>
              {speaker.type || 'Keynote Speaker'}
            </span>
            <h3 style={{ fontSize: '1.6rem', color: '#FFF', marginBottom: '0.2rem' }}>
              {speaker.name}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {speaker.designation}
            </p>
            <p style={{ color: '#00B4D8', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
              <Building size={15} /> {speaker.institution}
            </p>
            {speaker.country && (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                <MapPin size={14} /> {speaker.country}
              </p>
            )}
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 24, 28, 0.6)',
          borderRadius: 'var(--radius-md)',
          padding: '1.2rem',
          marginBottom: '1.5rem',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-orange)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BookOpen size={14} /> Conference Session Topic
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>
            "{speaker.topic}"
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginTop: '0.3rem' }}>
            Domain: {speaker.track || 'Cognitive Computing'}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', color: '#FFF', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Award size={16} color="var(--accent-orange)" /> Biography & Profile
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7' }}>
            {speaker.bio || 'Distinguished academic researcher and innovator in cognitive systems, computing architectures, and international research collaborations.'}
          </p>
        </div>
      </div>
    </div>
  );
};
