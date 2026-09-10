import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TrackCard } from '../components/TrackCard';
import { Layers, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Tracks = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await api.getTracks();
        if (res.success) setTracks(res.data);
      } catch (err) {
        console.error('Failed to load tracks:', err);
      }
    };
    fetchTracks();
  }, []);

  return (
    <div className="tracks-page">
      <section className="page-header-section">
        <div className="content-container">
          <span className="page-header-badge">Research Taxonomy</span>
          <h1 className="page-header-title">Conference Tracks & Scope</h1>
          <p className="page-header-subtitle">
            Submissions are invited across three specialized technical tracks addressing core theoretical advances and real-world system applications.
          </p>
        </div>
      </section>

      <section className="page-body-section">
        <div className="content-container">
          {/* Tracks 3-Card Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>

          {/* Submission Guidelines Note */}
          <div className="glass-panel" style={{ padding: '2.5rem', background: 'var(--surface-white)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-navy)', marginBottom: '1rem' }}>
              Interdisciplinary & Cross-Track Research
            </h3>
            <p style={{ maxWidth: '750px', margin: '0 auto 1.8rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              Authors whose research spans across multiple tracks (e.g. Cognitive AI applied to 6G Network Security) may submit their manuscript under the primary domain track. The TPC will assign multidisciplinary reviewers accordingly.
            </p>
            <Link to="/submission" className="btn-primary-glow">
              <span>View Manuscript Submission Guidelines</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
