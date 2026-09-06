import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(0, 20, 24, 0.96)',
      borderTop: '1px solid var(--glass-border)',
      padding: '4.5rem 0 2rem',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="content-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3.5rem'
        }}>
          {/* Brand Col with Vignan University Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <div style={{ background: '#FFF', padding: '4px 8px', borderRadius: '6px' }}>
                <img
                  src="/logos/vignan_official_logo.svg"
                  alt="Vignan University Logo"
                  style={{ height: '32px', maxWidth: '140px', objectFit: 'contain' }}
                />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: '#FFF' }}>
                ICC-<span style={{ color: 'var(--accent-orange)' }}>CNS</span> 2027
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              2027 International Conference on Cognitive Computing and Networking Systems. Organized by Department of Computer Science & Engineering (Est. 1997), School of Computing & Informatics, VFSTR (Deemed to be University).
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <span className="badge badge-teal">Hybrid Mode</span>
              <span className="badge badge-orange">11–13 June 2027</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <li><Link to="/about" className="nav-link" style={{ padding: 0 }}>About Conference</Link></li>
              <li><Link to="/speakers" className="nav-link" style={{ padding: 0 }}>Keynote Speakers</Link></li>
              <li><Link to="/tracks" className="nav-link" style={{ padding: 0 }}>Conference Tracks & Topics</Link></li>
              <li><Link to="/dates" className="nav-link" style={{ padding: 0 }}>Important Dates & Deadlines</Link></li>
              <li><Link to="/submission" className="nav-link" style={{ padding: 0 }}>Call for Papers & Submission</Link></li>
              <li><Link to="/registration" className="nav-link" style={{ padding: 0 }}>Author & Attendee Registration</Link></li>
            </ul>
          </div>

          {/* Tracks */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              Conference Tracks
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <li style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: '#FF6B35', fontWeight: 'bold' }}>Track 01:</span> Cognitive Computing & AI
              </li>
              <li style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: '#10B981', fontWeight: 'bold' }}>Track 02:</span> Intelligent Networking & 5G/6G
              </li>
              <li style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: '#0EA5E9', fontWeight: 'bold' }}>Track 03:</span> Data Science & Blockchain
              </li>
              <li style={{ marginTop: '0.5rem' }}>
                <Link to="/committee" className="card-link-more">
                  <span>View Organizing Committee</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Vignan Contact */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              Conference Secretariat
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>Department of CSE, VFSTR (Deemed to be University), Vadlamudi, Guntur-522213, Andhra Pradesh, India</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Mail size={18} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                <span>info@vignan.ac.in | icccns2027@vignan.ac.in</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
                <span>+91-863-2344 700 / 701</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--glass-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © 2027 ICC-CNS Conference Secretariat. Hosted by Department of CSE, Vignan's Foundation for Science, Technology and Research (VFSTR).
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/about" style={{ color: 'var(--text-muted)' }}>About</Link>
            <Link to="/venue" style={{ color: 'var(--text-muted)' }}>Venue</Link>
            <Link to="/contact" style={{ color: 'var(--text-muted)' }}>Contact</Link>
            <Link to="/login" style={{ color: 'var(--accent-orange)' }}>Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
