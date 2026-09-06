import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Award, BookCheck, Users, Globe2, ArrowRight, Building, GraduationCap } from 'lucide-react';

export const About = () => {
  return (
    <div className="about-page">
      {/* Header */}
      <section className="page-header-section">
        <div className="content-container">
          <span className="page-header-badge">About ICC-CNS 2027</span>
          <h1 className="page-header-title">About the Conference</h1>
          <p className="page-header-subtitle">
            Hosted by Department of Computer Science & Engineering, School of Computing and Informatics, Vignan's Foundation for Science, Technology and Research (VFSTR).
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="page-body-section">
        <div className="content-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center', marginBottom: '3.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.9rem', color: '#FFF', marginBottom: '1rem' }}>
                Conference Objectives & Vision
              </h2>
              <p style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
                The <strong>2027 International Conference on Cognitive Computing and Networking Systems (ICC-CNS 2027)</strong> provides a premier interdisciplinary forum for researchers, academicians, scientists, and industrial engineers to present and discuss the most recent innovations, trends, and practical challenges encountered in the fields of Cognitive Computing, Artificial Intelligence, and Next-Generation Networking Systems.
              </p>
              <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                Organized by the Department of Computer Science & Engineering at VFSTR, the conference brings together distinguished global computer scientists, peer-reviewed technical paper presentations, doctoral symposiums, and industrial panel sessions bridging theoretical breakthroughs with scalable engineering implementations.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/submission" className="btn-primary-glow">
                  <span>Submit Your Paper</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/tracks" className="btn-secondary-glass">
                  <span>Explore Tracks</span>
                </Link>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '0.9rem', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
              <img
                src="/images/vignan_ablock_campus.webp"
                alt="Vignan University A-Block Campus"
                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
              />
              <div style={{ padding: '0.9rem 0.5rem 0.2rem' }}>
                <h4 style={{ color: '#FFF', fontSize: '1.05rem' }}>A-Block Main Academic Building</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Vignan's Foundation for Science, Technology and Research (VFSTR), Vadlamudi
                </p>
              </div>
            </div>
          </div>

          {/* Key Highlights Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.8rem', marginBottom: '4rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', marginBottom: '1.2rem' }}>
                <div style={{ width: '50px', height: '50px', minWidth: '50px', flexShrink: 0, borderRadius: 'var(--radius-md)', background: 'rgba(255, 107, 53, 0.15)', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={26} />
                </div>
                <h3 style={{ fontSize: '1.3rem', color: '#FFF', margin: 0 }}>Indexing & Proceedings</h3>
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                All accepted, registered, and presented papers will be submitted for indexing in conference proceedings series as officially confirmed by the organizers.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', marginBottom: '1.2rem' }}>
                <div style={{ width: '50px', height: '50px', minWidth: '50px', flexShrink: 0, borderRadius: 'var(--radius-md)', background: 'rgba(0, 180, 216, 0.15)', color: '#00B4D8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe2 size={26} />
                </div>
                <h3 style={{ fontSize: '1.3rem', color: '#FFF', margin: 0 }}>Hybrid Global Mode</h3>
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Delegates can participate physically on the Vadlamudi campus or remotely through high-definition interactive virtual streaming sessions.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', marginBottom: '1.2rem' }}>
                <div style={{ width: '50px', height: '50px', minWidth: '50px', flexShrink: 0, borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={26} />
                </div>
                <h3 style={{ fontSize: '1.3rem', color: '#FFF', margin: 0 }}>Peer Review Rigor</h3>
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Double-blind peer review by an international Technical Program Committee ensures high scholarly quality and scientific impact.
              </p>
            </div>
          </div>

          {/* Department of CSE & Institutional Identity */}
          <div className="glass-panel" style={{ padding: '2.5rem', background: 'rgba(0, 31, 36, 0.88)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <Building size={24} color="var(--accent-orange)" />
              <h3 style={{ fontSize: '1.6rem', color: '#FFF' }}>
                Department of Computer Science and Engineering (Est. 1997)
              </h3>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
              Established in <strong>1997</strong> under the School of Computing and Informatics at Vignan's Foundation for Science, Technology and Research (VFSTR), the Department of Computer Science & Engineering is dedicated to imparting world-class technical education and fostering interdisciplinary research.
            </p>
            <div style={{
              background: 'rgba(0, 24, 28, 0.7)',
              padding: '1.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-orange)', fontWeight: 700, marginBottom: '0.3rem' }}>
                ACADEMIC PROGRAMS OFFERED:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <li>• B.Tech in Computer Science and Engineering</li>
                <li>• M.Tech in Computer Science and Engineering</li>
                <li>• Ph.D. in Computer Science and Engineering</li>
              </ul>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
              The department houses advanced research centers in Artificial Intelligence, Cloud Systems, Cybersecurity, and IoT, actively undertaking sponsored research projects and contributing to high-impact international journals and conferences.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
