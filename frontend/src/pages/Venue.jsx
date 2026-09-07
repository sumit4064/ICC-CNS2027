import React from 'react';
import { MapPin, Plane, Train, Car, Hotel, Navigation, ExternalLink, Building } from 'lucide-react';

export const Venue = () => {
  return (
    <div className="venue-page">
      <section className="page-header-section">
        <div className="content-container">
          <span className="page-header-badge">Host Campus & Location</span>
          <h1 className="page-header-title">Venue & Travel Guide</h1>
          <p className="page-header-subtitle">
            Vignan's Foundation for Science, Technology and Research (Deemed to be University), Vadlamudi, Guntur-522213, Andhra Pradesh, India.
          </p>
        </div>
      </section>

      <section className="page-body-section">
        <div className="content-container">
          {/* Main Venue Showcase with Real Vignan Campus Photo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'center', marginBottom: '4rem' }}>
            <div className="glass-panel" style={{ overflow: 'hidden', padding: '1rem', borderRadius: 'var(--radius-xl)' }}>
              <img
                src="/images/vignan_ablock_campus.webp"
                alt="Vignan University A-Block Campus"
                style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
              />
              <div style={{ padding: '1.2rem 0.5rem 0.2rem' }}>
                <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.3rem' }}>A-Block Academic Complex & Convention Halls</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Central conference venue with modern air-conditioned auditoriums, seminar halls, and hybrid streaming infrastructure.
                </p>
              </div>
            </div>

            <div>
              <span className="badge badge-cyan" style={{ marginBottom: '1rem' }}>Campus Overview</span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', marginBottom: '1.2rem' }}>
                Welcome to Vignan University Vadlamudi Campus
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.2rem' }}>
                Spanning over a lush green, eco-friendly campus in Vadlamudi, VFSTR offers world-class educational and research facilities, specialized computing centers, high-speed fiber-optic Wi-Fi, and expansive open-air symposium lawns.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <MapPin size={18} color="var(--primary-cyan)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Address:</strong> Department of CSE, School of Computing and Informatics, VFSTR, Vadlamudi, Guntur-522213, Andhra Pradesh, India</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Navigation size={18} color="var(--primary-cyan)" />
                  <span><strong>Campus Location:</strong> Vadlamudi, Guntur District, AP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Travel & Transit Directions */}
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-navy)', marginBottom: '1.8rem', textAlign: 'center' }}>
            How to Reach the Venue
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.8rem', marginBottom: '4rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(0, 163, 199, 0.15)', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Plane size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', marginBottom: '0.6rem' }}>By Air (Vijayawada Airport)</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Vijayawada International Airport (VGA - Gannavaram) is approx 38 km from the campus. Regular domestic flights connect from Delhi, Mumbai, Bengaluru, Hyderabad, and Chennai.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(0, 163, 199, 0.15)', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Train size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', marginBottom: '0.6rem' }}>By Train (Vijayawada & Guntur)</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Vijayawada Junction (BZA) is a major national railway hub (15 km). Guntur Railway Station (GNT) is 18 km away and Tenali Junction (TEL) is 14 km away. Taxis and buses are readily available.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Hotel size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', marginBottom: '0.6rem' }}>Accommodation</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                University Guest House rooms are available for registered delegates on a prior booking basis. Reputed hotels and business stays in Guntur and Vijayawada are within a 20-minute drive.
              </p>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="glass-panel" style={{ padding: '1.5rem', overflow: 'hidden' }}>
            <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} color="var(--primary-cyan)" /> Interactive Campus Map
            </h3>
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '380px' }}>
              <iframe
                title="Vignan University Vadlamudi Map"
                src="https://maps.google.com/maps?q=Vignan's%20Foundation%20for%20Science,%20Technology%20and%20Research,%20Vadlamudi&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
