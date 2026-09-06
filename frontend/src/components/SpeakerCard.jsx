import React from 'react';
import { resolveImageUrl } from '../utils/imageUrl';

const getInitials = (name) => {
  if (!name) return 'SP';
  const clean = name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const SpeakerCard = ({ speaker, onClick }) => {
  const imageUrl = resolveImageUrl(speaker.image);

  return (
    <div className="speaker-card" onClick={() => onClick && onClick(speaker)}>
      <div className="speaker-img-box">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={speaker.name}
            className="speaker-img"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = e.target.nextElementSibling;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}

        <div
          className="speaker-placeholder-fallback"
          style={{ display: speaker.image ? 'none' : 'flex' }}
        >
          <div className="speaker-fallback-circle">
            <span className="speaker-fallback-initials">{getInitials(speaker.name)}</span>
          </div>
          <span className="speaker-fallback-badge">SPEAKER</span>
        </div>

        {speaker.type && <span className="speaker-type-tag">{speaker.type}</span>}
      </div>

      <div className="speaker-info-body">
        <h4 className="speaker-name">{speaker.name}</h4>
        <p className="speaker-designation">{speaker.designation}</p>
        <p className="speaker-institution">{speaker.institution}</p>

        <div className="speaker-topic-box">
          <div className="speaker-topic-label">{speaker.track || 'Keynote Session'}</div>
          <div className="speaker-topic-title">{speaker.topic}</div>
        </div>
      </div>
    </div>
  );
};

