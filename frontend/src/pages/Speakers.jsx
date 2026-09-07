import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SpeakerCard } from '../components/SpeakerCard';
import { SpeakerModal } from '../components/SpeakerModal';
import { Search, Filter, Sparkles } from 'lucide-react';

export const Speakers = () => {
  const [speakers, setSpeakers] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const res = await api.getSpeakers();
        if (res.success) setSpeakers(res.data);
      } catch (err) {
        console.error('Failed to load speakers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpeakers();
  }, []);

  const filteredSpeakers = speakers.filter((s) => {
    const matchesFilter = filterType === 'All' || s.type === filterType;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.track && s.track.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="speakers-page">
      <section className="page-header-section">
        <div className="content-container">
          <span className="page-header-badge">Eminent Scholars & Visionaries</span>
          <h1 className="page-header-title">Distinguished Speakers</h1>
          <p className="page-header-subtitle">
            Hear from world-renowned researchers, academicians, and industry thought leaders in Cognitive Computing and Intelligent Networking.
          </p>
        </div>
      </section>

      <section className="page-body-section">
        <div className="content-container">
          {/* Filter & Search Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.2rem',
            marginBottom: '3rem'
          }}>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {['All', 'Keynote', 'Invited'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`btn-card-action ${filterType === type ? 'btn-primary-glow' : ''}`}
                  style={{
                    padding: '0.6rem 1.4rem',
                    background: filterType === type ? 'var(--primary-cyan)' : 'var(--surface-white)',
                    color: filterType === type ? '#FFFFFF' : 'var(--primary-navy)',
                    border: '1px solid var(--border-cyan)'
                  }}
                >
                  {type === 'All' ? 'All Speakers' : `${type} Speakers`}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
              <input
                type="text"
                placeholder="Search speaker, topic, university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.6rem', borderRadius: 'var(--radius-full)' }}
              />
              <Search
                size={18}
                color="var(--primary-cyan)"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Speakers Grid */}
          {filteredSpeakers.length > 0 ? (
            <div className="speakers-grid">
              {filteredSpeakers.map((speaker) => (
                <SpeakerCard
                  key={speaker.id}
                  speaker={speaker}
                  onClick={(sp) => setSelectedSpeaker(sp)}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                No speakers found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Speaker Details Modal */}
      <SpeakerModal speaker={selectedSpeaker} onClose={() => setSelectedSpeaker(null)} />
    </div>
  );
};
