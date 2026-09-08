import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      background: 'var(--deep-navy, #061D45)',
      borderTop: '1px solid rgba(0, 163, 199, 0.25)',
      padding: '3.2rem 0 1.5rem',
      position: 'relative',
      zIndex: 10,
      color: '#E0F7FA'
    }}>
      <div className="content-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem 2.5rem',
          marginBottom: '2rem'
        }}>
          {/* Brand Col with Vignan University Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <div style={{ background: '#FFF', padding: '4px 8px', borderRadius: '6px' }}>
                <img
                  src="/logos/vignan_institutional_logo.png"
                  alt="Vignan's Foundation for Science, Technology & Research Logo"
                  style={{ height: '32px', maxWidth: '140px', objectFit: 'contain', display: 'block' }}
                />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: '#FFF' }}>
                ICCCNS-<span style={{ color: 'var(--primary-cyan, #00A3C7)' }}>2027</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#B0D6E2', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Second International Conference on Cognitive Computing and Networking Systems (ICCCNS 2027). Organized by Department of Computer Science & Engineering (Est. 1997), School of Computing & Informatics, VFSTR (Deemed to be University).
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <span className="badge badge-teal" style={{ background: 'rgba(0, 163, 199, 0.25)', color: '#FFFFFF', border: '1px solid #00A3C7' }}>Hybrid Mode</span>
              <span className="badge badge-cyan" style={{ background: 'rgba(0, 163, 199, 0.25)', color: '#FFFFFF', border: '1px solid #00A3C7' }}>10–12 June 2027</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <li><Link to="/about" className="nav-link" style={{ padding: 0, color: '#D1EEF5' }}>About Conference</Link></li>
              <li><Link to="/speakers" className="nav-link" style={{ padding: 0, color: '#D1EEF5' }}>Keynote Speakers</Link></li>
              <li><Link to="/tracks" className="nav-link" style={{ padding: 0, color: '#D1EEF5' }}>Conference Tracks & Topics</Link></li>
              <li><Link to="/dates" className="nav-link" style={{ padding: 0, color: '#D1EEF5' }}>Important Dates & Deadlines</Link></li>
              <li><Link to="/submission" className="nav-link" style={{ padding: 0, color: '#D1EEF5' }}>Call for Papers & Submission</Link></li>
              <li><Link to="/registration" className="nav-link" style={{ padding: 0, color: '#D1EEF5' }}>Author & Attendee Registration</Link></li>
            </ul>
          </div>

          {/* Tracks */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              Conference Tracks
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <li style={{ fontSize: '0.88rem', color: '#D1EEF5' }}>
                <span style={{ color: '#00E5FF', fontWeight: 'bold' }}>Track 01:</span> Cognitive Computing & AI
              </li>
              <li style={{ fontSize: '0.88rem', color: '#D1EEF5' }}>
                <span style={{ color: '#34D399', fontWeight: 'bold' }}>Track 02:</span> Intelligent Networking & 5G/6G
              </li>
              <li style={{ fontSize: '0.88rem', color: '#D1EEF5' }}>
                <span style={{ color: '#38BDF8', fontWeight: 'bold' }}>Track 03:</span> Data Science & Blockchain
              </li>
              <li style={{ marginTop: '0.5rem' }}>
                <Link to="/committee" className="card-link-more" style={{ color: '#00E5FF' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#D1EEF5' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="#00E5FF" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>Department of CSE, VFSTR (Deemed to be University), Vadlamudi, Guntur-522213, Andhra Pradesh, India</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Mail size={18} color="#38BDF8" style={{ flexShrink: 0 }} />
                <span>info@vignan.ac.in | icccns2027@vignan.ac.in</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Phone size={18} color="#34D399" style={{ flexShrink: 0 }} />
                <span>+91-863-2344 700 / 701</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(0, 163, 199, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#A5D7E8'
        }}>
          <div>
            © 2027 ICCCNS-2027 Conference Secretariat. Hosted by Department of CSE, Vignan's Foundation for Science, Technology and Research (VFSTR).
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/about" style={{ color: '#A5D7E8' }}>About</Link>
            <Link to="/venue" style={{ color: '#A5D7E8' }}>Venue</Link>
            <Link to="/contact" style={{ color: '#A5D7E8' }}>Contact</Link>
            <Link to="/login" style={{ color: '#00E5FF', fontWeight: 600 }}>Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
