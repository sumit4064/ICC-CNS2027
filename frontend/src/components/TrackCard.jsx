import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TrackCard = ({ track }) => {
  const getBadgeColorClass = (accent) => {
    if (accent === 'orange' || track.number === '01') return 'orange';
    if (accent === 'emerald' || track.number === '02') return 'emerald';
    return 'blue';
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div className={`track-num-badge ${getBadgeColorClass(track.accent)}`}>
          {track.number}
        </div>
        <span className="badge badge-outline" style={{ fontSize: '0.75rem' }}>
          {track.code || `TRACK-${track.number}`}
        </span>
      </div>

      <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-navy)', marginBottom: '0.8rem' }}>
        {track.name}
      </h3>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        {track.summary}
      </p>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
          Key Scope & Topics:
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.5rem' }}>
          {(track.topics || []).slice(0, 5).map((topic, i) => (
            <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary-cyan)', marginTop: '2px' }}>•</span>
              <span>{topic}</span>
            </li>
          ))}
        </ul>

        <Link
          to={`/submission?track=${encodeURIComponent(track.name)}`}
          className="btn-card-action"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <span>Submit to this Track</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};
