import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { resolveImageUrl } from '../utils/imageUrl';
import { Image, ZoomIn, X, Sparkles } from 'lucide-react';

export const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.getGallery();
        if (res.success) setGallery(res.data);
      } catch (err) {
        console.error('Failed to load gallery:', err);
      }
    };
    fetchGallery();
  }, []);

  const categories = ['All', 'Campus', 'Conference', 'Research', 'Events', 'CSE Department'];

  const filteredGallery = gallery.filter((item) => {
    return activeCategory === 'All' || item.category === activeCategory;
  });

  return (
    <div className="gallery-page">
      <section className="page-header-section">
        <div className="content-container">
          <span className="page-header-badge">Campus & Event Memories</span>
          <h1 className="page-header-title">Vignan University Gallery</h1>
          <p className="page-header-subtitle">
            Authentic photographs of the Vadlamudi academic campus, research centers, technical symposiums, and university event facilities.
          </p>
        </div>
      </section>

      <section className="page-body-section">
        <div className="content-container">
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn-card-action ${activeCategory === cat ? 'btn-primary-glow' : ''}`}
                style={{
                  background: activeCategory === cat ? 'var(--primary-cyan)' : 'var(--surface-white)',
                  color: activeCategory === cat ? '#FFF' : 'var(--primary-navy)',
                  borderColor: activeCategory === cat ? 'var(--primary-cyan)' : 'var(--border-subtle)',
                  padding: '0.55rem 1.4rem'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: '1.5rem'
          }}>
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="glass-panel"
                style={{
                  overflow: 'hidden',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-lg)'
                }}
                onClick={() => setLightboxImg(item)}
              >
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={resolveImageUrl(item.image)}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform var(--transition-smooth)'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/vignan_ablock_campus.png';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '0.8rem',
                    left: '0.8rem',
                    padding: '0.25rem 0.7rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(11, 45, 107, 0.85)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#FFF'
                  }}>
                    {item.category}
                  </div>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(11, 45, 107, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                  >
                    <ZoomIn size={32} color="#FFF" />
                  </div>
                </div>

                <div style={{ padding: '1.2rem' }}>
                  <h4 style={{ color: 'var(--primary-navy)', fontSize: '1.05rem', marginBottom: '0.3rem' }}>{item.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="modal-backdrop" onClick={() => setLightboxImg(null)}>
          <div style={{ position: 'relative', maxWidth: '850px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImg(null)}
              className="modal-close-btn"
              style={{ top: '-15px', right: '-15px', background: 'var(--primary-cyan)', color: '#FFF' }}
            >
              <X size={20} />
            </button>
            <img
              src={resolveImageUrl(lightboxImg.image)}
              alt={lightboxImg.title}
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 'var(--radius-lg)' }}
            />
            <div style={{
              background: 'var(--surface-white)',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              marginTop: '0.8rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--card-shadow)'
            }}>
              <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.2rem', marginBottom: '0.2rem' }}>{lightboxImg.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{lightboxImg.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
